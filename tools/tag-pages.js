/* Tags editable text on the contact + legal (privacy, terms) templates with
 * data-cms attributes. Contact uses an explicit anchor list; the legal pages
 * auto-tag every heading/paragraph/list-item inside the .legal block. Only
 * attributes are added — stripping them reproduces the original.
 * Run: node tools/tag-pages.js */
const fs = require("fs");
const path = require("path");
const T = path.join(__dirname, "..", "templates");

function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function textOf(h) { return h.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim(); }

/* Explicit anchor tagging: [anchor, key, label]. */
function tagAnchors(file, anchors) {
  let html = fs.readFileSync(file, "utf8");
  anchors.forEach(function (a) {
    var anchor = a[0], key = a[1], label = a[2];
    var count = html.split(anchor).length - 1;
    if (count !== 1) { console.error("✗ anchor not unique (" + count + "x): " + key + " — " + anchor); process.exit(1); }
    html = html.replace(anchor, anchor.replace(">", ' data-cms="' + key + '" data-cms-label="' + esc(label) + '">'));
  });
  fs.writeFileSync(file, html);
  console.log("tagged " + anchors.length + " blocks in " + path.basename(file));
}

/* Auto-tag a legal page: hero eyebrow/title/date + every h2/p/li in .legal. */
function tagLegal(file) {
  let html = fs.readFileSync(file, "utf8");
  html = html.replace('<span class="eyebrow">Legal</span>', '<span class="eyebrow" data-cms="l_eyebrow" data-cms-label="Eyebrow">Legal</span>');
  html = html.replace(/<h1>([^<]+)<\/h1>/, function (m, t) { return '<h1 data-cms="l_h1" data-cms-label="Page title">' + t + "</h1>"; });
  html = html.replace(/<p class="updated">([^<]*)<\/p>/, function (m, t) { return '<p class="updated" data-cms="l_updated" data-cms-label="Last updated">' + t + "</p>"; });

  var start = html.indexOf('<div class="legal');
  var end = html.indexOf("<footer");
  var seg = html.slice(start, end);
  var hc = 0, pc = 0, lc = 0, n = 0;
  seg = seg.replace(/<(h2|p|li)>([\s\S]*?)<\/\1>/g, function (m, tag, inner) {
    var key, label;
    if (tag === "h2") { key = "h_" + (++hc); label = textOf(inner) || ("Heading " + hc); }
    else if (tag === "li") { key = "li_" + (++lc); label = "List: " + textOf(inner).slice(0, 44); }
    else { key = "p_" + (++pc); label = textOf(inner).slice(0, 54) || ("Paragraph " + pc); }
    n++;
    return "<" + tag + ' data-cms="' + key + '" data-cms-label="' + esc(label) + '">' + inner + "</" + tag + ">";
  });
  html = html.slice(0, start) + seg + html.slice(end);
  fs.writeFileSync(file, html);
  console.log("tagged " + (n + 3) + " blocks in " + path.basename(file));
}

tagAnchors(path.join(T, "contact.html"), [
  ['<span class="eyebrow">Contact</span>', "c_eyebrow", "Hero — eyebrow"],
  ["<h1>Tell us what's", "c_h1", "Hero — heading"],
  ['<p class="sub" style="max-width:52ch">Send your site', "c_sub", "Hero — subheading"],
  ['<h2 style="font-size:27px">What you\'ll get back', "c_geth2", "What you'll get — heading"],
  ["<li>A look at your actual pages", "c_li1", "What you'll get — item 1"],
  ["<li>The three things we'd fix first", "c_li2", "What you'll get — item 2"],
  ["<li>An honest read on how hard", "c_li3", "What you'll get — item 3"],
  ["<li>A straight answer on whether", "c_li4", "What you'll get — item 4"],
  ["<h4>Where we are</h4>", "c_where_h", "Contact — location title"],
  ["<p>Atlanta, Georgia — working", "c_where_p", "Contact — location text"],
  ["<h4>Response time</h4>", "c_resp_h", "Contact — response title"],
  ["<p>One business day, every time. Monday to Friday.", "c_resp_p", "Contact — response text"],
  ['<h3 style="font-family:var(--display);font-size:21px;margin-bottom:6px">Send us your site', "c_form_h", "Form — heading"],
  ['<p style="font-size:14px;color:var(--muted);margin-bottom:24px">Everything except', "c_form_p", "Form — text"],
  ['<span class="eyebrow">Before you write', "c_faq_eyebrow", "FAQ — eyebrow"],
  ["<h2>Common questions", "c_faq_h2", "FAQ — heading"],
  ['<div class="faq-a">Within one business day', "c_faq_a1", "FAQ 1 — answer"],
  ['<div class="faq-a">We walk through what we found', "c_faq_a2", "FAQ 2 — answer"],
  ['<div class="faq-a">No. Engagements run month', "c_faq_a3", "FAQ 3 — answer"],
  ['<div class="faq-a">Yes. Atlanta is where we\'re based', "c_faq_a4", "FAQ 4 — answer"],
  ['<div class="faq-a">Read access to Google Search Console', "c_faq_a5", "FAQ 5 — answer"]
]);

tagLegal(path.join(T, "privacy.html"));
tagLegal(path.join(T, "terms.html"));
