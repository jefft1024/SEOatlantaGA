const fs = require("fs");
const K = require("./lib/svgkit.js");
const { C, defs, ground, panel, txt, chip, pin, bar, spline, chrome, svg } = K;
const out = {};

/* ══ ARTICLE HEROES — wide 21:9-ish banners ═════════════════════════════ */
const AW = 1400, AH = 560;

/* 1. SEO ROI — click-through curve by position, into revenue */
{
  const pos = [32, 16, 10, 7, 5, 3, 3, 3, 3, 3];
  const bx = 96, by = 452, bw = 58, gap = 20;
  const bars = pos.map((v, i) => {
    const h = v * 7.2, x = bx + i * (bw + gap), y = by - h;
    const col = i === 0 ? C.mint : i < 3 ? C.sky : C.mut;
    return `<g>${bar(x, y, bw, h, i === 0 ? "url(#brand)" : col, { opacity: i === 0 ? 1 : i < 3 ? .85 : .38, r: 6 })}
    ${txt(x + bw / 2, y - 14, v + "%", { size: 13, mono: true, fill: col, anchor: "middle", weight: 600 })}
    ${txt(x + bw / 2, by + 26, "#" + (i + 1), { size: 12.5, mono: true, fill: i < 3 ? C.sub : C.mut, anchor: "middle" })}</g>`;
  }).join("\n  ");
  const curve = spline(pos.map((v, i) => [bx + i * (bw + gap) + bw / 2, by - v * 7.2]), { stroke: C.sky, width: 2.5, glow: true });

  out["post-seo-roi"] = svg(AW, AH, `${defs()}
  ${ground(AW, AH, { auras: [[1180, 70, 320, C.blue, .30], [180, 540, 280, C.mint, .14]] })}
  ${txt(96, 92, "Click share by position", { size: 30, weight: 700, fill: C.ink })}
  ${txt(96, 124, "The gap between #1 and #8 is the whole business case.", { size: 15.5, fill: C.mut })}
  ${bars}
  ${curve}
  <path d="M${bx - 16},${by + 1} H${bx + 10 * (bw + gap)}" stroke="${C.line2}" stroke-width="1.5"/>
  <g transform="translate(940,150)">
    ${panel(0, 0, 364, 290, { r: 20, fill: C.panel2 })}
    ${txt(28, 44, "THE MULTIPLICATION", { size: 11.5, mono: true, fill: C.sky, ls: 2.2 })}
    <path d="M28,60 H336" stroke="${C.line}"/>
    ${[["Monthly searches", "1,200"], ["CTR delta  #8 → #3", "+7 pts"], ["Extra visits", "84"], ["Conversion rate", "4%"], ["Leads", "3.4"], ["Close rate", "25%"]].map(([k, v], i) => `
    ${txt(28, 94 + i * 30, k, { size: 13.5, fill: C.sub })}
    ${txt(336, 94 + i * 30, v, { size: 13.5, mono: true, fill: C.ink, anchor: "end", weight: 600 })}`).join("")}
    <path d="M28,278 H336" stroke="${C.line}"/>
  </g>
  <g transform="translate(940,462)">
    <rect width="364" height="62" rx="16" fill="url(#brand)"/>
    ${txt(24, 39, "= $2,890 / mo gross profit", { size: 19, weight: 800, fill: "#fff", mono: true })}
  </g>
  `, "Bar chart of click-through rate by search position, and the arithmetic turning it into monthly gross profit");
}

/* 2. MAP PACK — grid heat map of local rank */
{
  const cols = 9, rows = 6, cell = 62, gx = 96, gy = 150;
  const cells = []; let top3 = 0, total = 0;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const dx = c - 3.2, dy = r - 2.6, d = Math.sqrt(dx * dx + dy * dy);
    const rank = Math.min(20, Math.max(1, Math.round(d * 1.32 + 0.6)));
    total++; if (rank <= 3) top3++;
    const col = rank <= 3 ? C.mint : rank <= 8 ? C.sky : rank <= 11 ? C.amber : C.warn;
    const op = rank <= 3 ? .94 : rank <= 8 ? .55 : rank <= 11 ? .34 : .28;
    cells.push(`<g><rect x="${gx + c * cell}" y="${gy + r * cell}" width="${cell - 8}" height="${cell - 8}" rx="12" fill="${col}" opacity="${op}"/>
    ${txt(gx + c * cell + (cell - 8) / 2, gy + r * cell + (cell - 8) / 2 + 5, String(rank), { size: 14, mono: true, weight: 700, fill: rank <= 3 ? C.bg0 : C.ink, anchor: "middle", opacity: rank <= 3 ? "1" : ".9" })}</g>`);
  }
  out["post-map-pack"] = svg(AW, AH, `${defs()}
  ${ground(AW, AH, { auras: [[300, 60, 300, C.mint, .18], [1200, 520, 300, C.blue, .26]] })}
  ${txt(96, 92, "Rank changes street by street", { size: 30, weight: 700, fill: C.ink })}
  ${txt(96, 124, "One number for “Atlanta” hides where your visibility stops.", { size: 15.5, fill: C.mut })}
  ${cells.join("\n  ")}
  ${pin(gx + 3.2 * cell + 27, gy + 2.6 * cell + 8, 1.5, C.blue, { halo: true, glow: true })}
  <g transform="translate(760,180)">
    ${panel(0, 0, 300, 240, { r: 20, fill: C.panel2 })}
    ${txt(26, 42, "GRID LEGEND", { size: 11.5, mono: true, fill: C.sky, ls: 2.2 })}
    <path d="M26,58 H274" stroke="${C.line}"/>
    ${[["Top 3 — in the pack", C.mint], ["4–8 — page one", C.sky], ["9–11 — slipping", C.amber], ["12+ — invisible", C.warn]].map(([l, col], i) => `
    <rect x="26" y="${80 + i * 38}" width="22" height="22" rx="7" fill="${col}" opacity=".9"/>
    ${txt(60, 97 + i * 38, l, { size: 13.5, fill: C.sub })}`).join("")}
  </g>
  <g transform="translate(1092,180)">
    ${panel(0, 0, 212, 240, { r: 20, fill: C.panel2 })}
    ${txt(26, 42, "COVERAGE", { size: 11.5, mono: true, fill: C.sky, ls: 2.2 })}
    ${txt(26, 108, String(top3), { size: 52, weight: 800, fill: C.mint, mono: true })}
    ${txt(26, 136, "of " + total + " grid points", { size: 13, fill: C.mut })}
    ${txt(26, 178, "in the top 3", { size: 14, fill: C.sub })}
    <rect x="26" y="196" width="160" height="10" rx="5" fill="rgba(255,255,255,.07)"/>
    <rect x="26" y="196" width="${Math.round(160 * top3 / total)}" height="10" rx="5" fill="${C.mint}"/>
  </g>
  `, "A geographic grid heat map showing local search rank varying across Atlanta neighbourhoods");
}

/* 3. AI OVERVIEWS — SERP with generated answer above the links */
{
  out["post-ai-overviews"] = svg(AW, AH, `${defs()}
  ${ground(AW, AH, { auras: [[1160, 70, 330, C.violet, .28], [220, 520, 280, C.sky, .18]] })}
  ${txt(96, 92, "The answer is written before the list", { size: 30, weight: 700, fill: C.ink })}
  ${txt(96, 124, "Being cited beats being tenth.", { size: 15.5, fill: C.mut })}
  <g transform="translate(96,160)">
    ${panel(0, 0, 720, 336, { r: 20, fill: C.panel2 })}
    <g transform="translate(28,32)"><circle r="14" fill="url(#brand)"/>
      <path d="M-6,0 l4,5 l8,-11" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></g>
    ${txt(56, 38, "AI Overview", { size: 15, weight: 700, fill: C.ink })}
    ${chip(614, 20, "GENERATED", { size: 10.5, bg: "rgba(139,123,240,.16)", stroke: "rgba(139,123,240,.45)", fill: "#B7ADF7" })}
    ${[.97, .9, .84].map((p, i) => `<rect x="28" y="${70 + i * 24}" width="${Math.round(660 * p)}" height="10" rx="5" fill="${C.sub}" opacity=".40"/>`).join("\n    ")}
    <rect x="28" y="142" width="480" height="12" rx="6" fill="${C.sky}" opacity=".7"/>
    <rect x="28" y="142" width="480" height="12" rx="6" fill="url(#sweep)"/>
    ${txt(524, 153, "◂ retrieved passage", { size: 12, mono: true, fill: C.sky })}
    ${[.88, .62].map((p, i) => `<rect x="28" y="${172 + i * 24}" width="${Math.round(660 * p)}" height="10" rx="5" fill="${C.sub}" opacity=".32"/>`).join("\n    ")}
    <path d="M28,234 H692" stroke="${C.line}"/>
    ${txt(28, 260, "SOURCES", { size: 11, mono: true, fill: C.mut, ls: 2.2 })}
    ${["seoatlantaga.com", "trade-journal.org", "community.forum"].map((h, i) => `
    <g transform="translate(${28 + i * 226},276)">
      <rect width="210" height="42" rx="11" fill="${i === 0 ? "rgba(27,114,240,.22)" : "rgba(255,255,255,.05)"}" stroke="${i === 0 ? "rgba(77,163,255,.6)" : C.line}"/>
      <circle cx="24" cy="21" r="9" fill="${i === 0 ? C.sky : C.mut}" opacity="${i === 0 ? 1 : .5}"/>
      ${txt(42, 26, h, { size: 12, mono: true, fill: i === 0 ? C.ink : C.mut })}
    </g>`).join("")}
  </g>
  <g transform="translate(856,160)" opacity=".72">
    ${txt(0, 18, "ORGANIC RESULTS BEGIN HERE", { size: 11, mono: true, fill: C.mut, ls: 2 })}
    ${[0, 1, 2, 3].map(i => `<g transform="translate(0,${40 + i * 76})">
      <rect width="${430 - i * 12}" height="11" rx="5.5" fill="${C.sky}" opacity="${.5 - i * .08}"/>
      <rect y="24" width="${390 - i * 22}" height="9" rx="4.5" fill="${C.sub}" opacity="${.26 - i * .04}"/>
      <rect y="41" width="${330 - i * 26}" height="9" rx="4.5" fill="${C.sub}" opacity="${.20 - i * .03}"/>
    </g>`).join("")}
    <path d="M-24,20 V${40 + 4 * 76}" stroke="${C.line2}" stroke-dasharray="4 6"/>
  </g>
  `, "A search results page where a generated AI answer with citations sits above the organic links");
}

/* ══ HOMEPAGE PHOTO SLOTS ═══════════════════════════════════════════════ */

/* atlanta — skyline */
{
  const W = 1200, H = 760;
  const towers = [
    [70, 470, 92, 1], [176, 372, 76, 2], [264, 520, 66, 0], [340, 300, 104, 3],
    [456, 418, 70, 1], [538, 214, 118, 4], [668, 356, 84, 2], [764, 470, 62, 0],
    [838, 268, 96, 3], [946, 404, 74, 1], [1032, 336, 88, 2], [1132, 486, 58, 0]
  ];
  const roof = (x, y, w, kind) => {
    if (kind === 4) return `<path d="M${x},${y} l${w / 2},-84 l${w / 2},84 Z" fill="#0B1F44"/><path d="M${x + w / 2},${y - 84} v-46" stroke="${C.sky}" stroke-width="3"/><circle cx="${x + w / 2}" cy="${y - 134}" r="6" fill="${C.warn}" opacity=".95"/>`;
    if (kind === 3) return `<path d="M${x + 8},${y} l${w / 2 - 8},-52 l${w / 2 - 8},52 Z" fill="#0B1F44"/><circle cx="${x + w / 2}" cy="${y - 62}" r="5" fill="${C.warn}" opacity=".9"/>`;
    if (kind === 2) return `<rect x="${x + w * .22}" y="${y - 30}" width="${w * .56}" height="30" fill="#0B1F44"/>`;
    if (kind === 1) return `<rect x="${x + w * .34}" y="${y - 18}" width="${w * .32}" height="18" fill="#0B1F44"/>`;
    return "";
  };
  const win = (x, y, w, h) => {
    let s = "";
    for (let cy = y + 18; cy < H - 40; cy += 22)
      for (let cx = x + 9; cx < x + w - 9; cx += 15) {
        const lit = ((cx * 7 + cy * 13) % 11) < 4;
        s += `<rect x="${cx}" y="${cy}" width="7" height="10" fill="${lit ? C.amber : C.sky}" opacity="${lit ? .55 : .12}"/>`;
      }
    return s;
  };
  out["atlanta"] = svg(W, H, `${defs()}
  <rect width="${W}" height="${H}" fill="url(#sky)"/>
  <circle cx="880" cy="150" r="300" fill="${C.blue}" opacity=".30" filter="url(#soft)"/>
  <circle cx="300" cy="230" r="230" fill="${C.violet}" opacity=".18" filter="url(#soft)"/>
  <g opacity=".5">${[...Array(46)].map((_, i) => `<circle cx="${(i * 137) % W}" cy="${(i * 71) % 260}" r="${1 + (i % 3) * .6}" fill="#fff" opacity="${.25 + (i % 4) * .12}"/>`).join("")}</g>
  <g>${towers.map(([x, y, w, k]) => `<g>${roof(x, y, w, k)}<rect x="${x}" y="${y}" width="${w}" height="${H - y}" fill="#0B1F44"/><rect x="${x}" y="${y}" width="${w}" height="${H - y}" fill="none" stroke="${C.line2}" stroke-width="1"/>${win(x, y, w, H - y)}</g>`).join("\n  ")}</g>
  <rect y="${H - 46}" width="${W}" height="46" fill="${C.bg0}" opacity=".9"/>
  <path d="M0,${H - 46} H${W}" stroke="${C.sky}" stroke-width="1.5" opacity=".45"/>
  ${txt(48, H - 16, "ATLANTA · GEORGIA", { size: 14, mono: true, fill: C.sky, ls: 4 })}
  `, "Stylised Atlanta skyline at night");
}

/* phone — mobile map pack */
{
  const W = 760, H = 900;
  out["phone"] = svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[560, 90, 280, C.blue, .30], [160, 800, 240, C.mint, .14]] })}
  <g transform="translate(190,74)">
    <rect width="380" height="752" rx="46" fill="#050C22" stroke="${C.line2}" stroke-width="2"/>
    <rect x="10" y="10" width="360" height="732" rx="38" fill="url(#sky)"/>
    <rect x="150" y="18" width="80" height="20" rx="10" fill="#050C22"/>
    <g transform="translate(28,64)">
      <rect width="324" height="46" rx="23" fill="rgba(255,255,255,.07)" stroke="${C.line2}"/>
      <circle cx="30" cy="23" r="8" fill="none" stroke="${C.sky}" stroke-width="2.5"/><path d="M36,29 l7,7" stroke="${C.sky}" stroke-width="2.5" stroke-linecap="round"/>
      ${txt(54, 29, "plumber near me", { size: 14.5, fill: C.sub, mono: true })}
    </g>
    <g transform="translate(28,132)">
      <rect width="324" height="196" rx="18" fill="#08142F" stroke="${C.line}"/>
      ${[...Array(5)].map((_, i) => `<path d="M0,${34 + i * 38} H324" stroke="${C.line}" opacity=".7"/>`).join("")}
      ${[...Array(4)].map((_, i) => `<path d="M${64 + i * 66},0 V196" stroke="${C.line}" opacity=".7"/>`).join("")}
      <path d="M-4,170 L200,-4" stroke="rgba(120,168,255,.32)" stroke-width="5"/>
      ${pin(162, 112, 1.15, C.blue, { halo: true, glow: true })}
      ${pin(84, 62, .6, C.sky)}${pin(252, 74, .6, C.sky)}
    </g>
    ${[["Peachtree Home Services", "4.9 ★ · Open now", C.mint, 1], ["Midtown Repair Co.", "4.6 ★ · Closes 6pm", C.sky, 0], ["Grant Park Plumbing", "4.4 ★ · Open now", C.mut, 0]].map(([n, s, col, hot], i) => `
    <g transform="translate(28,${350 + i * 104})">
      <rect width="324" height="88" rx="16" fill="${hot ? "rgba(27,114,240,.18)" : "rgba(255,255,255,.045)"}" stroke="${hot ? "rgba(77,163,255,.55)" : C.line}"/>
      <rect x="16" y="16" width="34" height="34" rx="10" fill="${col}" opacity="${hot ? .95 : .3}"/>
      ${txt(33, 39, String(i + 1), { size: 15, weight: 700, mono: true, anchor: "middle", fill: hot ? C.bg0 : C.ink })}
      ${txt(64, 34, n, { size: 14.5, weight: 600, fill: hot ? C.ink : C.sub })}
      ${txt(64, 56, s, { size: 12, mono: true, fill: C.mut })}
      <rect x="64" y="66" width="76" height="14" rx="7" fill="${C.mint}" opacity=".18"/>
      ${txt(72, 77, "Call", { size: 10.5, mono: true, fill: C.mint })}
    </g>`).join("")}
  </g>
  `, "A phone showing the local three-pack for a “plumber near me” search");
}

/* ai — neural / answer engine panel */
{
  const W = 1000, H = 760;
  const L = [[130, 190], [130, 330], [130, 470], [130, 610]];
  const M = [[400, 150], [400, 290], [400, 430], [400, 570], [400, 690]];
  const R = [[680, 260], [680, 400], [680, 540]];
  const link = (a, b, o) => `<path d="M${a[0]},${a[1]} C${(a[0] + b[0]) / 2},${a[1]} ${(a[0] + b[0]) / 2},${b[1]} ${b[0]},${b[1]}" fill="none" stroke="${C.sky}" stroke-width="1.4" opacity="${o}"/>`;
  let edges = "";
  L.forEach((a) => M.forEach((b) => { edges += link(a, b, .16); }));
  M.forEach((a) => R.forEach((b) => { edges += link(a, b, .2); }));
  const dot = (p, r, col, glow) => `<circle cx="${p[0]}" cy="${p[1]}" r="${r}" fill="${col}" ${glow ? 'filter="url(#glow)"' : ""}/><circle cx="${p[0]}" cy="${p[1]}" r="${r + 10}" fill="none" stroke="${col}" opacity=".3"/>`;
  out["ai"] = svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[760, 110, 300, C.violet, .26], [180, 660, 260, C.blue, .24]] })}
  ${edges}
  ${L.map((p) => dot(p, 13, C.mut)).join("")}
  ${M.map((p) => dot(p, 16, C.sky)).join("")}
  ${R.map((p, i) => dot(p, i === 1 ? 24 : 17, i === 1 ? "url(#brand)" : C.sky, i === 1)).join("")}
  ${txt(130, 96, "SIGNALS", { size: 11.5, mono: true, fill: C.mut, ls: 2.4, anchor: "middle" })}
  ${txt(400, 96, "MODEL", { size: 11.5, mono: true, fill: C.sky, ls: 2.4, anchor: "middle" })}
  ${txt(680, 96, "ANSWER", { size: 11.5, mono: true, fill: C.sky, ls: 2.4, anchor: "middle" })}
  <g transform="translate(742,368)">${chip(0, 0, "YOU, CITED", { size: 12, bg: "rgba(15,191,143,.16)", stroke: "rgba(15,191,143,.5)", fill: C.mint })}</g>
  `, "A neural network diagram resolving signals into an AI answer that cites the site");
}

/* growth — compounding traffic chart */
{
  const W = 1000, H = 700;
  const pts = [.06, .09, .08, .14, .18, .16, .26, .34, .32, .48, .62, .58, .76, .92];
  const P = pts.map((v, i) => [90 + (820 * i) / (pts.length - 1), 600 - v * 470]);
  out["growth"] = svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[820, 120, 300, C.mint, .20], [180, 620, 260, C.blue, .26]] })}
  ${[0, 1, 2, 3, 4].map(i => `<path d="M90,${600 - i * 118} H910" stroke="${C.line}" opacity=".7"/>`).join("")}
  ${spline(P, { stroke: C.mint, width: 4, fill: "url(#mintFill)", base: 600, glow: true })}
  <path d="M90,600 H910" stroke="${C.line2}" stroke-width="1.5"/>
  ${P.filter((_, i) => i % 3 === 0 || i === P.length - 1).map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6" fill="${C.bg0}" stroke="${C.mint}" stroke-width="3"/>`).join("")}
  <g transform="translate(${P[P.length - 1][0] - 244},${P[P.length - 1][1] - 96})">
    ${panel(0, 0, 226, 78, { r: 16, fill: C.panel2 })}
    ${txt(20, 34, "+218%", { size: 26, weight: 800, fill: C.mint, mono: true })}
    ${txt(20, 58, "organic sessions · 12 mo", { size: 12, fill: C.mut })}
  </g>
  ${txt(90, 92, "Compounding, not spiking", { size: 26, weight: 700, fill: C.ink })}
  ${txt(90, 122, "Months 1–4 look flat. That is the work landing.", { size: 15, fill: C.mut })}
  ${["M1", "M4", "M7", "M10", "M12"].map((m, i) => txt(90 + i * 205, 636, m, { size: 12.5, mono: true, fill: C.mut, anchor: "middle" })).join("")}
  `, "A line chart of organic sessions compounding over twelve months");
}

for (const [name, body] of Object.entries(out)) {
  fs.writeFileSync(`assets/img/${name}.svg`, body);
  console.log("wrote assets/img/" + name + ".svg", (body.length / 1024).toFixed(1) + "kb");
}
