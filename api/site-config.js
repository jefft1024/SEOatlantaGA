/* GET /api/site-config — public site configuration for analytics/tracking.
 *
 * Returns ONLY the fields that are safe to expose in the browser (analytics
 * IDs and the owner-authored custom head/body snippets). Lead-delivery
 * settings (emails, webhook) are never included. Read server-side with the
 * service role so no broad public RLS policy on `settings` is needed. */

const db = require("./_supabase.js");

module.exports = async function handler(req, res) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=600");

  const cfg = { ga4_id: "", gtm_id: "", head_html: "", body_html: "", snippets: [] };
  if (db.configured()) {
    try {
      const rows = await db.select("settings", "id=eq.1&select=ga4_id,gtm_id,head_html,body_html&limit=1");
      const s = rows[0] || {};
      cfg.ga4_id = s.ga4_id || "";
      cfg.gtm_id = s.gtm_id || "";
      cfg.head_html = s.head_html || "";
      cfg.body_html = s.body_html || "";
    } catch (e) {
      console.error("[site-config] settings read failed:", e.message);
    }
    try {
      const snips = await db.select(
        "code_snippets",
        "active=eq.true&select=location,priority,code&order=priority.asc,created_at.asc"
      );
      cfg.snippets = (snips || []).map((x) => ({ location: x.location, code: x.code || "" }));
    } catch (e) {
      console.error("[site-config] snippets read failed:", e.message);
    }
  }
  return res.status(200).json(cfg);
};
