/* Static generation of the 6 service pages. Content + rendering live in
 * tools/lib/services-content.js, shared with api/service-page.js so an edited
 * (Supabase-backed) page renders identically to this built one. */
const fs = require("fs");
const C = require("./lib/chrome.js");
const { SLUGS, defaultContent, renderServiceHTML } = require("./lib/services-content.js");

SLUGS.forEach((slug) => {
  const html = renderServiceHTML(defaultContent(slug), C);
  fs.writeFileSync(`services/${slug}.html`, html);
  console.log("wrote services/" + slug + ".html");
});
