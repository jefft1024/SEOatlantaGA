# SEOAtlantaGA.com

Static marketing site for SEO Atlanta GA — dark hologram hero (canvas-rendered:
self-typing search bar, orbiting icon ring, floating UI tiles), alternating
dark/light sections, dark CTA. No build step, no dependencies.

## Structure
```
index.html      main page (all CSS/JS inline)
404.html        custom not-found page
favicon.svg     site icon
og.jpg          social share image (auto-captured from the hero)
robots.txt      crawl rules
sitemap.xml     sitemap
vercel.json     clean URLs, caching + security headers
assets/img/     drop atlanta.jpg, phone.jpg, ai.jpg, growth.jpg here
```

## Deploy — GitHub + Vercel
1. Push this folder to a GitHub repo:
   ```bash
   git init
   git add .
   git commit -m "Initial site"
   git branch -M main
   git remote add origin https://github.com/YOUR-USER/seoatlantaga.git
   git push -u origin main
   ```
2. Go to vercel.com → **Add New → Project** → import the repo.
3. Framework preset: **Other**. Build command: *(leave empty)*. Output directory: *(leave empty / root)*.
4. Deploy. Add your custom domain under **Settings → Domains** and update the
   `https://seoatlantaga.com` URLs in `index.html`, `robots.txt`, `sitemap.xml`
   if your domain differs.

Or with the CLI: `npm i -g vercel && vercel --prod` from this folder.

## Notes
- Nav/footer link to `services/*.html` and `blog/*.html` pages that are not in
  this repo yet — add those files at the same paths when ready (until then they
  return the custom 404).
- Photos are optional: `assets/img/*.jpg` slots hide themselves via `onerror`
  if the files are missing.
- Animations pause off-screen and respect `prefers-reduced-motion`.
