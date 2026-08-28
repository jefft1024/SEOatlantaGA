# SEOAtlantaGA.com

Static marketing site for SEO Atlanta GA — dark hologram hero (canvas-rendered:
self-typing search bar, orbiting icon ring, floating UI tiles), alternating
dark/light sections, dark CTA. No build step and no dependencies; the only
server-side code is one Vercel function that receives form submissions.

## Structure
```
index.html                 homepage (hero + audit + ROI + process + FAQ, CSS/JS inline)
contact.html               contact page with the full lead form
thank-you.html             optional post-submit landing page (noindex)
privacy.html  terms.html   legal pages
404.html                   custom not-found page (noindex)

services/                  six service pages
  local-seo.html  ai-content.html  technical-seo.html
  answer-engine-optimization.html  link-building.html  seo-reporting.html

blog/
  index.html               post listing with category filters
  seo-roi-what-ranking-first-is-worth.html
  local-seo-atlanta-map-pack.html
  ai-overviews-answer-engine-optimization.html

api/lead.js                serverless endpoint that receives and forwards form submissions

assets/css/site.css        shared stylesheet for every page except the homepage
assets/js/site.js          shared behaviour: nav, reveal, tabs, FAQ, form handling
assets/js/analytics.js     analytics loader + window.track(); no-op until configured
assets/img/                19 bespoke SVG illustrations (see Imagery below)

favicon.svg  og.jpg        icon and social share image
robots.txt  sitemap.xml  llms.txt
vercel.json                clean URLs, caching, security headers, redirects
```

The homepage keeps its CSS and JS inline (it is the critical-path page). Every
other page links `assets/css/site.css` and `assets/js/site.js`. If you change a
shared style that the homepage also uses, change it in **both** places.

## Before this goes live

Three things need real values. The site works without them, but do not run
traffic at it until they are done:

1. **Phone number and address.** The placeholder `(404) 555-0137` has been
   removed from the footer and from the structured data rather than left in
   place. To restore a phone number, add `telephone` to the `ProfessionalService`
   node in `index.html`'s JSON-LD, add a `tel:` link to the footer of
   `index.html` and to `header()`/`FOOTER` output in the generated pages, and add
   it to `llms.txt`. Add a street address to the `PostalAddress` node at the same
   time — local SEO depends on a verifiable one.
2. **Testimonials and results figures.** The quotes and the before/after numbers
   on the homepage are placeholders. Replace them with real, attributable ones or
   remove the sections. Publishing invented client quotes is a legal exposure,
   not just an SEO problem.
3. **Photography.** Every image on the site is currently a vector illustration
   (see **Imagery** below). If you want real photography — the team, the office,
   actual Atlanta — that is a swap, not a rebuild. Nothing is missing or broken
   without it.

## Imagery

All 19 images are hand-authored SVG in `assets/img/`, generated to match the
site's existing palette and dark-tech visual language. Together they weigh
**256 KB raw, ~19 KB gzipped** — less than a single stock photograph — and stay
sharp at any resolution.

| File pattern | Used by | Size |
| --- | --- | --- |
| `svc-*.svg` | Service page heroes, one per service | 1200×750 |
| `card-*.svg` | Service cards in "works well alongside" | 900×300 |
| `post-*.svg` | Blog article heroes and post-card thumbnails | 1400×560 |
| `atlanta.svg` | Homepage Atlanta band, contact page hero | 1200×760 |
| `phone.svg`, `ai.svg`, `growth.svg` | Homepage gallery, in-article figures | various |

Every `<img>` carries descriptive `alt` text plus intrinsic `width`/`height`
(so nothing shifts as the page loads). Hero images use `fetchpriority="high"`;
everything below the fold is `loading="lazy" decoding="async"`.

To regenerate or restyle them, the source generators live outside this repo —
but the SVGs are plain, readable markup and can be edited directly. The shared
palette is defined once in each file's `<defs>` block and mirrors the CSS custom
properties in `assets/css/site.css`.

**Swapping in photography.** Replace any `assets/img/*.svg` reference with a
`.jpg`/`.webp` of the same aspect ratio and update the `width`/`height`
attributes to match. The frames (`.hero-art`, `.card-art`, `.post-photo`,
`.article-hero`) already crop with `object-fit: cover`, so a correctly-sized
photo drops straight in. Keep the `alt` text meaningful.

## Lead capture

Forms POST JSON to `/api/lead`. Client-side validation lives in
`assets/js/site.js`; the endpoint re-validates, rate-limits by IP, and drops
honeypot submissions.

Delivery is configured entirely through environment variables in the Vercel
dashboard (**Settings → Environment Variables**). Set whichever you use — the
handler forwards to every one that is configured:

| Variable | Purpose |
| --- | --- |
| `LEAD_WEBHOOK_URL` | Any HTTPS endpoint — Zapier, Make, Slack, n8n, a CRM |
| `RESEND_API_KEY` | Resend API key, for email delivery |
| `LEAD_TO_EMAIL` | Where lead emails land (default `hello@seoatlantaga.com`) |
| `LEAD_FROM_EMAIL` | Verified Resend sender (default `leads@seoatlantaga.com`) |

With none of them set the form still returns success and every submission is
written to the Vercel function log, so nothing is lost while you wire it up.
Configure at least one before launch.

## Analytics

Open `assets/js/analytics.js` and set `GA4_ID` to your GA4 Measurement ID (and
optionally `GTM_ID`). Until then nothing loads and no cookies are set.

`window.track(name, params)` is the single funnel for custom events and is
always safe to call. Already instrumented: `audit_run`, `lead_submit_attempt`,
`lead_submit_success`, `lead_submit_error`, `faq_open`, `blog_filter`,
`cta_click`, `scroll_depth`, `contact_email_click`, `contact_phone_click`.
Append `?debugTracking=1` to any URL to log events to the console while GA4 is
still unset.

## Deploy — GitHub + Vercel
1. Push to GitHub.
2. vercel.com → **Add New → Project** → import the repo.
3. Framework preset: **Other**. Build command and output directory: leave empty.
4. Deploy, add the custom domain under **Settings → Domains**, and set the lead
   environment variables.

If your domain is not `seoatlantaga.com`, update the absolute URLs in
`index.html`, `robots.txt`, `sitemap.xml`, `llms.txt` and — because they are
baked into every generated page's canonical, Open Graph and JSON-LD — in every
file under `services/` and `blog/`.

## Local preview

`cleanUrls` means `/contact` serves `contact.html`, which a plain static server
will not do. Any dev server that falls back to `<path>.html` works; the simplest
is:

```bash
npx serve .        # or: python3 -m http.server, then use the .html URLs
```

## Notes
- The instant audit is a **simulated preview** and is labelled as such on the
  page, in `/terms` and in `llms.txt`. It does not crawl the entered domain.
- The ROI calculator applies published industry CTR averages to user input. It
  is a model, not a projection.
- AI crawlers (GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others) are
  explicitly allowed in `robots.txt`. That is a deliberate choice — see
  `services/answer-engine-optimization.html` for the reasoning. Reverse it there
  if the business decides otherwise.
- Animations pause off-screen and respect `prefers-reduced-motion`.
- Below 620px the header's "Get free audit" button is hidden — it collided with
  the logo, and the mobile menu already carries a Free Audit link.
