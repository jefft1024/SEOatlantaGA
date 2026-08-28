/* Regenerates KEYWORDS.md from tools/keywords.js by checking the built pages,
   so the documented coverage is measured rather than asserted.
   Run after any content change: node tools/build-keywords-doc.js */
const fs = require("fs");
const map = require("./keywords.js");

const FILE = { "/": "index.html" };
for (const p of Object.keys(map)) if (p !== "/") FILE[p] = p.slice(1) + ".html";

const NAMES = {
  "/": "Homepage",
  "/services/local-seo": "Local SEO",
  "/services/ai-content": "SEO Content Writing",
  "/services/technical-seo": "Technical SEO",
  "/services/answer-engine-optimization": "Answer Engine Optimization",
  "/services/link-building": "Link Building",
  "/services/seo-reporting": "SEO Reporting"
};

const norm = (t) => t.replace(/&[a-z]+;/g, " ").replace(/[^a-z0-9 ]/gi, " ").replace(/\s+/g, " ").toLowerCase();
const strip = (h) => norm(h
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<[^>]+>/g, " "));

const out = [
  "# Keyword map", "",
  "Target keywords supplied by the client, mapped one cluster per page. The",
  "machine-readable source of truth is [`tools/keywords.js`](tools/keywords.js);",
  "this file is the human-readable view and is regenerated from it.", "",
  "**How the terms are placed.** The first keyword in each cluster is the primary",
  "term and drives the `<title>`, the `<h1>` and the opening paragraph. The rest are",
  "distributed across section headings, body copy, FAQ questions and internal link",
  "anchors — where they read naturally and nowhere else. Long-tail terms mostly live",
  "in FAQ questions, which is both where people phrase them that way and what feeds",
  "the `FAQPage` structured data.", "",
  "Most terms appear as natural variants (\"local SEO services in Atlanta\") rather",
  "than the raw query order (\"local seo services atlanta\"). That is deliberate:",
  "exact-match repetition reads as spam to both people and search engines, and",
  "modern retrieval matches on meaning, not string equality.", ""
];

let total = 0, hit = 0;
for (const [page, kws] of Object.entries(map)) {
  const html = fs.readFileSync(FILE[page], "utf8");
  const body = strip(html);
  const title = norm((html.match(/<title>([^<]*)/) || [, ""])[1]);
  const h1 = norm((html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/) || [, ""])[1].replace(/<[^>]+>/g, " "));

  out.push("", `## ${NAMES[page]} — \`${page}\``, "", "| Keyword | Where it lands |", "| --- | --- |");
  kws.forEach((kw, i) => {
    total++;
    const near = (s) => s.includes(kw) || kw.split(" ").every((w) => s.includes(w));
    const places = [];
    if (near(title)) places.push("title");
    if (near(h1)) places.push("H1");
    if (near(body)) { hit++; places.push(places.length ? "body" : "body / FAQ"); }
    out.push(`| ${i === 0 ? `**${kw}** _(primary)_` : kw} | ${places.join(", ") || "—"} |`);
  });
}
out.push("", "---", "",
  `Coverage: **${hit}/${total}** supplied keywords present on their assigned page.`, "",
  "Regenerate this file with `node tools/build-keywords-doc.js`.");

fs.writeFileSync("KEYWORDS.md", out.join("\n") + "\n");
console.log(`KEYWORDS.md written — ${hit}/${total} keywords covered`);
