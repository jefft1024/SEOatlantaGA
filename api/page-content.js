/* GET /api/page-content?p=contact|privacy|terms
 * Returns the page's editable blocks as JSON (defaults + saved overrides) for
 * the dashboard editor. Public data (same text shown on the page). */

const inject = require("./_page-inject.js");
const db = require("./_supabase.js");

const PAGES = {
  contact: "templates/contact.html",
  privacy: "templates/privacy.html",
  terms: "templates/terms.html"
};

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  const p = req.query && req.query.p ? String(req.query.p) : "";
  const rel = PAGES[p];
  if (!rel) return res.status(404).json({ error: "unknown page" });

  let html;
  try { html = inject.readTemplate(rel); }
  catch (e) { return res.status(500).json({ error: "template not found" }); }

  let overrides = {};
  if (db.configured()) {
    try {
      const rows = await db.select("page_overrides", `page=eq.${encodeURIComponent(p)}&select=data&limit=1`);
      if (rows[0] && rows[0].data && typeof rows[0].data === "object") overrides = rows[0].data;
    } catch (e) { console.error("[page-content] read failed:", e.message); }
  }

  const fields = inject.extractFields(html).map(function (f) {
    return { key: f.key, label: f.label, html: (overrides[f.key] != null ? overrides[f.key] : f.html) };
  });
  return res.status(200).json({ page: p, fields: fields });
};
