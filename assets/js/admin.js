/* Admin dashboard for SEOAtlantaGA.com — overview, posts, pages, leads and
 * lead-delivery settings, backed by Supabase. Access is enforced by Row Level
 * Security: nothing here works until a valid admin is signed in. */
(function () {
  "use strict";

  var sb = window.supabase.createClient(window.SUPABASE_URL, window.SUPABASE_ANON_KEY);
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };
  var editingId = null;
  var TITLES = { overview: "Overview", posts: "Blog posts", pages: "Pages", editor: "Editor", "svc-editor": "Edit page", "home-editor": "Edit homepage", leads: "Leads", tracking: "Tracking & analytics", snippet: "Code snippet", redirects: "Redirects", redirect: "Redirect", settings: "Lead delivery" };

  /* The site's code-built pages (static). Blog posts are added dynamically. */
  var SITE_PAGES = [
    { t: "Home", u: "/", k: "core" },
    { t: "Contact", u: "/contact", k: "core" },
    { t: "Blog", u: "/blog", k: "core" },
    { t: "Local SEO", u: "/services/local-seo", k: "service" },
    { t: "AI Content Engine", u: "/services/ai-content", k: "service" },
    { t: "Technical SEO", u: "/services/technical-seo", k: "service" },
    { t: "Answer Engine Optimization", u: "/services/answer-engine-optimization", k: "service" },
    { t: "Link Building", u: "/services/link-building", k: "service" },
    { t: "Reporting & Analytics", u: "/services/seo-reporting", k: "service" },
    { t: "Privacy Policy", u: "/privacy", k: "legal" },
    { t: "Terms of Service", u: "/terms", k: "legal" }
  ];
  var KLABEL = { core: "Core", service: "Service", legal: "Legal", content: "Blog" };

  /* Marketing pages editable in the dashboard, keyed by their URL. */
  var EDITABLE_PAGES = { "/": "home", "/contact": "contact", "/privacy": "privacy", "/terms": "terms" };
  var PAGE_META = {
    home: { title: "Edit homepage", url: "/", content: "/api/home-content" },
    contact: { title: "Edit contact page", url: "/contact", content: "/api/page-content?p=contact" },
    privacy: { title: "Edit privacy policy", url: "/privacy", content: "/api/page-content?p=privacy" },
    terms: { title: "Edit terms of service", url: "/terms", content: "/api/page-content?p=terms" }
  };

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
  function fmt(iso) { if (!iso) return ""; var d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }); }
  function fmtDT(iso) { if (!iso) return ""; var d = new Date(iso); return isNaN(d) ? "" : d.toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }); }

  var AV_COLORS = ["#2f6bf6", "#0e8a5f", "#6b4de6", "#b26a08", "#0d9488", "#d33a4b", "#3457d5", "#c026a8"];
  function avatar(name, email, size) {
    var s = (name || email || "?").trim();
    var initials = s.split(/\s+/).map(function (w) { return w[0]; }).join("").slice(0, 2).toUpperCase() || (email || "?")[0].toUpperCase();
    var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
    var bg = AV_COLORS[h % AV_COLORS.length];
    var sz = size ? "width:" + size + "px;height:" + size + "px;font-size:" + Math.round(size * 0.4) + "px;" : "";
    return '<span class="avatar" style="background:' + bg + ";" + sz + '">' + esc(initials) + "</span>";
  }
  var ICN_INBOX = '<svg class="icn" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M4 7l8 5 8-5"/></svg>';
  var ICN_DOC = '<svg class="icn" viewBox="0 0 24 24"><path d="M14 3v5h5"/><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/></svg>';
  var ICN_OPEN = '<svg class="icn" viewBox="0 0 24 24"><path d="M7 17 17 7M9 7h8v8"/></svg>';

  /* ── view switching ───────────────────────────────────────────────────── */
  function show(view) {
    ["overview", "posts", "pages", "editor", "svc-editor", "home-editor", "leads", "tracking", "snippet", "redirects", "redirect", "settings"].forEach(function (v) {
      var el = $("#view-" + v); if (el) el.classList.toggle("hidden", v !== view);
    });
    $$(".nav-item").forEach(function (b) { b.classList.toggle("active", b.dataset.view === view); });
    $("#viewTitle").textContent = TITLES[view] || "";
    // The top-bar "New post" button belongs to the Blog posts view only.
    var tn = $("#topNewPost"); if (tn) tn.classList.toggle("hidden", view !== "posts");
    closeSidebar();
  }
  $$(".nav-item").forEach(function (b) { b.addEventListener("click", function () { go(b.dataset.view); }); });
  document.addEventListener("click", function (e) {
    var g = e.target.closest && e.target.closest("[data-goto]");
    if (g) go(g.dataset.goto);
  });
  function go(v) {
    show(v);
    if (v === "overview") loadOverview();
    if (v === "posts") loadPosts();
    if (v === "pages") loadPages();
    if (v === "leads") loadLeads();
    if (v === "tracking") loadTracking();
    if (v === "redirects") loadRedirects();
    if (v === "settings") loadSettings();
  }

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
    $("#whoAvatar").outerHTML = avatar("", user ? user.email : "?", 32).replace('class="avatar"', 'class="avatar" id="whoAvatar"');
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
    sb.from("leads").select("id", { count: "exact", head: true }).then(function (c) {
      if (c.count != null) $("#stat-leads").textContent = c.count;
    });
    sb.from("leads").select("*").order("created_at", { ascending: false }).limit(6).then(function (r) {
      var rows = (r.data) || [];
      if ($("#stat-leads").textContent === "–") $("#stat-leads").textContent = rows.length;
      var el = $("#recentLeads");
      if (!rows.length) { el.innerHTML = '<div class="empty">' + ICN_INBOX + "<div>No leads yet. Submissions from your site's forms show up here.</div></div>"; return; }
      el.innerHTML = "<table><tbody>" + rows.map(function (l) {
        return "<tr><td style='width:280px'><div style='display:flex;align-items:center;gap:11px'>" + avatar(l.name, l.email, 36) +
          "<div><b>" + esc(l.name || "—") + "</b>" + (l.email ? "<br><a href='mailto:" + esc(l.email) + "' style='font-size:12.5px'>" + esc(l.email) + "</a>" : "") + "</div></div></td>" +
          "<td class='muted' style='font-size:13px'>" + esc((l.message || "").slice(0, 90)) + "</td>" +
          "<td style='text-align:right;white-space:nowrap'><span class='pill " + esc(l.status) + "'>" + esc(l.status) + "</span><br><span class='muted' style='font-size:12px'>" + fmtDT(l.created_at) + "</span></td></tr>";
      }).join("") + "</tbody></table>";
    });
  }

  /* ── posts ────────────────────────────────────────────────────────────── */
  function loadPosts() {
    var el = $("#postList");
    el.innerHTML = '<div class="empty">Loading…</div>';
    sb.from("posts").select("*").order("created_at", { ascending: false }).then(function (r) {
      if (r.error) { el.innerHTML = '<div class="empty">' + esc(r.error.message) + "</div>"; return; }
      var rows = r.data || [];
      if (!rows.length) { el.innerHTML = '<div class="empty">' + ICN_DOC + "<div>No posts yet. Click <b>New post</b> to write your first one.</div></div>"; return; }
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

  /* ── pages ────────────────────────────────────────────────────────────── */
  function pageCard(t, u, k, editId) {
    var action;
    if (k === "content" && editId) action = '<button class="btn sm" data-editpost="' + editId + '">Edit</button>';
    else if (k === "service") action = '<button class="btn sm" data-editsvc="' + esc(u.split("/").pop()) + '">Edit</button>';
    else if (PAGE_META[EDITABLE_PAGES[u]]) action = '<button class="btn sm" data-editpage="' + EDITABLE_PAGES[u] + '">Edit</button>';
    else action = '<span class="badge-edit">Managed in code</span>';
    return '<div class="pagecard">' +
      '<div class="top"><span class="tag ' + k + '">' + (KLABEL[k] || k) + "</span>" +
        (k === "content" || k === "service" ? '<span class="pill live">live</span>' : "") + "</div>" +
      "<div><h4>" + esc(t) + '</h4><div class="path">' + esc(u) + "</div></div>" +
      '<div class="acts">' +
        '<a class="btn ghost sm" href="' + esc(u) + '" target="_blank">Open ' + ICN_OPEN + "</a>" + action +
      "</div></div>";
  }
  function loadPages() {
    var grid = $("#pagesGrid");
    grid.innerHTML = SITE_PAGES.map(function (p) { return pageCard(p.t, p.u, p.k); }).join("");
    wireSvcEdit(grid);
    sb.from("posts").select("id,slug,title,status").order("created_at", { ascending: false }).then(function (r) {
      var rows = (r.data || []).filter(function (p) { return p.status === "published"; });
      if (!rows.length) return;
      grid.insertAdjacentHTML("beforeend", rows.map(function (p) { return pageCard(p.title, "/blog/" + p.slug, "content", p.id); }).join(""));
      grid.querySelectorAll("[data-editpost]").forEach(function (b) {
        b.addEventListener("click", function () {
          sb.from("posts").select("*").eq("id", b.dataset.editpost).single().then(function (rr) { if (rr.data) openEditor(rr.data); });
        });
      });
    });
  }
  function wireSvcEdit(grid) {
    grid.querySelectorAll("[data-editsvc]").forEach(function (b) {
      b.addEventListener("click", function () { openServiceEditor(b.dataset.editsvc); });
    });
    grid.querySelectorAll("[data-editpage]").forEach(function (b) {
      b.addEventListener("click", function () { openPageEditor(b.dataset.editpage); });
    });
  }

  /* ── marketing-page editor (home, contact, privacy, terms) ────────────── */
  var editingPage = null;
  function openPageEditor(page) {
    var m = PAGE_META[page];
    if (!m) return;
    editingPage = page;
    $("#pageEditorTitle").textContent = m.title;
    $("#pageViewLink").href = m.url;
    $("#homeForm").innerHTML = '<div class="empty">Loading…</div>';
    show("home-editor");
    fetch(m.content)
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.fields) { $("#homeForm").innerHTML = '<div class="empty">Could not load this page.</div>'; return; }
        buildHomeForm(j.fields);
      })
      .catch(function () { $("#homeForm").innerHTML = '<div class="empty">Could not load this page.</div>'; });
  }
  function buildHomeForm(fields) {
    var html = "", group = null;
    fields.forEach(function (f) {
      var parts = f.label.split("—");
      var section = parts.length > 1 ? parts[0].trim() : "Page";
      var fieldLabel = parts.length > 1 ? parts.slice(1).join("—").trim() : f.label;
      if (section !== group) {
        if (group !== null) html += "</div>";
        html += '<div class="sv-sec"><div class="sv-h">' + esc(section) + "</div>";
        group = section;
      }
      var rows = f.html.length > 90 ? 3 : 1;
      html += '<div class="field"><label>' + esc(fieldLabel) + "</label>" +
        '<textarea id="hm-' + esc(f.key) + '" rows="' + rows + '">' + esc(f.html) + "</textarea></div>";
    });
    if (group !== null) html += "</div>";
    $("#homeForm").innerHTML = html;
  }
  function gatherHome() {
    var data = {};
    $$('#homeForm textarea[id^="hm-"]').forEach(function (t) {
      data[t.id.slice(3)] = t.value;
    });
    return data;
  }
  $("#homeBack").addEventListener("click", function () { go("pages"); });
  $("#homeSave").addEventListener("click", function () {
    if (!editingPage) return;
    sb.from("page_overrides").upsert({ page: editingPage, data: gatherHome(), updated_at: new Date().toISOString() }, { onConflict: "page" })
      .then(function (r) {
        if (r.error) return toast(r.error.message, "err");
        toast("Saved — live within a minute", "ok");
      });
  });
  $("#homeReset").addEventListener("click", function () {
    if (!editingPage || !confirm("Reset this page to its original wording? Your edits will be removed.")) return;
    sb.from("page_overrides").delete().eq("page", editingPage).then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast("Reset to original", "ok");
      openPageEditor(editingPage);
    });
  });

  /* ── service-page editor ──────────────────────────────────────────────── */
  var svcSlug = null;
  function tArea(id, val, ph, rows) {
    return '<textarea id="' + id + '" rows="' + (rows || 3) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : "") + ">" + esc(val || "") + "</textarea>";
  }
  function tInput(id, val, ph) {
    return '<input id="' + id + '" value="' + esc(val || "") + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : "") + ">";
  }
  function rowHTML(type, vals) {
    vals = vals || [];
    if (type === "feats") {
      return '<div class="svrow" style="grid-template-columns:74px 1fr 1.6fr">' +
        '<input class="sv-ico" data-k="0" value="' + esc(vals[0] || "") + '" placeholder="icon">' +
        '<input data-k="1" value="' + esc(vals[1] || "") + '" placeholder="Heading">' +
        '<textarea data-k="2" rows="2" placeholder="Description">' + esc(vals[2] || "") + "</textarea>" +
        '<button class="rm" title="Remove" type="button">×</button></div>';
    }
    // steps + faqs: two columns
    var ph = type === "faqs" ? ["Question", "Answer"] : ["Heading", "Description"];
    return '<div class="svrow" style="grid-template-columns:1fr 1.6fr">' +
      '<input data-k="0" value="' + esc(vals[0] || "") + '" placeholder="' + ph[0] + '">' +
      '<textarea data-k="1" rows="2" placeholder="' + ph[1] + '">' + esc(vals[1] || "") + "</textarea>" +
      '<button class="rm" title="Remove" type="button">×</button></div>';
  }
  function rowsBlock(type, items) {
    return '<div id="sv-' + type + '">' + (items || []).map(function (it) { return rowHTML(type, it); }).join("") + "</div>" +
      '<button class="sv-add" type="button" data-add="' + type + '">+ Add</button>';
  }
  function buildSvcForm(c) {
    $("#svcForm").innerHTML =
      '<div class="sv-sec"><div class="sv-h">Hero</div><div class="sv-d">The headline and opening line at the top of the page.</div>' +
        '<div class="grid2"><div class="field"><label>Headline — first part</label>' + tInput("sv-h1a", c.h1a) + "</div>" +
        '<div class="field"><label>Headline — highlighted words</label>' + tInput("sv-h1b", c.h1b) + "</div></div>" +
        '<div class="field" style="margin-bottom:0"><label>Subheading</label>' + tArea("sv-sub", c.sub, "", 2) + "</div></div>" +

      '<div class="sv-sec"><div class="sv-h">Intro</div>' +
        '<div class="field"><label>Section heading</label>' + tInput("sv-introHead", c.introHead) + "</div>" +
        '<div class="field" style="margin-bottom:0"><label>Paragraphs <span class="muted">(one per block, separate with a blank line)</span></label>' +
          tArea("sv-intro", (c.intro || []).join("\n\n"), "", 7) + "</div></div>" +

      '<div class="sv-sec"><div class="sv-h">What\'s included</div>' +
        '<div class="field"><label>Section heading</label>' + tInput("sv-h2Included", c.h2Included) + "</div>" +
        '<label>Features</label>' + rowsBlock("feats", c.feats) + "</div>" +

      '<div class="sv-sec"><div class="sv-h">Process</div>' +
        '<div class="field"><label>Section heading</label>' + tInput("sv-h2Process", c.h2Process) + "</div>" +
        '<label>Steps</label>' + rowsBlock("steps", c.steps) + "</div>" +

      '<div class="sv-sec"><div class="sv-h">Who it\'s for</div>' +
        '<div class="field"><label>Section heading</label>' + tInput("sv-h2ForWho", c.h2ForWho) + "</div>" +
        '<div class="field"><label>List <span class="muted">(one per line)</span></label>' + tArea("sv-forWho", (c.forWho || []).join("\n"), "", 5) + "</div>" +
        '<div class="field" style="margin-bottom:0"><label>Closing paragraph</label>' + tArea("sv-tail", c.tail, "", 3) + "</div></div>" +

      '<div class="sv-sec"><div class="sv-h">FAQ</div>' +
        '<div class="field"><label>Section heading</label>' + tInput("sv-h2Faq", c.h2Faq) + "</div>" +
        '<label>Questions &amp; answers</label>' + rowsBlock("faqs", c.faqs) + "</div>" +

      '<div class="sv-sec"><div class="sv-h">SEO</div>' +
        '<div class="field"><label>Browser title</label>' + tInput("sv-title", c.title) + "</div>" +
        '<div class="field" style="margin-bottom:0"><label>Meta description</label>' + tArea("sv-desc", c.desc, "", 2) + "</div></div>";
  }
  function openServiceEditor(slug) {
    svcSlug = slug;
    $("#svcForm").innerHTML = '<div class="empty">Loading…</div>';
    $("#svcView").href = "/services/" + slug;
    show("svc-editor");
    fetch("/api/service-content?slug=" + encodeURIComponent(slug))
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!j.content) { $("#svcForm").innerHTML = '<div class="empty">Could not load this page.</div>'; return; }
        $("#svcEditorTitle").textContent = "Edit: " + (j.content.name || slug);
        buildSvcForm(j.content);
      })
      .catch(function () { $("#svcForm").innerHTML = '<div class="empty">Could not load this page.</div>'; });
  }
  function gatherRows(type) {
    return $$("#sv-" + type + " .svrow").map(function (row) {
      var cells = Array.prototype.slice.call(row.querySelectorAll("[data-k]"))
        .sort(function (a, b) { return a.dataset.k - b.dataset.k; })
        .map(function (el) { return el.value.trim(); });
      return cells;
    }).filter(function (cells) { return cells.some(function (v) { return v; }); });
  }
  function gatherSvc() {
    var v = function (id) { return ($("#" + id).value || "").trim(); };
    return {
      h1a: v("sv-h1a"), h1b: v("sv-h1b"), sub: v("sv-sub"),
      introHead: v("sv-introHead"),
      intro: v("sv-intro").split(/\n\s*\n/).map(function (p) { return p.trim(); }).filter(Boolean),
      h2Included: v("sv-h2Included"), feats: gatherRows("feats"),
      h2Process: v("sv-h2Process"), steps: gatherRows("steps"),
      h2ForWho: v("sv-h2ForWho"),
      forWho: v("sv-forWho").split("\n").map(function (p) { return p.trim(); }).filter(Boolean),
      tail: v("sv-tail"),
      h2Faq: v("sv-h2Faq"), faqs: gatherRows("faqs"),
      title: v("sv-title"), desc: v("sv-desc")
    };
  }
  $("#svcForm").addEventListener("click", function (e) {
    var add = e.target.closest && e.target.closest("[data-add]");
    if (add) { add.previousElementSibling.insertAdjacentHTML("beforeend", rowHTML(add.dataset.add)); return; }
    var rm = e.target.closest && e.target.closest(".rm");
    if (rm) rm.closest(".svrow").remove();
  });
  $("#svcBack").addEventListener("click", function () { go("pages"); });
  $("#svcSave").addEventListener("click", function () {
    if (!svcSlug) return;
    sb.from("page_overrides").upsert({ page: "service:" + svcSlug, data: gatherSvc(), updated_at: new Date().toISOString() }, { onConflict: "page" })
      .then(function (r) {
        if (r.error) return toast(r.error.message, "err");
        toast("Saved — live now", "ok");
      });
  });
  $("#svcReset").addEventListener("click", function () {
    if (!svcSlug || !confirm("Reset this page to its original wording? Your edits will be removed.")) return;
    sb.from("page_overrides").delete().eq("page", "service:" + svcSlug).then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast("Reset to original", "ok");
      openServiceEditor(svcSlug);
    });
  });

  /* ── editor ───────────────────────────────────────────────────────────── */
  // Read time is derived from the article's length (~200 words/min, the usual
  // blog convention). It auto-updates as you type unless you type your own
  // number in the field; "Auto" re-links it to the live word count.
  var readTouched = false;
  function bodyText() {
    // strip HTML tags so pasted markup doesn't inflate the count
    return ($("#f-body").value || "").replace(/<[^>]*>/g, " ");
  }
  function wordCount() {
    var m = bodyText().trim().match(/\S+/g);
    return m ? m.length : 0;
  }
  function updateStats() {
    var words = wordCount();
    var mins = Math.max(1, Math.round(words / 200));
    $("#wordCount").textContent = words.toLocaleString() + (words === 1 ? " word" : " words");
    $("#readEst").textContent = "~" + mins + " min read";
    if (!readTouched) $("#f-read").value = mins;
  }

  function openEditor(p) {
    editingId = p ? p.id : null;
    readTouched = false;
    $("#editorTitle").textContent = p ? "Edit post" : "New post";
    $("#f-title").value = p ? p.title || "" : "";
    $("#f-slug").value = p ? p.slug || "" : "";
    $("#f-category").value = p ? p.category || "" : "";
    $("#f-author").value = p ? p.author || "" : "";
    $("#f-excerpt").value = p ? p.excerpt || "" : "";
    $("#f-cover").value = p ? p.cover_url || "" : "";
    $("#f-body").value = p ? p.body_md || "" : "";
    $("#f-metatitle").value = p ? p.meta_title || "" : "";
    $("#f-metadesc").value = p ? p.meta_description || "" : "";
    renderPreview();
    updateStats();
    show("editor");
  }
  function renderPreview() {
    var md = $("#f-body").value || "";
    var title = $("#f-title").value || "Untitled";
    $("#preview").innerHTML = "<h1>" + esc(title) + "</h1>" + window.marked.parse(md);
  }
  $("#f-body").addEventListener("input", function () { renderPreview(); updateStats(); });
  $("#f-read").addEventListener("input", function () { readTouched = true; });
  $("#readAuto").addEventListener("click", function () { readTouched = false; updateStats(); });
  $("#f-title").addEventListener("input", function () {
    if (!editingId && !$("#f-slug").value) $("#f-slug").value = slugify($("#f-title").value);
    renderPreview();
  });

  /* body formatting toolbar — inserts Markdown around the selection */
  function wrapSelection(before, after) {
    var ta = $("#f-body"), s = ta.selectionStart, e = ta.selectionEnd, val = ta.value;
    var sel = val.slice(s, e);
    ta.value = val.slice(0, s) + before + sel + after + val.slice(e);
    ta.focus();
    if (sel) ta.setSelectionRange(s + before.length, s + before.length + sel.length);
    else ta.setSelectionRange(s + before.length, s + before.length);
    renderPreview(); updateStats();
  }
  function prefixLines(prefix) {
    var ta = $("#f-body"), s = ta.selectionStart, e = ta.selectionEnd, val = ta.value;
    var ls = val.lastIndexOf("\n", s - 1) + 1;
    var block = val.slice(ls, e);
    var out = block.split("\n").map(function (l, i) {
      return (typeof prefix === "function" ? prefix(i) : prefix) + l;
    }).join("\n");
    ta.value = val.slice(0, ls) + out + val.slice(e);
    ta.focus(); ta.setSelectionRange(ls, ls + out.length);
    renderPreview(); updateStats();
  }
  function insertAtCursor(text, selectFrom, selectLen) {
    var ta = $("#f-body"), s = ta.selectionStart, val = ta.value;
    ta.value = val.slice(0, s) + text + val.slice(ta.selectionEnd);
    ta.focus();
    var pos = selectFrom != null ? s + selectFrom : s + text.length;
    ta.setSelectionRange(pos, pos + (selectLen || 0));
    renderPreview(); updateStats();
  }
  function insertImageMd(url, alt) {
    // block on its own lines so it renders as a figure, not inline
    insertAtCursor("\n\n![" + (alt || "") + "](" + url + ")\n\n");
  }
  function insertImageByUrl() {
    var url = window.prompt("Image URL (https://…)");
    if (!url) return;
    var alt = (window.prompt("Describe the image (alt text — good for SEO & accessibility)", "") || "").trim();
    insertImageMd(url.trim(), alt);
  }

  /* upload a device image to Supabase Storage; onUrl(publicUrl, file) handles
     the result (defaults to inserting a Markdown image into the body). */
  var IMG_BUCKET = "blog-images";
  function uploadImage(file, onUrl) {
    if (!file) return;
    if (!/^image\//.test(file.type)) return toast("That file isn't an image", "err");
    if (file.size > 8 * 1024 * 1024) return toast("Image is over 8 MB — please compress it first", "err");
    var ext = ((file.name.split(".").pop() || "png").toLowerCase().replace(/[^a-z0-9]/g, "")) || "png";
    var path = Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8) + "." + ext;
    var bar = $("#mdbar"); if (bar) bar.classList.add("busy");
    toast("Uploading image…", "ok");
    sb.storage.from(IMG_BUCKET).upload(path, file, { cacheControl: "31536000", contentType: file.type, upsert: false })
      .then(function (r) {
        if (bar) bar.classList.remove("busy");
        if (r.error) {
          var m = r.error.message || "upload failed";
          if (/bucket/i.test(m) && /not found|exist/i.test(m)) {
            return toast("Image storage isn't set up yet — run supabase/storage.sql once, then try again.", "err");
          }
          return toast("Upload failed: " + m, "err");
        }
        var pub = sb.storage.from(IMG_BUCKET).getPublicUrl(path);
        var url = pub && pub.data ? pub.data.publicUrl : "";
        if (!url) return toast("Uploaded, but couldn't read the image URL", "err");
        if (onUrl) onUrl(url, file);
        else {
          insertImageMd(url, file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
          toast("Image added", "ok");
        }
      }, function (e) {
        if (bar) bar.classList.remove("busy");
        toast("Upload failed: " + (e && e.message ? e.message : e), "err");
      });
  }
  /* cover image: same uploader, but the URL fills the Cover field */
  function setCover(url) { $("#f-cover").value = url; toast("Cover image set", "ok"); }
  $("#coverUpload").addEventListener("click", function () { $("#coverFile").click(); });
  $("#coverFile").addEventListener("change", function () {
    if (this.files && this.files[0]) uploadImage(this.files[0], setCover);
    this.value = "";
  });
  (function () {
    var row = $("#coverDrop"); if (!row) return;
    row.addEventListener("dragover", function (ev) {
      if (!(ev.dataTransfer && ev.dataTransfer.types && Array.prototype.indexOf.call(ev.dataTransfer.types, "Files") > -1)) return;
      ev.preventDefault(); row.classList.add("dragging");
    });
    row.addEventListener("dragleave", function (ev) {
      if (!row.contains(ev.relatedTarget)) row.classList.remove("dragging");
    });
    row.addEventListener("drop", function (ev) {
      row.classList.remove("dragging");
      var files = ev.dataTransfer && ev.dataTransfer.files;
      if (!files || !files.length) return;
      ev.preventDefault();
      for (var i = 0; i < files.length; i++) if (/^image\//.test(files[i].type)) { uploadImage(files[i], setCover); break; }
    });
  })();

  function applyMd(k) {
    if (k === "bold") wrapSelection("**", "**");
    else if (k === "italic") wrapSelection("*", "*");
    else if (k === "link") wrapSelection("[", "](https://)");
    else if (k === "image") $("#imgFile").click();
    else if (k === "imageurl") insertImageByUrl();
    else if (k === "h2") prefixLines("## ");
    else if (k === "h3") prefixLines("### ");
    else if (k === "h4") prefixLines("#### ");
    else if (k === "h5") prefixLines("##### ");
    else if (k === "h6") prefixLines("###### ");
    else if (k === "ul") prefixLines("- ");
    else if (k === "ol") prefixLines(function (i) { return (i + 1) + ". "; });
    else if (k === "quote") prefixLines("> ");
  }
  $("#mdbar").addEventListener("click", function (ev) {
    var b = ev.target.closest(".mdbtn"); if (!b) return;
    applyMd(b.getAttribute("data-md"));
  });
  $("#imgFile").addEventListener("change", function () {
    if (this.files && this.files[0]) uploadImage(this.files[0]);
    this.value = ""; // allow re-selecting the same file
  });

  /* drag & drop onto the editor box */
  (function () {
    var box = document.querySelector(".editorbox");
    if (!box) return;
    function hasImage(dt) {
      if (!dt) return false;
      if (dt.items) { for (var i = 0; i < dt.items.length; i++) if (dt.items[i].kind === "file") return true; }
      return dt.types && Array.prototype.indexOf.call(dt.types, "Files") > -1;
    }
    box.addEventListener("dragover", function (ev) {
      if (!hasImage(ev.dataTransfer)) return;
      ev.preventDefault(); box.classList.add("dragging");
    });
    box.addEventListener("dragleave", function (ev) {
      if (ev.target === box || !box.contains(ev.relatedTarget)) box.classList.remove("dragging");
    });
    box.addEventListener("drop", function (ev) {
      box.classList.remove("dragging");
      var files = ev.dataTransfer && ev.dataTransfer.files;
      if (!files || !files.length) return;
      ev.preventDefault();
      for (var i = 0; i < files.length; i++) if (/^image\//.test(files[i].type)) uploadImage(files[i]);
    });
  })();

  /* paste an image straight from the clipboard */
  $("#f-body").addEventListener("paste", function (ev) {
    var items = ev.clipboardData && ev.clipboardData.items; if (!items) return;
    for (var i = 0; i < items.length; i++) {
      if (items[i].kind === "file" && /^image\//.test(items[i].type)) {
        var f = items[i].getAsFile();
        if (f) { ev.preventDefault(); uploadImage(f); }
      }
    }
  });
  $("#f-body").addEventListener("keydown", function (ev) {
    if (!(ev.ctrlKey || ev.metaKey)) return;
    var k = ev.key.toLowerCase();
    if (k === "b") { ev.preventDefault(); applyMd("bold"); }
    else if (k === "i") { ev.preventDefault(); applyMd("italic"); }
    else if (k === "k") { ev.preventDefault(); applyMd("link"); }
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
      author: $("#f-author").value.trim(),
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
      if (!rows.length) { el.innerHTML = '<div class="empty">' + ICN_INBOX + "<div>No leads yet. Submissions from your site's forms will appear here.</div></div>"; return; }
      el.innerHTML = "<table><thead><tr><th>Who</th><th>Message</th><th>Page</th><th>When</th><th></th></tr></thead><tbody>" +
        rows.map(function (l) {
          var contact = (l.email ? "<a href='mailto:" + esc(l.email) + "' style='font-size:12.5px'>" + esc(l.email) + "</a>" : "") +
            (l.website ? "<br><span class='muted' style='font-size:12px'>" + esc(l.website) + "</span>" : "") +
            (l.phone ? "<br><span class='muted' style='font-size:12px'>" + esc(l.phone) + "</span>" : "");
          var det = [l.service, l.budget].filter(Boolean).map(esc).join(" · ");
          return "<tr><td style='min-width:200px'><div style='display:flex;gap:11px;align-items:flex-start'>" + avatar(l.name, l.email, 36) +
              "<div><b>" + esc(l.name || "—") + "</b><br>" + contact + "</div></div></td>" +
            "<td>" + (det ? "<div class='muted' style='font-size:12px;margin-bottom:4px'>" + det + "</div>" : "") + esc(l.message || "") + "</td>" +
            "<td class='muted' style='font-size:12.5px'>" + esc(l.page || "") + "</td>" +
            "<td class='muted' style='white-space:nowrap;font-size:12.5px'>" + fmtDT(l.created_at) + "<br><span class='pill " + esc(l.status) + "'>" + esc(l.status) + "</span></td>" +
            "<td><div class='row' style='flex-wrap:nowrap;gap:6px;justify-content:flex-end'>" +
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

  /* ── tracking & analytics ─────────────────────────────────────────────── */
  var LOC_LABEL = { head: "<head>", body_start: "<body> start", body_end: "</body> end" };
  function loadTracking() {
    sb.from("settings").select("ga4_id,gtm_id").eq("id", 1).single().then(function (r) {
      var s = r.data || {};
      $("#t-ga4").value = s.ga4_id || "";
      $("#t-gtm").value = s.gtm_id || "";
      $("#trackStatus").innerHTML = (s.ga4_id || s.gtm_id)
        ? '<div class="banner ok"><div>Tracking is active on your live site. Changes apply within a minute.</div></div>'
        : '<div class="banner"><div>No analytics yet. Add your Google Analytics 4 ID below, or create a code snippet.</div></div>';
    });
    loadSnippets();
  }
  $("#saveTracking").addEventListener("click", function () {
    sb.from("settings").update({
      ga4_id: $("#t-ga4").value.trim(),
      gtm_id: $("#t-gtm").value.trim()
    }).eq("id", 1).then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast("Saved — live within a minute", "ok"); loadTracking();
    });
  });

  /* ── custom code snippets ─────────────────────────────────────────────── */
  var editingSnippet = null;
  function loadSnippets() {
    var el = $("#snippetList");
    el.innerHTML = '<div class="empty" style="padding:22px">Loading…</div>';
    sb.from("code_snippets").select("*").order("created_at", { ascending: false }).then(function (r) {
      if (r.error) { el.innerHTML = '<div class="empty" style="padding:22px">' + esc(r.error.message) + "</div>"; return; }
      var rows = r.data || [];
      if (!rows.length) { el.innerHTML = '<div class="empty" style="padding:26px 22px">No snippets yet. Click <b>New snippet</b> to add a tracking code, meta tag or script.</div>'; return; }
      el.innerHTML = rows.map(function (s) {
        return '<div class="snip-row">' +
          '<span class="pill ' + (s.active ? "live" : "draft") + '">' + (s.active ? "Active" : "Draft") + "</span>" +
          '<div style="flex:1;min-width:0"><b>' + esc(s.title || "Untitled snippet") + "</b></div>" +
          '<span class="loc">' + esc(LOC_LABEL[s.location] || s.location) + "</span>" +
          '<span class="muted" style="font-size:12px">Priority ' + (s.priority == null ? 10 : s.priority) + "</span>" +
          "<button class='btn ghost sm' data-editsnip='" + s.id + "'>Edit</button>" +
          "<button class='btn ghost sm' data-togglesnip='" + s.id + "' data-active='" + (s.active ? 1 : 0) + "'>" + (s.active ? "Turn off" : "Turn on") + "</button>" +
          "<button class='btn danger sm' data-delsnip='" + s.id + "'>Delete</button>" +
          "</div>";
      }).join("");
    });
  }
  function openSnippet(s) {
    editingSnippet = s ? s.id : null;
    $("#snipTitle").textContent = s ? "Edit snippet" : "New snippet";
    $("#sn-title").value = s ? s.title || "" : "";
    $("#sn-loc").value = s ? s.location || "head" : "head";
    $("#sn-prio").value = s ? String(s.priority == null ? 10 : s.priority) : "10";
    $("#sn-active").checked = s ? !!s.active : false;
    $("#sn-code").value = s ? s.code || "" : "";
    $("#snipDelete").style.display = s ? "" : "none";
    show("snippet");
  }
  $("#newSnippet").addEventListener("click", function () { openSnippet(null); });
  $("#snipBack").addEventListener("click", function () { go("tracking"); });
  $("#snippetList").addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    if (b.dataset.editsnip) {
      sb.from("code_snippets").select("*").eq("id", b.dataset.editsnip).single().then(function (r) { if (r.data) openSnippet(r.data); });
    } else if (b.dataset.togglesnip) {
      sb.from("code_snippets").update({ active: b.dataset.active !== "1" }).eq("id", b.dataset.togglesnip).then(function (r) {
        if (r.error) return toast(r.error.message, "err");
        toast("Updated — live within a minute", "ok"); loadSnippets();
      });
    } else if (b.dataset.delsnip) {
      if (!confirm("Delete this snippet? This cannot be undone.")) return;
      sb.from("code_snippets").delete().eq("id", b.dataset.delsnip).then(function (r) {
        if (r.error) return toast(r.error.message, "err");
        toast("Snippet deleted", "ok"); loadSnippets();
      });
    }
  });
  $("#snipSave").addEventListener("click", function () {
    var rec = {
      title: $("#sn-title").value.trim(),
      location: $("#sn-loc").value,
      priority: parseInt($("#sn-prio").value, 10) || 10,
      active: $("#sn-active").checked,
      code: $("#sn-code").value
    };
    var q = editingSnippet ? sb.from("code_snippets").update(rec).eq("id", editingSnippet) : sb.from("code_snippets").insert(rec);
    q.then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast(rec.active ? "Saved — live within a minute" : "Saved as draft", "ok");
      go("tracking");
    });
  });
  $("#snipDelete").addEventListener("click", function () {
    if (!editingSnippet) return;
    if (!confirm("Delete this snippet? This cannot be undone.")) return;
    sb.from("code_snippets").delete().eq("id", editingSnippet).then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast("Snippet deleted", "ok"); go("tracking");
    });
  });

  /* ── redirects ────────────────────────────────────────────────────────── */
  var editingRedirect = null;
  function loadRedirects() {
    var el = $("#redirectList");
    el.innerHTML = '<div class="empty" style="padding:22px">Loading…</div>';
    sb.from("redirects").select("*").order("created_at", { ascending: false }).then(function (r) {
      if (r.error) { el.innerHTML = '<div class="empty" style="padding:22px">' + esc(r.error.message) + "</div>"; return; }
      var rows = r.data || [];
      if (!rows.length) { el.innerHTML = '<div class="empty" style="padding:26px 22px">No redirects yet. Click <b>New redirect</b> to point an old URL to a new one.</div>'; return; }
      el.innerHTML = "<table><thead><tr><th>From</th><th>To</th><th>Type</th><th>Status</th><th></th></tr></thead><tbody>" +
        rows.map(function (r2) {
          return "<tr><td><code style='font-size:12.5px'>" + esc(r2.source) + "</code></td>" +
            "<td style='color:var(--ink-2);font-size:13px;word-break:break-all'>" + esc(r2.target) + "</td>" +
            "<td>" + (r2.code || 301) + "</td>" +
            "<td><span class='pill " + (r2.active ? "live" : "draft") + "'>" + (r2.active ? "Active" : "Off") + "</span></td>" +
            "<td style='text-align:right;white-space:nowrap'><button class='btn ghost sm' data-editrd='" + r2.id + "'>Edit</button> " +
            "<button class='btn danger sm' data-delrd='" + r2.id + "'>Delete</button></td></tr>";
        }).join("") + "</tbody></table>";
    });
  }
  function openRedirect(r) {
    editingRedirect = r ? r.id : null;
    $("#rdTitle").textContent = r ? "Edit redirect" : "New redirect";
    $("#rd-source").value = r ? r.source || "" : "";
    $("#rd-target").value = r ? r.target || "" : "";
    $("#rd-code").value = r ? String(r.code || 301) : "301";
    $("#rd-active").checked = r ? !!r.active : true;
    $("#rdDelete").style.display = r ? "" : "none";
    show("redirect");
  }
  $("#newRedirect").addEventListener("click", function () { openRedirect(null); });
  $("#rdBack").addEventListener("click", function () { go("redirects"); });
  $("#redirectList").addEventListener("click", function (ev) {
    var b = ev.target.closest("button"); if (!b) return;
    if (b.dataset.editrd) {
      sb.from("redirects").select("*").eq("id", b.dataset.editrd).single().then(function (r) { if (r.data) openRedirect(r.data); });
    } else if (b.dataset.delrd) {
      if (!confirm("Delete this redirect?")) return;
      sb.from("redirects").delete().eq("id", b.dataset.delrd).then(function (r) {
        if (r.error) return toast(r.error.message, "err");
        toast("Redirect deleted", "ok"); loadRedirects();
      });
    }
  });
  $("#rdSave").addEventListener("click", function () {
    var source = $("#rd-source").value.trim();
    var target = $("#rd-target").value.trim();
    if (!source) return toast("Enter a source path", "err");
    if (source.charAt(0) !== "/") source = "/" + source;
    if (!target) return toast("Enter a target", "err");
    var rec = { source: source, target: target, code: parseInt($("#rd-code").value, 10) || 301, active: $("#rd-active").checked };
    var q = editingRedirect ? sb.from("redirects").update(rec).eq("id", editingRedirect) : sb.from("redirects").insert(rec);
    q.then(function (r) {
      if (r.error) return toast(/duplicate|unique/i.test(r.error.message) ? "A redirect for that source already exists." : r.error.message, "err");
      toast("Redirect saved — live within a minute", "ok"); go("redirects");
    });
  });
  $("#rdDelete").addEventListener("click", function () {
    if (!editingRedirect) return;
    if (!confirm("Delete this redirect?")) return;
    sb.from("redirects").delete().eq("id", editingRedirect).then(function (r) {
      if (r.error) return toast(r.error.message, "err");
      toast("Redirect deleted", "ok"); go("redirects");
    });
  });

  /* ── settings ─────────────────────────────────────────────────────────── */
  function loadSettings() {
    sb.from("settings").select("*").eq("id", 1).single().then(function (r) {
      var s = r.data || {};
      $("#s-to").value = s.lead_to_email || "";
      $("#s-from").value = s.lead_from_email || "";
      $("#s-webhook").value = s.lead_webhook_url || "";
      var configured = s.lead_to_email || s.lead_webhook_url;
      $("#emailStatus").innerHTML = configured
        ? '<div class="banner ok"><div>Delivery is configured. Leads are also saved to this dashboard automatically.</div></div>'
        : '<div class="banner"><div><b>Email delivery isn\'t set up yet.</b> Leads are being saved here, but to also get them emailed, add a <code>RESEND_API_KEY</code> in Vercel and set the address below. Until then, check this dashboard for new leads.</div></div>';
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
