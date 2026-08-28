const fs = require("fs");
const K = require("./lib/svgkit.js");
const { C, defs, ground, txt, pin, spline, svg } = K;
const W = 900, H = 300;                     // 3:1, readable at 130px tall

const wrap = (motif, _label, title) =>
  svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[700, 40, 190, C.blue, .34], [140, 290, 170, C.sky, .18]] })}
  ${motif}`, title);

const out = {};

/* Local SEO — three pins, one winning */
out["card-local-seo"] = wrap(`
  <g opacity=".5">${[1, 2, 3].map(i => `<path d="M0,${58 * i + 20} H${W}" stroke="${C.line}" stroke-width="1.4"/>`).join("")}
  ${[1, 2, 3, 4, 5].map(i => `<path d="M${150 * i},0 V${H}" stroke="${C.line}" stroke-width="1.4"/>`).join("")}</g>
  <circle cx="452" cy="118" r="104" fill="${C.blue}" opacity=".12"/>
  <circle cx="452" cy="118" r="104" fill="none" stroke="${C.sky}" stroke-width="1.5" opacity=".38" stroke-dasharray="6 8"/>
  ${pin(452, 138, 1.7, C.blue, { halo: true, glow: true })}
  ${pin(322, 92, .9, C.sky)}${pin(590, 96, .9, C.sky)}`,
  "LOCAL SEO", "Map pins around a winning location");

/* AI content — three stacked documents */
out["card-ai-content"] = wrap(`
  ${[0, 1, 2].map(i => `<g transform="translate(${232 + i * 156},46)">
    <rect width="130" height="168" rx="14" fill="${C.panel}" stroke="${C.line2}"/>
    ${[0, 1, 2, 3, 4].map(j => `<rect x="16" y="${22 + j * 22}" width="${98 - (j % 3) * 22}" height="8" rx="4" fill="${C.sub}" opacity="${i === 2 ? .5 : .3}"/>`).join("")}
    ${i === 2 ? `<circle cx="112" cy="18" r="14" fill="${C.mint}" filter="url(#glow)"/><path d="M106,18 l4,4 l7,-8" fill="none" stroke="${C.bg0}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` : ""}
  </g>`).join("")}
  ${[0, 1].map(i => `<path d="M${376 + i * 156},130 h26" stroke="${C.sky}" stroke-width="2.5" stroke-linecap="round"/>`).join("")}`,
  "AI CONTENT", "Three document drafts refined in sequence");

/* Technical SEO — crawl tree */
out["card-technical-seo"] = wrap(`
  ${[[300, 70], [300, 150], [300, 230], [456, 110], [456, 200], [604, 155]].map((p, i) => "").join("")}
  <g>
    ${[[300, 70, 456, 110], [300, 150, 456, 110], [300, 230, 456, 200], [456, 110, 604, 155], [456, 200, 604, 155]].map(([x1, y1, x2, y2]) =>
      `<path d="M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}" fill="none" stroke="${C.line2}" stroke-width="2.5"/>`).join("")}
    ${[[300, 70, C.sky, 15], [300, 150, C.sky, 15], [300, 230, C.warn, 15], [456, 110, C.sky, 18], [456, 200, C.amber, 18], [604, 155, "url(#brand)", 26]].map(([x, y, col, r]) =>
      `<circle cx="${x}" cy="${y}" r="${r}" fill="${col}"/><circle cx="${x}" cy="${y}" r="${r + 9}" fill="none" stroke="${col === "url(#brand)" ? C.sky : col}" opacity=".3"/>`).join("")}
  </g>`,
  "TECHNICAL SEO", "A crawl tree with a blocked branch");

/* AEO — answer panel with a cited chip */
out["card-answer-engine-optimization"] = wrap(`
  <g transform="translate(250,44)">
    <rect width="400" height="180" rx="18" fill="${C.panel}" stroke="${C.line2}"/>
    <circle cx="34" cy="34" r="15" fill="url(#brand)"/>
    <path d="M28,34 l4,5 l8,-11" fill="none" stroke="${C.ink}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${[.86, .74].map((p, i) => `<rect x="62" y="${26 + i * 20}" width="${Math.round(310 * p)}" height="9" rx="4.5" fill="${C.sub}" opacity=".35"/>`).join("")}
    <rect x="26" y="88" width="250" height="12" rx="6" fill="${C.sky}" opacity=".75"/>
    <rect x="26" y="88" width="250" height="12" rx="6" fill="url(#sweep)"/>
    <rect x="26" y="120" width="180" height="9" rx="4.5" fill="${C.sub}" opacity=".28"/>
    <g transform="translate(26,142)"><rect width="176" height="26" rx="13" fill="rgba(27,114,240,.24)" stroke="rgba(77,163,255,.6)"/>
    <circle cx="18" cy="13" r="7" fill="${C.sky}"/>${txt(32, 18, "seoatlantaga.com", { size: 11, mono: true, fill: C.ink })}</g>
  </g>`,
  "ANSWER ENGINE OPTIMIZATION", "An AI answer citing the site");

/* Link building — hub and spokes */
out["card-link-building"] = wrap(`
  ${[[300, 70], [610, 74], [252, 196], [658, 190], [452, 32], [452, 236]].map(([x, y]) =>
    `<path d="M452,134 L${x},${y}" stroke="${C.sky}" stroke-width="2" opacity=".5"/>`).join("")}
  ${[[300, 70], [610, 74], [252, 196], [658, 190], [452, 32], [452, 236]].map(([x, y]) =>
    `<circle cx="${x}" cy="${y}" r="22" fill="${C.sky}" opacity=".12"/><circle cx="${x}" cy="${y}" r="13" fill="${C.sky}" opacity=".85"/>`).join("")}
  <circle cx="452" cy="134" r="56" fill="${C.blue}" opacity=".18"/>
  <circle cx="452" cy="134" r="36" fill="url(#brand)" filter="url(#glow)"/>
  ${txt(452, 141, "DR", { size: 16, weight: 800, mono: true, fill: C.ink, anchor: "middle" })}`,
  "LINK BUILDING", "A hub linked by referring domains");

/* Reporting — chart plus KPI */
out["card-seo-reporting"] = wrap(`
  <g transform="translate(250,42)">
    <rect width="400" height="184" rx="18" fill="${C.panel}" stroke="${C.line2}"/>
    ${[0, 1, 2].map(i => `<path d="M22,${58 + i * 40} H378" stroke="${C.line}" opacity=".6"/>`).join("")}
    ${spline([[36, 150], [104, 132], [172, 138], [240, 104], [308, 86], [366, 46]], { stroke: C.sky, width: 4, fill: "url(#riseFill)", base: 168, glow: true })}
    ${spline([[36, 162], [104, 154], [172, 156], [240, 138], [308, 128], [366, 102]], { stroke: C.mint, width: 3.4, fill: "url(#mintFill)", base: 168 })}
  </g>
  <g transform="translate(676,96)">
    <rect width="0" height="0"/>
  </g>
  ${txt(668, 116, "▲ 34%", { size: 22, weight: 800, mono: true, fill: C.mint })}
  ${txt(668, 140, "sessions → leads", { size: 12, fill: C.mut })}`,
  "REPORTING & ANALYTICS", "A rising sessions-to-leads chart");

for (const [n, b] of Object.entries(out)) {
  fs.writeFileSync(`assets/img/${n}.svg`, b);
  console.log("wrote assets/img/" + n + ".svg", (b.length / 1024).toFixed(1) + "kb");
}
