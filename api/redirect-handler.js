/* Catch-all fallback (via the last rewrite in vercel.json).
 *
 * Any request that doesn't match a static file or an earlier route lands here.
 * We look the path up in the `redirects` table and 301/302 to its target if a
 * matching active rule exists; otherwise we render a branded 404. This is what
 * makes dashboard-managed redirects work without a redeploy. */

const C = require("../tools/lib/chrome.js");
const db = require("./_supabase.js");

function esc(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

module.exports = async function handler(req, res) {
  // The original path is passed through as ?p=/old/path by the rewrite.
  let path = "/";
  if (req.query && req.query.p) path = "/" + String(req.query.p).replace(/^\/+/, "");
  else path = (req.url || "/").split("?")[0];
  // normalise: strip a trailing slash (except root)
  let lookup = path.replace(/\/+$/, "");
  if (!lookup) lookup = "/";

  if (db.configured()) {
    try {
      const rows = await db.select(
        "redirects",
        `active=eq.true&source=ilike.${encodeURIComponent(lookup)}&select=id,target,code,hits&limit=1`
      );
      const r = rows[0];
      if (r && r.target) {
        try {
          await db.update("redirects", `id=eq.${r.id}`, { hits: (r.hits || 0) + 1, last_hit: new Date().toISOString() });
        } catch (e) { console.error("[redirect] hit bump failed:", e.message); }
        res.statusCode = r.code === 302 ? 302 : 301;
        res.setHeader("Location", r.target);
        res.setHeader("Cache-Control", "no-store");
        return res.end();
      }
    } catch (e) {
      console.error("[redirect] lookup failed:", e.message);
    }
  }

  // No redirect — render a proper 404 in the site's chrome.
  const body = `
<div class="page-hero"><div class="mesh2" aria-hidden="true"></div><div class="wrap">
  <span class="eyebrow">404</span>
  <h1>We couldn't find that page</h1>
  <p class="sub" style="max-width:52ch">The page <code>${esc(lookup)}</code> doesn't exist or has moved. Try the homepage or one of our services.</p>
  <p style="margin-top:8px"><a class="btn btn-primary" href="/">Back to home →</a> <a class="btn btn-ghost" href="/blog" style="margin-left:8px">Read the blog</a></p>
</div></div>`;
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  return res.status(404).send(C.page({
    url: lookup, title: "Page not found — SEO Atlanta GA",
    desc: "The page you were looking for doesn't exist or has moved.",
    active: "", body: body
  }));
};
