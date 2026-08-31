/* GET /contact | /privacy | /terms  (via rewrites → /api/page?p=<name>)
 * Serves a tagged static template with dashboard edits injected. With no edits
 * the page is byte-identical to the original; falls back to the raw template if
 * Supabase is unreachable. */

const inject = require("./_page-inject.js");
const db = require("./_supabase.js");

const PAGES = {
  contact: "templates/contact.html",
  privacy: "templates/privacy.html",
  terms: "templates/terms.html"
};

module.exports = async function handler(req, res) {
  const p = req.query && req.query.p ? String(req.query.p) : "";
  const rel = PAGES[p];
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  if (!rel) return res.status(404).send("<!doctype html><title>Not found</title><p>Not found. <a href=\"/\">Home</a></p>");

  let html;
  try { html = inject.readTemplate(rel); }
  catch (e) { console.error("[page] read failed:", e.message); return res.status(500).send("<!doctype html><title>SEO Atlanta GA</title><p>Temporarily unavailable.</p>"); }

  if (db.configured()) {
    try {
      const rows = await db.select("page_overrides", `page=eq.${encodeURIComponent(p)}&select=data&limit=1`);
      if (rows[0] && rows[0].data && typeof rows[0].data === "object") html = inject.injectOverrides(html, rows[0].data);
    } catch (e) { console.error("[page] override read failed:", e.message); }
  }

  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=600");
  return res.status(200).send(html);
};
