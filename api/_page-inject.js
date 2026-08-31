/* Helpers for editable marketing pages built from a static template tagged with
 * data-cms="<key>" attributes. extractFields() lists the editable blocks (for
 * the dashboard); injectOverrides() swaps in edited text for the server render.
 * With no overrides, injectOverrides returns the template unchanged. */

const fs = require("fs");
const path = require("path");

/* Read a template file bundled with the function, trying a few locations so it
 * works both locally and in the Vercel runtime. */
function readTemplate(rel) {
  const candidates = [
    path.join(process.cwd(), rel),
    path.join(__dirname, "..", rel),
    path.join("/var/task", rel)
  ];
  for (const p of candidates) {
    try { return fs.readFileSync(p, "utf8"); } catch (e) { /* try next */ }
  }
  throw new Error("template not found: " + rel);
}

/* All data-cms elements → [{ key, label, html }] with current inner content. */
function extractFields(html) {
  const re = /<(\w+)([^>]*\sdata-cms="([^"]+)"[^>]*)>([\s\S]*?)<\/\1>/g;
  const out = [];
  let m;
  while ((m = re.exec(html)) !== null) {
    const attrs = m[2], key = m[3], inner = m[4];
    const lm = attrs.match(/\sdata-cms-label="([^"]*)"/);
    out.push({ key: key, label: lm ? lm[1] : key, html: inner });
  }
  return out;
}

/* Replace the inner content of each tagged element for which an override
 * exists. Values are inserted as-is (authored by a signed-in admin). */
function injectOverrides(html, overrides) {
  if (!overrides) return html;
  Object.keys(overrides).forEach(function (key) {
    const val = overrides[key];
    if (val == null) return;
    if (!/^[A-Za-z0-9_]+$/.test(key)) return;
    const re = new RegExp('(<(\\w+)[^>]*\\sdata-cms="' + key + '"[^>]*>)([\\s\\S]*?)(<\\/\\2>)');
    html = html.replace(re, function (m, open, tag, inner, close) { return open + val + close; });
  });
  return html;
}

module.exports = { readTemplate, extractFields, injectOverrides };
