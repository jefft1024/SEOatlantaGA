/* GET /api/service-content?slug=<slug>
 * Returns the current editable content for a service page as JSON — the
 * built-in defaults merged with any saved dashboard override. The admin editor
 * loads this to populate its form. Public data (same text the page shows). */

const { defaultContent, SLUGS } = require("../tools/lib/services-content.js");
const db = require("./_supabase.js");

module.exports = async function handler(req, res) {
  const slug = req.query && req.query.slug ? String(req.query.slug).trim() : "";
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  if (SLUGS.indexOf(slug) === -1) return res.status(404).json({ error: "unknown slug" });

  let content = defaultContent(slug);
  let overridden = false;
  if (db.configured()) {
    try {
      const rows = await db.select("page_overrides", `page=eq.${encodeURIComponent("service:" + slug)}&select=data&limit=1`);
      if (rows[0] && rows[0].data && typeof rows[0].data === "object") {
        content = Object.assign({}, content, rows[0].data);
        content.slug = slug;
        overridden = true;
      }
    } catch (e) {
      console.error("[service-content] read failed:", e.message);
    }
  }
  return res.status(200).json({ slug: slug, overridden: overridden, content: content });
};
