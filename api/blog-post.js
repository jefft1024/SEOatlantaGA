/* GET /blog/:slug  (via the rewrite in vercel.json → /api/blog-post?slug=…)
 *
 * Renders a PUBLISHED post from Supabase using the site's shared chrome, so a
 * dashboard-authored post looks identical to the hand-built static posts.
 * Static files in /blog/*.html take precedence (Vercel checks the filesystem
 * first), so this only ever handles new, dashboard-created slugs. */

const C = require("../tools/lib/chrome.js");
const db = require("./_supabase.js");

function esc(s) {
  return String(s || "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
}

function slugify(s) {
  return String(s).toLowerCase().replace(/<[^>]*>/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);
}

function fmtDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

/* Ensure every <h2> has an id and collect them into a table of contents. */
function withToc(html) {
  const toc = [];
  const out = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (m, attrs, inner) => {
    let id = (attrs.match(/id=["']([^"']+)["']/) || [])[1];
    if (!id) id = slugify(inner) || `s-${toc.length + 1}`;
    toc.push([id, inner.replace(/<[^>]*>/g, "").trim()]);
    const cleaned = attrs.replace(/\s*id=["'][^"']*["']/, "");
    return `<h2 id="${id}"${cleaned}>${inner}</h2>`;
  });
  return { html: out, toc };
}

module.exports = async function handler(req, res) {
  const slug = (req.query && req.query.slug ? String(req.query.slug) : (req.url || "").split("?")[0].split("/").pop()).trim();

  const send404 = () => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    return res.status(404).send(
      C.page({
        url: "/blog", title: "Post not found — SEO Atlanta GA",
        desc: "This post could not be found.", active: "/blog",
        body: `<div class="page-hero"><div class="wrap"><span class="eyebrow">404</span><h1>We couldn't find that post</h1><p class="sub">It may have moved or been unpublished. <a href="/blog">Back to the blog →</a></p></div></div>`
      })
    );
  };

  if (!slug) return send404();
  if (!db.configured()) return send404();

  let post;
  try {
    const rows = await db.select(
      "posts",
      `slug=eq.${encodeURIComponent(slug)}&status=eq.published&select=*&limit=1`
    );
    post = rows[0];
  } catch (e) {
    console.error("[blog-post] read failed:", e.message);
  }
  if (!post) return send404();

  const url = `/blog/${post.slug}`;
  const title = post.meta_title || `${post.title} — SEO Atlanta GA`;
  const desc = post.meta_description || post.excerpt || post.title;
  const dateText = fmtDate(post.published_at || post.created_at);
  const dateAttr = (post.published_at || post.created_at || "").slice(0, 10);
  const read = post.read_minutes ? `${post.read_minutes} min read` : "";
  const { html: bodyHtml, toc } = withToc(post.body_html || "");
  const tocLinks = toc.map(([id, t]) => `<li><a href="#${id}">${esc(t)}</a></li>`).join("");

  const trail = [{ name: "Home", url: "/" }, { name: "Blog", url: "/blog" }, { name: post.title, url }];
  const words = (post.body_html || "").replace(/<[^>]*>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  const mins = post.read_minutes || Math.max(1, Math.round(words / 200));
  // A named author (Person) is better for E-E-A-T; fall back to the brand.
  const author = post.author
    ? { "@type": "Person", name: post.author }
    : { "@type": "Organization", name: "SEO Atlanta GA", url: C.SITE + "/" };
  const article = {
    "@type": "BlogPosting", "@id": C.SITE + url + "#article",
    headline: post.title, description: desc,
    datePublished: dateAttr, dateModified: (post.updated_at || post.created_at || "").slice(0, 10),
    url: C.SITE + url, mainEntityOfPage: C.SITE + url,
    author: author,
    publisher: { "@id": C.SITE + "/#business" },
    articleSection: post.category || "SEO", inLanguage: "en-US"
  };
  if (words) article.wordCount = words;
  if (mins) article.timeRequired = "PT" + mins + "M";
  if (post.cover_url) article.image = post.cover_url;

  const cover = post.cover_url
    ? `<div class="article-hero photo-frame reveal in"><img src="${esc(post.cover_url)}" alt="${esc(post.title)}" width="1400" height="560" fetchpriority="high" decoding="async"></div>`
    : "";

  const tocMobile = tocLinks ? `<details class="toc-mobile"><summary>On this page</summary><ol>${tocLinks}</ol></details>` : "";
  const tocSide = tocLinks ? `<nav class="toc-nav" id="tocNav" aria-label="On this page"><h4>On this page</h4><ol>${tocLinks}</ol></nav>` : "";

  const body = `
<div class="readbar" id="readbar" aria-hidden="true"></div>

<div class="page-hero">
  <div class="mesh2" aria-hidden="true"></div>
  <div class="wrap">
    ${C.crumbHtml(trail)}
    <span class="eyebrow">${esc(post.category || "SEO")}</span>
    <h1 style="max-width:20ch">${esc(post.title)}</h1>
    ${post.excerpt ? `<p class="sub" style="max-width:56ch">${esc(post.excerpt)}</p>` : ""}
    <div class="art-meta">
      <span class="cat">${esc(post.category || "SEO")}</span>
      ${post.author ? `<span>By ${esc(post.author)}</span>` : ""}
      ${dateText ? `<time datetime="${dateAttr}">${dateText}</time>` : ""}
      ${read ? `<span>${read}</span>` : ""}
    </div>
  </div>
</div>

<section style="padding-top:52px">
  <div class="wrap">
    <div class="article-grid">
      <div class="article-main">
        ${cover}
        ${tocMobile}
        <article class="prose" id="articleBody">
          ${bodyHtml}
          <div class="author">
            <div style="display:flex;gap:14px;align-items:center">
              <div class="av">SA</div>
              <div><div class="n">The SEO Atlanta GA team</div><div class="r">Search strategists, Atlanta GA</div></div>
            </div>
          </div>
        </article>
      </div>
      <aside class="article-side">
        ${tocSide}
        <div class="side-cta">
          <p>Want this done on your site? Send us the URL and we'll reply with what we'd change first.</p>
          <a class="btn btn-primary" href="#start" data-cta="article_side_${esc(post.slug)}">Get a free review →</a>
        </div>
      </aside>
    </div>
  </div>
</section>

<div id="start"></div>
${C.formSection({
    id: `post-${post.slug}`.replace(/[^a-z0-9-]/gi, ""),
    name: `blog-${post.slug}`,
    heading: "Want this done on your site?",
    sub: "Send us the URL. We'll reply with the specific things we'd change, whether or not you ever hire us."
  })}`;

  const html = C.page({
    url, title, desc, active: "/blog", ogType: "article",
    graph: [article, C.breadcrumbs(trail)], body
  });

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=60, stale-while-revalidate=600");
  return res.status(200).send(html);
};
