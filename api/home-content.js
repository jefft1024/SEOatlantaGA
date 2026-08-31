/* GET /api/home-content
 * Returns the homepage's editable blocks as JSON — the template defaults with
 * any saved dashboard overrides applied. The admin editor renders one field per
 * block. Public data (same text shown on the page). */

const inject = require("./_page-inject.js");
const db = require("./_supabase.js");

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  let html;
  try { html = inject.readTemplate("templates/home.html"); }
  catch (e) { return res.status(500).json({ error: "template not found" }); }

  let overrides = {};
  if (db.configured()) {
    try {
      const rows = await db.select("page_overrides", `page=eq.home&select=data&limit=1`);
      if (rows[0] && rows[0].data && typeof rows[0].data === "object") overrides = rows[0].data;
    } catch (e) { console.error("[home-content] read failed:", e.message); }
  }

  const fields = inject.extractFields(html).map(function (f) {
    return { key: f.key, label: f.label, html: (overrides[f.key] != null ? overrides[f.key] : f.html) };
  });
  return res.status(200).json({ page: "home", fields: fields });
};
