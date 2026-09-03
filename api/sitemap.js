/* GET /sitemap.xml  (via the rewrite in vercel.json → /api/sitemap)
 *
 * A dynamic sitemap: the fixed marketing/legal/service URLs plus the three
 * launch blog posts, followed by every PUBLISHED post authored in the admin
 * dashboard — each with an <image:image> entry for its cover image so Google
 * can discover the images too. If Supabase is unreachable the static portion
 * still renders, so the sitemap is never broken. */

const db = require("./_supabase.js");

const ORIGIN = "https://seoatlantaga.com";

function esc(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
function abs(u) {
  if (!u) return "";
  return /^https?:\/\//i.test(u) ? u : ORIGIN + (u.charAt(0) === "/" ? "" : "/") + u;
}
function day(iso) {
  const d = iso ? new Date(iso) : null;
  return d && !isNaN(d) ? d.toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10);
}
function urlTag(loc, lastmod, changefreq, priority, image) {
  let s = "  <url><loc>" + esc(loc) + "</loc>";
  if (lastmod) s += "<lastmod>" + lastmod + "</lastmod>";
  if (changefreq) s += "<changefreq>" + changefreq + "</changefreq>";
  if (priority) s += "<priority>" + priority + "</priority>";
  if (image) s += "<image:image><image:loc>" + esc(abs(image)) + "</image:loc></image:image>";
  return s + "</url>";
}

// The fixed pages and the three hand-built launch posts (with their cover art).
const STATIC = [
  urlTag(ORIGIN + "/", "2026-08-28", "weekly", "1.0"),
  urlTag(ORIGIN + "/services/local-seo", "2026-08-28", "monthly", "0.9"),
  urlTag(ORIGIN + "/services/ai-content", "2026-08-28", "monthly", "0.9"),
  urlTag(ORIGIN + "/services/technical-seo", "2026-08-28", "monthly", "0.9"),
  urlTag(ORIGIN + "/services/answer-engine-optimization", "2026-08-28", "monthly", "0.9"),
  urlTag(ORIGIN + "/services/link-building", "2026-08-28", "monthly", "0.9"),
  urlTag(ORIGIN + "/services/seo-reporting", "2026-08-28", "monthly", "0.9"),
  urlTag(ORIGIN + "/blog", "2026-08-28", "weekly", "0.8"),
  urlTag(ORIGIN + "/blog/seo-roi-what-ranking-first-is-worth", "2026-02-11", "yearly", "0.7", "/assets/img/post-seo-roi.svg"),
  urlTag(ORIGIN + "/blog/local-seo-atlanta-map-pack", "2026-03-04", "yearly", "0.7", "/assets/img/post-map-pack.svg"),
  urlTag(ORIGIN + "/blog/ai-overviews-answer-engine-optimization", "2026-04-22", "yearly", "0.7", "/assets/img/post-ai-overviews.svg"),
  urlTag(ORIGIN + "/contact", "2026-08-28", "monthly", "0.8"),
  urlTag(ORIGIN + "/privacy", "2026-08-28", "yearly", "0.2"),
  urlTag(ORIGIN + "/terms", "2026-08-28", "yearly", "0.2")
];

// Slugs already covered by the static launch posts, so a dashboard post that
// reuses one isn't listed twice.
const STATIC_SLUGS = {
  "seo-roi-what-ranking-first-is-worth": 1,
  "local-seo-atlanta-map-pack": 1,
  "ai-overviews-answer-engine-optimization": 1
};

module.exports = async function handler(req, res) {
  const parts = STATIC.slice();

  if (db.configured()) {
    try {
      const rows = await db.select(
        "posts",
        "status=eq.published&select=slug,cover_url,published_at,updated_at,created_at&order=published_at.desc.nullslast"
      );
      (rows || []).forEach((p) => {
        if (!p.slug || STATIC_SLUGS[p.slug]) return;
        parts.push(urlTag(
          ORIGIN + "/blog/" + encodeURIComponent(p.slug),
          day(p.updated_at || p.published_at || p.created_at),
          "yearly", "0.7",
          p.cover_url || ""
        ));
      });
    } catch (e) {
      console.error("[sitemap] posts read failed:", e.message);
    }
  }

  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" ' +
    'xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
    parts.join("\n") + "\n</urlset>\n";

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).send(xml);
};
