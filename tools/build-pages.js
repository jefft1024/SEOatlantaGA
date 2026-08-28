const fs = require("fs");
const C = require("./lib/chrome.js");
const UPDATED = "28 August 2026";

/* ── contact ───────────────────────────────────────────────────────────── */
const cTrail = [{ name: "Home", url: "/" }, { name: "Contact", url: "/contact" }];
const cFaqs = [
  ["How quickly will I hear back?", "Within one business day, from a person who has already looked at your site. If we think we're the wrong fit, we'll say that instead of booking a call to say it."],
  ["What happens on the first call?", "We walk through what we found in your site, what we'd do first and why, and roughly what it costs. There is no deck. If you'd rather stay on email, that's fine too."],
  ["Do you require a long-term contract?", "No. Engagements run month to month. SEO takes months to compound, so we'd rather you stay because it's working than because you signed something."],
  ["Do you work with businesses outside Atlanta?", "Yes. Atlanta is where we're based and where our local knowledge is deepest, but technical SEO, content and answer engine work are not geographically constrained."],
  ["What do you need from me to get started?", "Read access to Google Search Console, Google Analytics and your Google Business Profile, plus whoever knows the business best for an hour. That's enough for a real audit."]
];
const contactBody = `
<div class="page-hero">
  <div class="mesh2" aria-hidden="true"></div>
  <div class="wrap">
    ${C.crumbHtml(cTrail)}
    <div class="split hero-split even">
      <div>
        <span class="eyebrow">Contact</span>
        <h1>Tell us what's <span class="blue">not ranking</span></h1>
        <p class="sub" style="max-width:52ch">Send your site and the searches you want to win. You'll get a real answer from a real person within one business day — not a calendar link.</p>
      </div>
      <div class="hero-art">
        <img src="/assets/img/atlanta.svg" alt="Illustrated Atlanta skyline at night" width="1200" height="760" fetchpriority="high" decoding="async">
      </div>
    </div>
  </div>
</div>

<section style="padding-top:56px">
  <div class="wrap">
    <div class="split" style="align-items:start;gap:52px">
      <div class="reveal">
        <h2 style="font-size:27px">What you'll get back</h2>
        <ul class="checklist" style="margin-top:20px">
          <li>A look at your actual pages, not a template audit</li>
          <li>The three things we'd fix first, in priority order</li>
          <li>An honest read on how hard your target keywords are</li>
          <li>A straight answer on whether we're the right fit</li>
        </ul>
        <div class="feat-grid" style="grid-template-columns:1fr;margin-top:30px">
          <div class="feat"><div class="ic">✉️</div><div><h4>Email</h4><p><a href="mailto:${C.EMAIL}" style="color:var(--blue)">${C.EMAIL}</a></p></div></div>
          <div class="feat"><div class="ic">📍</div><div><h4>Where we are</h4><p>Atlanta, Georgia — working with businesses across metro Atlanta and beyond.</p></div></div>
          <div class="feat"><div class="ic">🕘</div><div><h4>Response time</h4><p>One business day, every time. Monday to Friday.</p></div></div>
        </div>
      </div>
      <div class="form-card reveal d1" style="background:#fff">
        <h3 style="font-family:var(--display);font-size:21px;margin-bottom:6px">Send us your site</h3>
        <p style="font-size:14px;color:var(--muted);margin-bottom:24px">Everything except the message is quick. The message is the part that gets you a better answer.</p>
        ${C.leadForm({ id: "contact", name: "contact" })}
      </div>
    </div>
  </div>
</section>

<section style="padding-top:56px;padding-bottom:40px">
  <div class="wrap">
    <div class="sec-head center reveal"><span class="eyebrow">Before you write</span><h2>Common questions</h2></div>
    <div class="reveal d1">${C.faqHtml(cFaqs)}</div>
  </div>
</section>`;

fs.writeFileSync("contact.html", C.page({
  url: "/contact",
  title: "Contact | Get a Free SEO Review — SEO Atlanta GA",
  desc: "Send us your website and the searches you want to win. A real answer from a real person within one business day — no calendar links, no sales sequence.",
  active: "/contact",
  graph: [
    { "@type": "ContactPage", "@id": C.SITE + "/contact#page", url: C.SITE + "/contact", name: "Contact SEO Atlanta GA", about: { "@id": C.SITE + "/#business" } },
    C.breadcrumbs(cTrail),
    C.faqNode("/contact", cFaqs)
  ],
  body: contactBody
}));

/* ── thank you ─────────────────────────────────────────────────────────── */
fs.writeFileSync("thank-you.html", C.page({
  url: "/thank-you",
  title: "Thanks — we've got your request | SEO Atlanta GA",
  desc: "Your request reached us. We'll reply within one business day with a real look at your site.",
  active: "",
  graph: [],
  body: `
<div class="page-hero" style="padding-bottom:0">
  <div class="mesh2" aria-hidden="true"></div>
  <div class="wrap" style="text-align:center;max-width:680px">
    <span class="eyebrow" style="justify-content:center">Received</span>
    <h1>That's <span class="blue">with us</span></h1>
    <p class="sub" style="max-width:none;margin:0 auto 28px">We'll come back within one business day with what we found on your site and what we'd do about it. If it's urgent, reply straight to the confirmation email and it'll jump the queue.</p>
  </div>
</div>

<section style="padding-top:52px">
  <div class="wrap">
    <div class="sec-head center reveal"><span class="eyebrow">While you wait</span><h2>Worth ten minutes</h2></div>
    <div class="cards reveal d1">
      <a class="card" href="/#audit"><div class="card-body"><div class="num">01</div><h3>Run the instant audit</h3><p>A 60-second simulated scan of your domain — score, issues and the fixes we'd prioritise.</p><span class="more">Open the audit →</span></div></a>
      <a class="card" href="/#roi"><div class="card-body"><div class="num">02</div><h3>Model your SEO ROI</h3><p>Put your own numbers in and see what moving up the results page is actually worth.</p><span class="more">Open the calculator →</span></div></a>
      <a class="card" href="/blog"><div class="card-body"><div class="num">03</div><h3>Read the guides</h3><p>Map pack rankings, ROI modelling and answer engine optimization, written plainly.</p><span class="more">Read the blog →</span></div></a>
    </div>
  </div>
</section>
<div style="height:60px"></div>`
}));

/* ── legal ─────────────────────────────────────────────────────────────── */
function legal({ url, title, desc, h1, eyebrow, intro, sections }) {
  const trail = [{ name: "Home", url: "/" }, { name: h1, url }];
  return C.page({
    url, title, desc, active: "",
    graph: [C.breadcrumbs(trail)],
    body: `
<div class="page-hero">
  <div class="mesh2" aria-hidden="true"></div>
  <div class="wrap">
    ${C.crumbHtml(trail)}
    <span class="eyebrow">${eyebrow}</span>
    <h1>${h1}</h1>
    <p class="updated">Last updated: ${UPDATED}</p>
  </div>
</div>
<section style="padding-top:52px;padding-bottom:40px">
  <div class="wrap">
    <div class="legal reveal">
      ${intro.map((p) => `<p>${p}</p>`).join("\n      ")}
      ${sections.map(([h, ps]) => `<h2>${h}</h2>\n      ${ps.join("\n      ")}`).join("\n      ")}
    </div>
  </div>
</section>`
  });
}

fs.writeFileSync("privacy.html", legal({
  url: "/privacy",
  title: "Privacy Policy — SEO Atlanta GA",
  desc: "How SEOAtlantaGA.com collects, uses and protects your information, and the choices you have over it.",
  h1: "Privacy Policy",
  eyebrow: "Legal",
  intro: [
    "This policy explains what SEOAtlantaGA.com (\"we\", \"us\") collects when you use this website, why we collect it, and what you can do about it. It is written to be read rather than to be survived.",
    "Questions about anything here go to <a href=\"mailto:" + C.EMAIL + "\" style=\"color:var(--blue)\">" + C.EMAIL + "</a>."
  ],
  sections: [
    ["Information you give us", [
      "<p>When you submit a form on this site — the contact form, a service enquiry or an audit request — we collect what you type into it. That is typically your name, email address, website, and optionally your phone number, budget range, the service you are interested in, and whatever you write in the message field.</p>",
      "<p>We also record the page you submitted from, the referring page, and any campaign parameters (UTM tags) in the URL, so we know how you found us.</p>",
      "<p>Everything on our forms is voluntary. If you would rather email us directly, <a href=\"mailto:" + C.EMAIL + "\" style=\"color:var(--blue)\">" + C.EMAIL + "</a> reaches the same place.</p>"
    ]],
    ["Information collected automatically", [
      "<p>Like most websites, we use analytics to understand which pages people read and which ones fail them. Depending on configuration, this may include Google Analytics 4, which sets cookies and collects your approximate location (derived from a truncated IP address), device and browser type, pages viewed, and how you arrived.</p>",
      "<p>We do not use this data to identify you personally, and we do not attempt to link it to the information you submit on a form unless you have submitted that form yourself.</p>",
      "<p>Our hosting provider keeps standard server logs, including IP addresses, for security and abuse prevention. Form submissions are rate-limited by IP address for the same reason.</p>"
    ]],
    ["How we use it", [
      "<p>We use the information you give us to reply to your enquiry, prepare the review or audit you asked for, and — if you become a client — to deliver the work.</p>",
      "<p>We use automatically collected information to measure and improve the site.</p>",
      "<p>We do not sell your information. We do not share it with third parties for their own marketing. We do not add you to a mailing list because you filled in a contact form.</p>"
    ]],
    ["Who we share it with", [
      "<p>We use a small number of service providers who process data on our behalf:</p>",
      "<ul><li><b>Hosting and form delivery</b> — our host runs the website and the endpoint that receives form submissions.</li><li><b>Email delivery</b> — to route your enquiry to our inbox.</li><li><b>Analytics</b> — to measure site usage in aggregate.</li></ul>",
      "<p>We will also disclose information where we are legally required to, or where it is necessary to protect our rights or someone's safety.</p>"
    ]],
    ["Cookies", [
      "<p>Cookies used on this site fall into two groups. Strictly necessary cookies keep the site working and are always on. Analytics cookies measure usage and are only set when analytics is enabled.</p>",
      "<p>You can block or delete cookies in your browser settings. Blocking analytics cookies does not affect your ability to use the site or contact us.</p>"
    ]],
    ["How long we keep it", [
      "<p>Enquiries that do not become client work are kept for up to 24 months so we recognise you if you come back, then deleted. Records relating to client engagements are kept for as long as the relationship lasts and afterwards for as long as we are required to for tax and legal purposes. Analytics data follows the retention period configured in the analytics platform.</p>"
    ]],
    ["Your choices and rights", [
      "<p>You can ask us to give you a copy of the information we hold about you, correct it, or delete it. You can ask us to stop using it for a particular purpose. Email <a href=\"mailto:" + C.EMAIL + "\" style=\"color:var(--blue)\">" + C.EMAIL + "</a> and we will respond within 30 days.</p>",
      "<p>Georgia residents and visitors from jurisdictions with specific privacy legislation — including the EU/UK under GDPR and California under the CCPA/CPRA — have these rights as a matter of law. We extend them to everyone regardless of where you are, because operating two standards is more work than operating one.</p>",
      "<p>We do not sell or share personal information as those terms are defined under California law.</p>"
    ]],
    ["Security", [
      "<p>The site is served over HTTPS. Form submissions are transmitted encrypted and validated server-side. Access to enquiry data is limited to the people who need it to reply to you. No system is perfectly secure, and we will not claim otherwise.</p>"
    ]],
    ["Children", [
      "<p>This site is intended for businesses. We do not knowingly collect information from anyone under 16. If you believe a child has submitted information to us, email us and we will delete it.</p>"
    ]],
    ["Changes to this policy", [
      "<p>If we change this policy we will update the date at the top of the page. Material changes will be flagged on the site itself rather than made quietly.</p>"
    ]],
    ["Contact", [
      "<p>SEOAtlantaGA.com<br>Atlanta, Georgia, United States<br><a href=\"mailto:" + C.EMAIL + "\" style=\"color:var(--blue)\">" + C.EMAIL + "</a></p>"
    ]]
  ]
}));

fs.writeFileSync("terms.html", legal({
  url: "/terms",
  title: "Terms of Service — SEO Atlanta GA",
  desc: "The terms that govern use of SEOAtlantaGA.com, including the limits of the free tools and the basis on which we provide services.",
  h1: "Terms of Service",
  eyebrow: "Legal",
  intro: [
    "These terms govern your use of SEOAtlantaGA.com. By using the site you agree to them. If you do not, please do not use the site.",
    "These terms cover the website and its free tools. Client engagements are governed by a separate written agreement, which takes precedence over anything here."
  ],
  sections: [
    ["The free tools on this site", [
      "<p>The instant audit and the ROI calculator are illustrative estimation tools. They are clearly labelled as such on the page, and it is worth restating here:</p>",
      "<ul><li>The instant audit produces a <b>simulated preview</b>. It does not crawl your website. The score, issue counts and metrics it displays are generated for illustration and must not be relied on as a factual assessment of your site.</li><li>The ROI calculator applies published industry click-through-rate averages to figures you supply. Its output is a model, not a projection or a guarantee of results.</li></ul>",
      "<p>A real audit involves an actual crawl of your site and is delivered by a person. Ask us for one and we will run it.</p>"
    ]],
    ["No guarantee of results", [
      "<p>Search rankings depend on factors outside anyone's control, including competitor behaviour and changes to search engine algorithms. Nobody can guarantee a ranking position, and anyone who does is either misinformed or lying. We do not guarantee specific rankings, traffic volumes or revenue outcomes, on this site or in an engagement.</p>"
    ]],
    ["Content on this site", [
      "<p>Articles, guides and tools on this site are general information, not professional advice tailored to your circumstances. We work to keep them accurate and current, but search changes quickly and we make no warranty that everything here is up to date at the moment you read it.</p>"
    ]],
    ["Intellectual property", [
      "<p>The content, design, code and branding of this site belong to us, except where marked otherwise. You may read, print and share it for your own non-commercial use, and you may quote it with attribution and a link. You may not republish it wholesale, resell it, or present it as your own.</p>"
    ]],
    ["Acceptable use", [
      "<p>Do not attempt to gain unauthorised access to the site or its systems, submit forms automatically or in bulk, scrape the site in a way that degrades it for others, or use the site to transmit anything unlawful. We rate-limit form submissions and may block access where we see abuse.</p>"
    ]],
    ["Third-party links", [
      "<p>We link to external sites where they are useful. We do not control them and are not responsible for their content, accuracy or privacy practices.</p>"
    ]],
    ["Limitation of liability", [
      "<p>To the fullest extent permitted by law, we are not liable for any indirect, incidental, consequential or punitive damages, or for lost profits or revenue, arising from your use of this site or reliance on anything published on it. Nothing in these terms limits liability that cannot lawfully be limited.</p>"
    ]],
    ["Governing law", [
      "<p>These terms are governed by the laws of the State of Georgia, United States, without regard to its conflict-of-law provisions. Disputes will be brought in the state or federal courts located in Fulton County, Georgia.</p>"
    ]],
    ["Changes to these terms", [
      "<p>We may update these terms. The date at the top of the page reflects the current version, and continued use of the site after a change means you accept it.</p>"
    ]],
    ["Contact", [
      "<p>Questions about these terms: <a href=\"mailto:" + C.EMAIL + "\" style=\"color:var(--blue)\">" + C.EMAIL + "</a></p>"
    ]]
  ]
}));

console.log("wrote contact.html, thank-you.html, privacy.html, terms.html");
