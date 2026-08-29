/* Progressive enhancement for the /blog index: pulls PUBLISHED posts authored
 * in the admin dashboard from Supabase and prepends them as cards, newest
 * first. If Supabase is unreachable or empty, the page is unchanged — the
 * hand-built launch posts always render on their own. */
(function () {
  "use strict";
  var URL = window.SUPABASE_URL, KEY = window.SUPABASE_ANON_KEY;
  var grid = document.querySelector(".blog-grid");
  if (!URL || !KEY || !grid) return;

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function fmt(iso) {
    if (!iso) return "";
    var d = new Date(iso);
    return isNaN(d) ? "" : d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  }
  function card(p) {
    var date = p.published_at || p.created_at;
    var media = p.cover_url
      ? '<div class="photo-frame post-photo"><img src="' + esc(p.cover_url) + '" alt="' + esc(p.title) +
        '" width="1400" height="560" loading="lazy" decoding="async"></div>'
      : '<div class="photo-frame post-photo" style="aspect-ratio:5/2;display:grid;place-items:center;' +
        'background:linear-gradient(135deg,#0E2A5C,#1B72F0)"><span style="font-family:Sora,sans-serif;' +
        'font-weight:700;color:#fff;font-size:26px;opacity:.85">' + esc((p.category || "SEO").slice(0, 14)) + "</span></div>";
    var a = document.createElement("a");
    a.className = "post-card";
    a.setAttribute("data-cat", "all");
    a.href = "/blog/" + encodeURIComponent(p.slug);
    a.innerHTML = media +
      '<div class="post-body"><div class="post-meta"><span class="cat">' + esc(p.category || "SEO") + "</span>" +
      '<time datetime="' + esc((date || "").slice(0, 10)) + '">' + fmt(date) + "</time>" +
      (p.read_minutes ? "<span>" + esc(p.read_minutes) + " min read</span>" : "") + "</div>" +
      "<h3>" + esc(p.title) + "</h3><p>" + esc(p.excerpt || "") + '</p><span class="more">Read the guide →</span></div>';
    return a;
  }

  var q = "/rest/v1/posts?status=eq.published&select=slug,title,excerpt,category,cover_url,read_minutes,published_at,created_at&order=published_at.desc.nullslast&limit=50";
  fetch(URL + q, { headers: { apikey: KEY, Authorization: "Bearer " + KEY } })
    .then(function (r) { return r.ok ? r.json() : []; })
    .then(function (posts) {
      if (!Array.isArray(posts) || !posts.length) return;
      var frag = document.createDocumentFragment();
      posts.forEach(function (p) { frag.appendChild(card(p)); });
      grid.insertBefore(frag, grid.firstChild);
    })
    .catch(function () {});
})();
