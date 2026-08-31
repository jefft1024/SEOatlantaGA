/* Adds data-cms / data-cms-label attributes to editable text blocks in
 * templates/home.html. Each target is anchored on a unique opening-tag +
 * leading-text string; the attributes are inserted into that opening tag only.
 * Idempotent-ish: re-running errors if an anchor is already tagged (the anchor
 * no longer matches), which is the intended guard. Run: node tools/tag-home.js */
const fs = require("fs");
const path = require("path");
const FILE = path.join(__dirname, "..", "templates", "home.html");

// [anchor (unique opening tag + leading text), key, label]
const TARGETS = [
  ['<span class="eyebrow">AI-powered SEO agency · Atlanta, GA', "hero_eyebrow", "Hero — eyebrow"],
  ['<p class="sub">An SEO company in Atlanta', "hero_sub", "Hero — subheading"],

  ['<span class="eyebrow">Free AI audit', "audit_eyebrow", "Audit — eyebrow"],
  ["<h2>Scan your site in 60 seconds", "audit_h2", "Audit — heading"],
  ["<p>Enter your domain and our engine", "audit_p", "Audit — intro"],

  ['<span class="eyebrow">What we do', "services_eyebrow", "Services — eyebrow"],
  ["<h2>SEO services in Atlanta, run by experts and accelerated by AI", "services_h2", "Services — heading"],
  ["<p>Six services, one goal", "services_p", "Services — intro"],

  ["<h3>Local SEO</h3>", "svc1_h3", "Service card 1 — title"],
  ["<p>Own the map pack", "svc1_p", "Service card 1 — text"],
  ["<h3>AI Content Engine</h3>", "svc2_h3", "Service card 2 — title"],
  ["<p>Location-specific content", "svc2_p", "Service card 2 — text"],
  ["<h3>Technical SEO</h3>", "svc3_h3", "Service card 3 — title"],
  ["<p>Speed, schema, crawlability", "svc3_p", "Service card 3 — text"],
  ["<h3>Answer Engine Optimization</h3>", "svc4_h3", "Service card 4 — title"],
  ["<p>Get cited by ChatGPT", "svc4_p", "Service card 4 — text"],
  ["<h3>Link Building</h3>", "svc5_h3", "Service card 5 — title"],
  ["<p>Earn authoritative local backlinks", "svc5_p", "Service card 5 — text"],
  ["<h3>Reporting &amp; Analytics</h3>", "svc6_h3", "Service card 6 — title"],
  ["<p>A live dashboard plus", "svc6_p", "Service card 6 — text"],

  ['<span class="eyebrow">Interactive tool', "roi_eyebrow", "ROI — eyebrow"],
  ["<h2>Estimate your SEO ROI", "roi_h2", "ROI — heading"],
  ["<p>Drag the sliders to see", "roi_p", "ROI — intro"],

  ['<span class="eyebrow">Before &amp; after', "ba_eyebrow", "Before/after — eyebrow"],
  ["<h2>The difference six months makes", "ba_h2", "Before/after — heading"],
  ["<p>Drag the handle to compare", "ba_p", "Before/after — intro"],

  ['<span class="eyebrow">How it works', "process_eyebrow", "Process — eyebrow"],
  ["<h2>From audit to first page in four steps", "process_h2", "Process — heading"],
  ["<h3>Free AI audit</h3>", "step1_h3", "Process step 1 — title"],
  ["<p>Our engine scans your site", "step1_p", "Process step 1 — text"],
  ["<h3>Strategy call</h3>", "step2_h3", "Process step 2 — title"],
  ["<p>A strategist walks you through", "step2_p", "Process step 2 — text"],
  ["<h3>Build &amp; optimize</h3>", "step3_h3", "Process step 3 — title"],
  ["<p>We execute — content", "step3_p", "Process step 3 — text"],
  ["<h3>Grow &amp; report</h3>", "step4_h3", "Process step 4 — title"],
  ["<p>Rankings climb, leads roll in", "step4_p", "Process step 4 — text"],

  ['<span class="eyebrow">Local advantage', "local_eyebrow", "Local advantage — eyebrow"],
  ["<h2>Why Atlanta businesses choose our SEO company", "local_h2", "Local advantage — heading"],
  ['<p style="color:var(--ink-2);font-size:16.5px;margin-bottom:16px">Rankings here', "local_p", "Local advantage — text"],

  ['<span class="eyebrow">Client results', "testi_eyebrow", "Testimonials — eyebrow"],
  ["<h2>Atlanta businesses on working with us", "testi_h2", "Testimonials — heading"],
  ['<p>"We went from invisible', "testi1_p", "Testimonial 1"],
  ['<p>"The AI audit found things', "testi2_p", "Testimonial 2"],
  ['<p>"What sold me was the dashboard', "testi3_p", "Testimonial 3"],

  ['<span class="eyebrow">What you get', "wyg_eyebrow", "What you get — eyebrow"],
  ["<h2>The work, not the deck", "wyg_h2", "What you get — heading"],
  ["<p>Three of the things we actually build", "wyg_p", "What you get — intro"],

  ['<span class="eyebrow">From the blog', "blog_eyebrow", "Blog preview — eyebrow"],
  ['<h2 style="margin-bottom:0">Atlanta SEO, explained plainly', "blog_h2", "Blog preview — heading"],

  ['<span class="eyebrow">Questions', "faq_eyebrow", "FAQ — eyebrow"],
  ["<h2>Atlanta SEO agency: frequently asked questions", "faq_h2", "FAQ — heading"],

  ['<span class="eyebrow">Talk to us', "contact_eyebrow", "Contact — eyebrow"],
  ["<h2>Get the real audit, from a person", "contact_h2", "Contact — heading"],
  ['<p style="color:var(--dk-sub);font-size:17px;margin-top:12px">The scanner above', "contact_p", "Contact — intro"],

  ['<span class="eyebrow">Get started', "cta_eyebrow", "CTA — eyebrow"],
  ["<h2>See where you rank — free, in 60 seconds", "cta_h2", "CTA — heading"],
  ["<p>Run the AI audit above", "cta_p", "CTA — text"]
];

let html = fs.readFileSync(FILE, "utf8");
let tagged = 0;
for (const [anchor, key, label] of TARGETS) {
  const count = html.split(anchor).length - 1;
  if (count !== 1) { console.error(`✗ anchor not unique (${count}x): ${key} — ${anchor}`); process.exit(1); }
  const rep = anchor.replace(">", ` data-cms="${key}" data-cms-label="${label}">`);
  html = html.replace(anchor, rep);
  tagged++;
}
fs.writeFileSync(FILE, html);
console.log(`tagged ${tagged} editable blocks in templates/home.html`);
