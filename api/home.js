/* GET /  (via the rewrite in vercel.json → /api/home)
 * Serves the homepage from templates/home.html with any dashboard edits merged
 * in. With no edits it returns the template unchanged, so the homepage renders
 * exactly as before. Falls back to the raw template if Supabase is unreachable. */

const inject = require("./_page-inject.js");
const db = require("./_supabase.js");

module.exports = async function handler(req, res) {
  let html;
  try {
    html = inject.readTemplate("templates/home.html");
  } catch (e) {
    console.error("[home] template read failed:", e.message);
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(500).send("<!doctype html><title>SEO Atlanta GA</title><p>Temporarily unavailable.</p>");
  }

  if (db.configured()) {
    try {
      const rows = await db.select("page_overrides", `page=eq.home&select=data&limit=1`);
      if (rows[0] && rows[0].data && typeof rows[0].data === "object") {
        html = inject.injectOverrides(html, rows[0].data);
      }
    } catch (e) {
      console.error("[home] override read failed:", e.message);
    }
  }

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=600");
  return res.status(200).send(html);
};
