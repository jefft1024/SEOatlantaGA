/* Admin dashboard for SEOAtlantaGA.com — overview, posts, leads and
 * lead-delivery settings, backed by Supabase. All access is enforced by Row
 * Level Security: nothing here works until a valid admin is signed in. */
(function () {
  "use strict";

  var sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var editingId = null;
  var TITLES = { overview: "Overview", posts: "Blog posts", editor: "Editor", leads: "Leads", settings: "Lead delivery" };

  /* ── helpers ──────────────────────────────────────────────────────────── */
  function toast(msg, kind) {
    var t = $("#toast");
    t.textContent = msg;
    t.className = "toast show" + (kind ? " " + kind : "");
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.className = "toast" + (kind ? " " + kind : ""); }, 2600);
  }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function slugify(s) {
    return String(s || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
  }
  function fmt(iso) {
    if (!iso) return "";
    var d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
  }
  function fmtDT(iso) {
    if (!iso) return "";
    var d = new Date(iso); return isNaN(d) ? "" : d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  }
  var EMPTY = '<svg viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/><path d="M4 8l8 5 8-5"/></svg>';

  /* ── view switching ───────────────────────────────────────────────────── */
  function show(view) {
    ["overview", "posts", "editor", "leads", "settings"].forEach(function (v) {
      var el = $("#view-" + v); if (el) el.classList.toggle("hidden", v !== view);
    });
    $$(".nav-item").forEach(function (b) { b.classList.toggle("active", b.dataset.view === view); });
    $("#viewTitle").textContent = TITLES[view] || "";
    closeSidebar();
  }
  $$(".nav-item").forEach(function (b) {
    b.addEventListener("click", function () { go(b.dataset.view); });
  });
  document.addEventListener("click", function (e) {
    var g = e.target.closest && e.target.closest("[data-goto]");
    if (g) go(g.dataset.goto);
  });
  function go(v) {
    show(v);
    if (v === "overview") loadOverview();
    if (v === "posts") loadPosts();
    if (v === "leads") loadLeads();
    if (v === "settings") loadSettings();
  }

  /* mobile sidebar */
  function openSidebar() { $("#sidebar").classList.add("open"); $("#scrim").classList.remove("hidden"); }
  function closeSidebar() { $("#sidebar").classList.remove("open"); $("#scrim").classList.add("hidden"); }
  $("#menuToggle").addEventListener("click", openSidebar);
  $("#scrim").addEventListener("click", closeSidebar);

  /* ── auth ─────────────────────────────────────────────────────────────── */
  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    $("#loginMsg").textContent = "Signing in…";
    sb.auth.signInWithPassword({ email: $("#email").value.trim(), password: $("#password").value })
      .then(function (r) {
        if (r.error) { $("#loginMsg").textContent = r.error.message; return; }
        $("#loginMsg").textContent = "";
        enterApp(r.data.user);
      });
  });
  $("#logout").addEventListener("click", function () { sb.auth.signOut().then(function () { location.reload(); }); });

  function enterApp(user) {
    $("#login").classList.add("hidden");
    $("#app").classList.remove("hidden");
    $("#whoami").textContent = user ? user.email : "";
    go("overview");
  }

  /* ── overview ─────────────────────────────────────────────────────────── */
  function loadOverview() {
    sb.from("posts").select("status").then(function (r) {
      var rows = (r.data) || [];
      var pub = rows.filter(function (p) { return p.status === "published"; }).length;
      $("#stat-posts").textContent = rows.length;
      $("#stat-published").textContent = pub;
      $("#stat-drafts").textContent = rows.length - pub;
    });
    sb.from("leads").select("*").order("created_at", { ascending: false }).limit(6).then(function (r) {
      var rows = (r.data) || [];
      sb.from("leads").select("id", { count: "exact", head: true }).then(function (c) {
        $("#stat-leads").textContent = (c.count != null ? c.count : rows.length);
      });
      var el = $("#recentLeads");
      if (!rows.length) { el.innerHTML = '<div class="empty">' + EMPTY + "<div>No leads yet. Submissions from your site's forms will show up here.</div></div>"; return; }
      el.innerHTML = "<table><tbody>" + rows.map(function (l) {
        return "<tr><td style='width:150px' class='muted'>" + fmtDT(l.created_at) +
          "<br><span class='pill " + esc(l.status) + "'>" + esc(l.status) + "</span></td>" +
          "<td><b>" + esc(l.name || "—") + "</b>" + (l.email ? " · <a href='mailto:" + esc(l.email) + "'>" + esc(l.email) + "</a>" : "") +
          (l.website ? "<br><span class='muted' style='font-size:12.5px'>" + esc(l.website) + "</span>" : "") + "</td>" +
          "<td class='muted' style='font-size:13px'>" + esc((l.message || "").slice(0, 90)) + "</td></tr>";
      }).join("") + "</tbody></table>";
    });
  }

  /* ── posts: list ──────────────────────────────────────────────────────── */
  function loadPosts() {
    var el = $("#postList");
    el.innerHTML = '<div class="empty">Loading…</div>';
    sb.from("posts").select("*").order("created_at", { ascending: false }).then(function (r) {
      if (r.error) { el.innerHTML = '<div class="empty">' + esc(r.error.message) + "</div>"; return; }
      var rows = r.data || [];
      if (!rows.length) {
        el.innerHTML = '<div class="empty">' + EMPTY + "<div>No posts yet. Click <b>New post</b> to write your first one.</div></div>"; return;
      }
      el.innerHTML = "<table><thead><tr><th>Title</th><th>Status</th><th>Date</th><th></th></tr></thead><tbody>" +
        rows.map(function (p) {
          return "<tr><td><b>" + esc(p.title) + "</b><br><span class='muted' style='font-size:12.5px'>/blog/" + esc(p.slug) + "</span></td>" +
            "<td><span class='pill " + esc(p.status) + "'>" + esc(p.status) + "</span></td>" +
            "<td class='muted' style='white-space:nowrap'>" + fmt(p.published_at || p.created_at) + "</td>" +
            "<td><div class='row' style='justify-content:flex-end;flex-wrap:nowrap;gap:6px'>" +
              (p.status === "published"
                ? "<a class='btn ghost sm' href='/blog/" + esc(p.slug) + "' target='_blank'>View</a><button class='btn ghost sm' data-un='" + p.id + "'>Unpublish</button>"
                : "<button class='btn sm' data-pub='" + p.id + "'>Publish</button>") +
            "<button class='btn ghost sm' data-edit='" + p.id + "'>Edit</button>" +
            "<button class='btn danger sm' data-del='" + p.id + "'>Delete</button>" +
            "</div></td></tr>";
        }).join("") + "</tbody></table>";

      el.querySelectorAll("[data-edit]").forEach(function (b) { b.addEventListener("click", function () { openEditor(rows.find(function (x) { return x.id === b.dataset.edit; })); }); });
      el.querySelectorAll("[data-pub]").forEach(function (b) { b.addEventListener("click", function () { setStatus(b.dataset.pub, "published"); }); });
      el.querySelectorAll("[data-un]").forEach(function (b) { b.addEventListener("click", function () { setStatus(b.dataset.un, "draft"); }); });
      el.querySelectorAll("[data-del]").forEach(function (b) { b.addEventListener("click", function () { delPost(b.dataset.del); }); });
    });
  }
  function setStatus(id, status) {
    var patch = { status: status };
    if (status === "published") patch.published_at = new Date().toISOString();
    sb.from("posts").update(patch).eq("id", id).then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast(status === "published" ? "Published — live now" : "Moved to draft", "ok");
      loadPosts();
    });
  }
  function delPost(id) {
    if (!confirm("Delete this post permanently?")) return;
    sb.from("posts").delete().eq("id", id).then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast("Deleted", "ok"); loadPosts();
    });
  }

  /* ── posts: editor ────────────────────────────────────────────────────── */
  function openEditor(p) {
    editingId = p ? p.id : null;
    $("#editorTitle").textContent = p ? "Edit post" : "New post";
    $("#f-title").value = p ? p.title || "" : "";
    $("#f-slug").value = p ? p.slug || "" : "";
    $("#f-category").value = p ? p.category || "" : "";
    $("#f-excerpt").value = p ? p.excerpt || "" : "";
    $("#f-cover").value = p ? p.cover_url || "" : "";
    $("#f-read").value = p ? p.read_minutes || 5 : 5;
    $("#f-body").value = p ? p.body_md || "" : "";
    $("#f-metatitle").value = p ? p.meta_title || "" : "";
    $("#f-metadesc").value = p ? p.meta_description || "" : "";
    renderPreview();
    show("editor");
  }
  function renderPreview() {
    var md = $("#f-body").value || "";
    var title = $("#f-title").value || "Untitled";
    $("#preview").innerHTML = "<h1>" + esc(title) + "</h1>" + window.marked.parse(md);
  }
  $("#f-body").addEventListener("input", renderPreview);
  $("#f-title").addEventListener("input", function () {
    if (!editingId && !$("#f-slug").value) $("#f-slug").value = slugify($("#f-title").value);
    renderPreview();
  });
  $("#newPost").addEventListener("click", function () { openEditor(null); });
  $("#topNewPost").addEventListener("click", function () { openEditor(null); });
  $("#cancelEdit").addEventListener("click", function () { go("posts"); });
  $("#saveDraft").addEventListener("click", function () { savePost("draft"); });
  $("#publishPost").addEventListener("click", function () { savePost("published"); });

  function savePost(status) {
    var title = $("#f-title").value.trim();
    var slug = slugify($("#f-slug").value || title);
    if (!title) return toast("Give the post a title", "err");
    if (!slug) return toast("Give the post a URL slug", "err");
    var md = $("#f-body").value || "";
    var rec = {
      title: title, slug: slug,
      category: $("#f-category").value.trim() || "SEO",
      excerpt: $("#f-excerpt").value.trim(),
      cover_url: $("#f-cover").value.trim(),
      read_minutes: parseInt($("#f-read").value, 10) || 5,
      body_md: md, body_html: window.marked.parse(md),
      meta_title: $("#f-metatitle").value.trim(),
      meta_description: $("#f-metadesc").value.trim(),
      status: status
    };
    if (status === "published") rec.published_at = new Date().toISOString();
    var q = editingId ? sb.from("posts").update(rec).eq("id", editingId) : sb.from("posts").insert(rec);
    q.then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast(status === "published" ? "Published — live now" : "Draft saved", "ok");
      go("posts");
    });
  }

  /* ── leads ────────────────────────────────────────────────────────────── */
  function loadLeads() {
    var el = $("#leadList");
    el.innerHTML = '<div class="empty">Loading…</div>';
    sb.from("leads").select("*").order("created_at", { ascending: false }).limit(500).then(function (r) {
      if (r.error) { el.innerHTML = '<div class="empty">' + esc(r.error.message) + "</div>"; return; }
      var rows = r.data || [];
      if (!rows.length) { el.innerHTML = '<div class="empty">' + EMPTY + "<div>No leads yet. Submissions from your site's forms will appear here.</div></div>"; return; }
      el.innerHTML = "<table><thead><tr><th>When</th><th>Who</th><th>Message</th><th>Page</th><th></th></tr></thead><tbody>" +
        rows.map(function (l) {
          var who = "<b>" + esc(l.name || "—") + "</b><br>" +
            (l.email ? "<a href='mailto:" + esc(l.email) + "'>" + esc(l.email) + "</a><br>" : "") +
            (l.website ? "<span class='muted' style='font-size:12.5px'>" + esc(l.website) + "</span> " : "") +
            (l.phone ? "<span class='muted' style='font-size:12.5px'>" + esc(l.phone) + "</span>" : "");
          var det = [l.service, l.budget].filter(Boolean).map(esc).join(" · ");
          return "<tr><td class='muted' style='white-space:nowrap'>" + fmtDT(l.created_at) +
            "<br><span class='pill " + esc(l.status) + "'>" + esc(l.status) + "</span></td>" +
            "<td>" + who + "</td>" +
            "<td>" + (det ? "<div class='muted' style='font-size:12.5px;margin-bottom:4px'>" + det + "</div>" : "") + esc(l.message || "") + "</td>" +
            "<td class='muted' style='font-size:12.5px'>" + esc(l.page || "") + "</td>" +
            "<td><div class='row' style='flex-wrap:nowrap;gap:6px'>" +
              (l.status !== "read" ? "<button class='btn ghost sm' data-read='" + l.id + "'>Read</button>" : "") +
              (l.status !== "archived" ? "<button class='btn ghost sm' data-arch='" + l.id + "'>Archive</button>" : "") +
            "</div></td></tr>";
        }).join("") + "</tbody></table>";
      el.querySelectorAll("[data-read]").forEach(function (b) { b.addEventListener("click", function () { leadStatus(b.dataset.read, "read"); }); });
      el.querySelectorAll("[data-arch]").forEach(function (b) { b.addEventListener("click", function () { leadStatus(b.dataset.arch, "archived"); }); });
    });
  }
  function leadStatus(id, status) {
    sb.from("leads").update({ status: status }).eq("id", id).then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      loadLeads();
    });
  }
  $("#refreshLeads").addEventListener("click", loadLeads);

  /* ── settings ─────────────────────────────────────────────────────────── */
  function loadSettings() {
    sb.from("settings").select("*").eq("id", 1).single().then(function (r) {
      var s = r.data || {};
      $("#s-to").value = s.lead_to_email || "";
      $("#s-from").value = s.lead_from_email || "";
      $("#s-webhook").value = s.lead_webhook_url || "";
      var configured = s.lead_to_email || s.lead_webhook_url;
      $("#emailStatus").innerHTML = configured
        ? '<div class="banner ok"><div>✓ Delivery is configured. Leads are also saved to this dashboard automatically.</div></div>'
        : '<div class="banner"><div><b>Email delivery isn\'t set up yet.</b> Leads are being saved here, but to also get them emailed to your inbox, add a <code>RESEND_API_KEY</code> in Vercel and set the address below. Until then, check this dashboard for new leads.</div></div>';
    });
  }
  $("#saveSettings").addEventListener("click", function () {
    sb.from("settings").update({
      lead_to_email: $("#s-to").value.trim(),
      lead_from_email: $("#s-from").value.trim(),
      lead_webhook_url: $("#s-webhook").value.trim()
    }).eq("id", 1).then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast("Settings saved", "ok"); loadSettings();
    });
  });

  /* ── boot ─────────────────────────────────────────────────────────────── */
  sb.auth.getSession().then(function (r) { if (r.data && r.data.session) enterApp(r.data.session.user); });
})();
