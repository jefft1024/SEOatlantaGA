/* GET /services/:slug  (via the rewrite in vercel.json → /api/service-page)
 *
 * Renders a service page from tools/lib/services-content.js. Starts from the
 * built-in default content (identical to the static build) and merges any
 * dashboard edits stored in Supabase (page_overrides table, page="service:<slug>").
 * If Supabase is unreachable or has no override, the page renders exactly as the
 * static build did — so this can never come up blank. */

const C = require("../tools/lib/chrome.js");
const { defaultContent, renderServiceHTML, SLUGS } = require("../tools/lib/services-content.js");
const db = require("./_supabase.js");

module.exports = async function handler(req, res) {
  const slug = (req.query && req.query.slug ? String(req.query.slug) : (req.url || "").split("?")[0].split("/").pop()).trim();

  if (SLUGS.indexOf(slug) === -1) {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(
      C.page({
        url: "/", title: "Page not found — SEO Atlanta GA",
        desc: "This page could not be found.", active: "",
        body: `<div class="page-hero"><div class="wrap"><span class="eyebrow">404</span><h1>We couldn't find that page</h1><p class="sub"><a href="/">Back home →</a></p></div></div>`
      })
    );
  }

  let content = defaultContent(slug);

  if (db.configured()) {
    try {
      const rows = await db.select("page_overrides", `page=eq.${encodeURIComponent("service:" + slug)}&select=data&limit=1`);
      if (rows[0] && rows[0].data && typeof rows[0].data === "object") {
        content = Object.assign({}, content, rows[0].data);
        content.slug = slug; // never let an override change identity/routing
      }
    } catch (e) {
      console.error("[service-page] override read failed:", e.message);
    }
  }

  const html = renderServiceHTML(content, C);
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=600");
  return res.status(200).send(html);
};
