/* Shared chrome for every generated page. */
const SITE = "https://seoatlantaga.com";
const EMAIL = "hello@seoatlantaga.com";

const LOGO = (fill) => `<svg class="logo-anim" width="34" height="30" viewBox="0 0 52 46" aria-hidden="true"><path d="M3 43 L17 8 L24 22 L15.5 43 Z" fill="${fill}"/><path d="M26 43 L31.5 29 L38.5 43 Z" fill="${fill}"/><path d="M2 44 C16 37 30 25 41 10" stroke="#1B72F0" stroke-width="5.5" fill="none" stroke-linecap="round"/><path d="M33 7 L45 5 L43 17 Z" fill="#1B72F0"/></svg>`;

const SERVICES = [
  ["/services/local-seo", "Local SEO"],
  ["/services/ai-content", "AI Content Engine"],
  ["/services/technical-seo", "Technical SEO"],
  ["/services/answer-engine-optimization", "Answer Engine Optimization"],
  ["/services/link-building", "Link Building"],
  ["/services/seo-reporting", "Reporting &amp; Analytics"]
];

const FOOTER_LABEL = {
  "/services/local-seo": "Local SEO Atlanta",
  "/services/ai-content": "SEO Content Writing Atlanta",
  "/services/technical-seo": "Technical SEO Atlanta",
  "/services/answer-engine-optimization": "Answer Engine Optimization Atlanta",
  "/services/link-building": "Link Building Atlanta",
  "/services/seo-reporting": "SEO Reporting Services Atlanta"
};

function header(active) {
  const dd = SERVICES.map(([h, t]) => `<a href="${h}"${active === h ? ' class="active"' : ""}>${t}</a>`).join("");
  const mob = SERVICES.map(([h, t]) => `<a href="${h}">${t}</a>`).join("");
  const on = (h) => (active === h ? ' class="active"' : "");
  return `<header><div class="wrap"><nav>
<a class="brand" href="/">${LOGO("#0E2A5C")}<span><span class="seo">SEO</span><span class="atl"> Atlanta</span><span class="ga">GA</span></span></a>
<div class="navlinks">
<a href="/"${on("/")}>Home</a>
<div class="dd"><a href="/#services">Services ▾</a><div class="dd-menu">${dd}</div></div>
<a href="/#roi">ROI Tool</a>
<a href="/blog"${on("/blog")}>Blog</a>
<a href="/contact"${on("/contact")}>Contact</a>
</div>
<a class="btn btn-primary" style="padding:11px 20px;font-size:14px" href="/#audit" data-cta="nav_audit">Get free audit</a>
<button class="menu-btn" aria-label="Menu" aria-expanded="false">☰</button>
</nav>
<div class="mobile-nav"><a href="/">Home</a>${mob}<a href="/blog">Blog</a><a href="/contact">Contact</a><a href="/#audit">Free Audit</a></div>
</div></header>`;
}

const FOOTER = `<footer><div class="wrap"><div class="foot-grid">
<div><div class="foot-brand">${LOGO("#FFFFFF")}<span>SEO Atlanta <span style="font-size:11px;vertical-align:top;color:#4DA3FF">GA</span></span></div>
<p>SEOAtlantaGA.com — AI-powered search growth for Atlanta businesses. Rank higher, get found, grow faster.</p></div>
<div><h4>SEO services in Atlanta</h4>${SERVICES.map(([h, t]) => `<a href="${h}">${FOOTER_LABEL[h] || t}</a>`).join("")}</div>
<div><h4>Resources</h4><a href="/blog">Blog</a><a href="/#roi">SEO ROI Calculator</a><a href="/#audit">Free AI Audit</a><a href="/#faq">FAQ</a></div>
<div><h4>Company</h4><a href="/contact">Contact</a><a href="/#process">How we work</a><a href="/privacy">Privacy Policy</a><a href="/terms">Terms of Service</a><a href="mailto:${EMAIL}">${EMAIL}</a></div>
</div><div class="foot-bottom"><span>© 2026 SEOAtlantaGA.com · Atlanta, Georgia</span><span>Built fast. Ranked faster.</span></div></div></footer>
<script src="/assets/js/analytics.js"></script>
<script src="/assets/js/site.js"></script>
</body></html>`;

/* The two identity nodes every page's JSON-LD graph points back to. */
const ORG_NODE = {
  "@type": "ProfessionalService",
  "@id": SITE + "/#business",
  name: "SEO Atlanta GA",
  url: SITE + "/",
  description: "AI-powered SEO agency in Atlanta, GA offering local SEO, AI content, technical SEO and answer engine optimization.",
  email: EMAIL,
  address: { "@type": "PostalAddress", addressLocality: "Atlanta", addressRegion: "GA", addressCountry: "US" },
  areaServed: { "@type": "City", name: "Atlanta" },
  priceRange: "$1,500–$5,000/mo",
  logo: SITE + "/favicon.svg"
};

/* Site-level entity node, included on every rendered page. */
const WEBSITE_NODE = {
  "@type": "WebSite",
  "@id": SITE + "/#website",
  url: SITE + "/",
  name: "SEO Atlanta GA",
  inLanguage: "en-US",
  publisher: { "@id": SITE + "/#business" }
};

function breadcrumbs(trail) {
  return {
    "@type": "BreadcrumbList",
    "@id": SITE + trail[trail.length - 1].url + "#breadcrumb",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem", position: i + 1, name: t.name, item: SITE + t.url
    }))
  };
}

function faqNode(url, faqs) {
  return {
    "@type": "FAQPage",
    "@id": SITE + url + "#faq",
    mainEntity: faqs.map(([q, a]) => ({
      "@type": "Question", name: q,
      acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]*>/g, "") }
    }))
  };
}

function crumbHtml(trail) {
  return `<div class="crumb">` + trail.map((t, i) =>
    i === trail.length - 1 ? `<span>${t.name}</span>` : `<a href="${t.url}">${t.name}</a><span>/</span>`
  ).join("") + `</div>`;
}

function faqHtml(faqs) {
  return `<div class="faq">` + faqs.map(([q, a]) =>
    `<div class="faq-item"><div class="faq-q">${q}<span class="ic">+</span></div><div class="faq-a">${a}</div></div>`
  ).join("") + `</div>`;
}

function page({ url, title, desc, active, graph = [], body, ogType = "website", head = "", bodyEnd = "" }) {
  const ld = { "@context": "https://schema.org", "@graph": [ORG_NODE, WEBSITE_NODE, ...graph] };
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title}</title>
<meta name="description" content="${desc}">
<link rel="canonical" href="${SITE}${url}">
<meta name="theme-color" content="#04081A">
<link rel="icon" type="image/svg+xml" href="/favicon.svg">
<meta property="og:type" content="${ogType}">
<meta property="og:site_name" content="SEO Atlanta GA">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:url" content="${SITE}${url}">
<meta property="og:image" content="${SITE}/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${title}">
<meta name="twitter:description" content="${desc}">
<meta name="twitter:image" content="${SITE}/og.jpg">
<script type="application/ld+json">
${JSON.stringify(ld)}
</script>

<link rel="preload" href="/assets/fonts/sora.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/inter.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/fonts.css">
<link rel="stylesheet" href="/assets/css/site.css">
${head}
</head><body>
${header(active)}
${body}
${bodyEnd}
${FOOTER}
`;
}

/* Reusable lead form. `variant` picks the field set. */
function leadForm({ id, name, service = "", compact = false }) {
  const serviceRow = compact ? "" : `
  <div><label for="${id}-service">What do you need help with?</label>
    <select id="${id}-service" name="service">
      <option value="">Not sure yet — advise me</option>
      <option${service === "Local SEO" ? " selected" : ""}>Local SEO</option>
      <option${service === "AI Content Engine" ? " selected" : ""}>AI Content Engine</option>
      <option${service === "Technical SEO" ? " selected" : ""}>Technical SEO</option>
      <option${service === "Answer Engine Optimization" ? " selected" : ""}>Answer Engine Optimization</option>
      <option${service === "Link Building" ? " selected" : ""}>Link Building</option>
      <option${service === "Reporting &amp; Analytics" ? " selected" : ""}>Reporting &amp; Analytics</option>
    </select></div>
  <div><label for="${id}-budget">Monthly budget</label>
    <select id="${id}-budget" name="budget">
      <option value="">Prefer not to say</option>
      <option>Under $1,500</option><option>$1,500 – $3,000</option>
      <option>$3,000 – $5,000</option><option>$5,000+</option>
    </select></div>`;
  return `<form class="lead-form" id="${id}" data-lead-form="${name}" action="/api/lead" method="post" novalidate>
  <div><label for="${id}-name">Your name</label>
    <input id="${id}-name" name="name" type="text" autocomplete="name" placeholder="Jordan Fields" data-required><div class="err"></div></div>
  <div><label for="${id}-email">Work email</label>
    <input id="${id}-email" name="email" type="email" autocomplete="email" placeholder="you@yourbusiness.com" data-required><div class="err"></div></div>
  <div><label for="${id}-website">Website</label>
    <input id="${id}-website" name="website" type="text" placeholder="yourbusiness.com" data-kind="domain" data-required><div class="err"></div></div>
  <div><label for="${id}-phone">Phone <span style="color:var(--muted);font-weight:400">(optional)</span></label>
    <input id="${id}-phone" name="phone" type="tel" autocomplete="tel" placeholder="(404) 000-0000"><div class="err"></div></div>
${serviceRow}
  <div class="full"><label for="${id}-message">What are you trying to rank for?</label>
    <textarea id="${id}-message" name="message" placeholder="e.g. “We're a Buckhead HVAC company and we don't show up in the map pack for emergency AC repair.”"></textarea><div class="err"></div></div>
  <div class="hp" aria-hidden="true"><label for="${id}-cw">Company website</label><input id="${id}-cw" name="company_website" type="text" tabindex="-1" autocomplete="off"></div>
  <div class="full"><button class="btn btn-primary" type="submit" style="width:100%;justify-content:center;padding:15px 26px">Send my request →</button></div>
  <div class="form-status" role="status" aria-live="polite"></div>
  <p class="form-note full">We reply within one business day. No call centre, no drip sequence — read our <a href="/privacy">privacy policy</a>.</p>
</form>`;
}

function formSection({ id, name, service, heading, sub }) {
  return `<section class="dk contact-band" style="padding-top:64px;padding-bottom:88px">
  <div class="wrap">
    <div class="split" style="align-items:start;gap:52px">
      <div class="reveal">
        <span class="eyebrow">Talk to us</span>
        <h2>${heading}</h2>
        <p style="color:var(--dk-sub);font-size:17px;margin-top:12px">${sub}</p>
        <ul class="checklist" style="margin-top:24px">
          <li>A real audit of your site, not a template PDF</li>
          <li>The three fixes we'd make first, and why</li>
          <li>An honest read on how competitive your keywords are</li>
          <li>No obligation, and no pitch deck</li>
        </ul>
        <p style="color:var(--dk-mut);font-size:14px;margin-top:24px">Prefer email? <a href="mailto:${EMAIL}" style="color:var(--sky)">${EMAIL}</a></p>
      </div>
      <div class="form-card reveal d1">${leadForm({ id, name, service })}</div>
    </div>
  </div>
</section>`;
}

module.exports = { SITE, EMAIL, page, breadcrumbs, faqNode, crumbHtml, faqHtml, leadForm, formSection, SERVICES };
