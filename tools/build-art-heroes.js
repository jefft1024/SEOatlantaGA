const fs = require("fs");
const K = require("./lib/svgkit.js");
const { C, defs, ground, panel, txt, chip, pin, bar, spline, chrome, svg } = K;
const W = 1200, H = 750;
const out = {};

/* ── 1. LOCAL SEO — street grid, pin cluster, three-pack ranking card ───── */
{
  const streets = [];
  for (let i = 1; i < 9; i++) streets.push(`<path d="M0,${i * 94} H${W}" stroke="${C.line}" stroke-width="${i % 3 === 0 ? 4 : 1.6}" opacity="${i % 3 === 0 ? .95 : .6}"/>`);
  for (let i = 1; i < 13; i++) streets.push(`<path d="M${i * 96},0 V${H}" stroke="${C.line}" stroke-width="${i % 4 === 0 ? 4 : 1.6}" opacity="${i % 4 === 0 ? .95 : .6}"/>`);
  // a diagonal "connector" road, the way Atlanta's grid actually breaks
  streets.push(`<path d="M-40,${H} L${W * .72},-40" stroke="rgba(120,168,255,.42)" stroke-width="7" opacity=".9" fill="none"/>`);
  streets.push(`<path d="M-40,${H * .34} C${W * .3},${H * .22} ${W * .55},${H * .62} ${W + 40},${H * .30}" stroke="rgba(120,168,255,.22)" stroke-width="4" fill="none"/>`);

  const ring = `<g>
    <circle cx="470" cy="392" r="252" fill="none" stroke="${C.sky}" stroke-width="1.5" opacity=".28" stroke-dasharray="7 9"/>
    <circle cx="470" cy="392" r="168" fill="none" stroke="${C.sky}" stroke-width="1.5" opacity=".38" stroke-dasharray="7 9"/>
    <circle cx="470" cy="392" r="252" fill="${C.blue}" opacity=".07"/>
  </g>`;

  const pins = [
    pin(470, 392, 1.45, C.blue, { halo: true, glow: true }),
    pin(316, 300, .78, C.sky), pin(628, 306, .78, C.sky),
    pin(360, 500, .72, C.mut), pin(596, 494, .72, C.mut), pin(470, 214, .72, C.mut)
  ].join("\n  ");

  const rows = [["1", "Peachtree Home Services", "4.9", C.mint], ["2", "Midtown Repair Co.", "4.6", C.sky], ["3", "Grant Park Plumbing", "4.4", C.mut]];
  const card = `<g transform="translate(724,206)">
    ${panel(0, 0, 404, 338, { r: 20, fill: C.panel2 })}
    ${txt(26, 44, "LOCAL PACK", { size: 12, mono: true, fill: C.sky, ls: 2.4 })}
    ${txt(26, 74, "plumber near me", { size: 21, weight: 700, fill: C.ink })}
    <path d="M26,94 H378" stroke="${C.line}"/>
    ${rows.map(([n, name, r, col], i) => {
      const y = 118 + i * 74;
      return `<g>
      ${i === 0 ? `<rect x="14" y="${y - 4}" width="376" height="62" rx="12" fill="${C.blue}" opacity=".14"/>` : ""}
      <rect x="26" y="${y + 6}" width="30" height="30" rx="9" fill="${col}" opacity="${i === 0 ? .95 : .28}"/>
      ${txt(41, y + 27, n, { size: 15, weight: 700, fill: i === 0 ? C.bg0 : C.ink, anchor: "middle", mono: true })}
      ${txt(70, y + 22, name, { size: 15, weight: 600, fill: i === 0 ? C.ink : C.sub })}
      ${txt(70, y + 44, "★ " + r + "  ·  Atlanta, GA", { size: 12.5, mono: true, fill: C.mut })}</g>`;
    }).join("\n    ")}
  </g>`;

  out["svc-local-seo"] = svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[880, 90, 340, C.blue, .30], [240, 700, 280, C.blue, .16]] })}
  <g opacity=".9">${streets.join("")}</g>
  ${ring}
  ${pins}
  ${card}
  ${chip(724, 592, "GRID RANK  ·  #1 IN 34 OF 49 POINTS", { size: 13, bg: "rgba(15,191,143,.14)", stroke: "rgba(15,191,143,.42)", fill: C.mint })}
  `, "Map of Atlanta showing a business ranking first in the local three-pack");
}

/* ── 2. AI CONTENT — brief → draft → edit pipeline ──────────────────────── */
{
  const stage = (x, label, tone, lines, badge) => `<g transform="translate(${x},206)">
    ${panel(0, 0, 268, 402, { r: 18, fill: C.panel2 })}
    ${txt(24, 40, label, { size: 12, mono: true, fill: tone, ls: 2.2 })}
    <path d="M24,56 H244" stroke="${C.line}"/>
    ${lines.map((wpc, i) => `<rect x="24" y="${78 + i * 32}" width="${Math.round(220 * wpc)}" height="10" rx="5" fill="${i < 2 ? C.sub : C.mut}" opacity="${i < 2 ? .55 : .3}"/>`).join("\n    ")}
    ${badge}
  </g>`;

  const arrow = (x) => `<g opacity=".85"><path d="M${x},407 h44" stroke="${C.sky}" stroke-width="2.5" stroke-linecap="round"/><path d="M${x + 38},400 l8,7 -8,7" fill="none" stroke="${C.sky}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>`;

  out["svc-ai-content"] = svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[960, 110, 320, C.violet, .26], [200, 660, 300, C.blue, .22]] })}
  ${txt(64, 130, "One page, three passes", { size: 34, weight: 700, fill: C.ink })}
  ${txt(64, 166, "Research and structure by machine. Accuracy and voice by a person.", { size: 16, fill: C.mut })}
  ${stage(64, "01  BRIEF", C.sky, [1, .82, .93, .6, .88, .45, .7, .5],
    `${chip(24, 344, "SERP + INTENT", { size: 11.5 })}`)}
  ${arrow(346)}
  ${stage(466, "02  DRAFT", C.violet, [1, .95, .88, .97, .8, .92, .74, .86],
    `${chip(24, 344, "MODEL DRAFT", { size: 11.5, bg: "rgba(139,123,240,.16)", stroke: "rgba(139,123,240,.45)", fill: "#B7ADF7" })}`)}
  ${arrow(748)}
  <g>
    ${stage(868, "03  HUMAN EDIT", C.mint, [1, .9, .96, .7, .9, .62, .84, .55],
      `${chip(24, 344, "FACT-CHECKED", { size: 11.5, bg: "rgba(15,191,143,.15)", stroke: "rgba(15,191,143,.45)", fill: C.mint })}`)}
    <g transform="translate(1042,214)">
      <circle r="26" fill="${C.mint}" opacity=".18"/><circle r="18" fill="${C.mint}" filter="url(#glow)"/>
      <path d="M-7,0 l5,5 l9,-10" fill="none" stroke="${C.bg0}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <g opacity=".9">
      <path d="M892,348 h96" stroke="${C.warn}" stroke-width="2.5" stroke-dasharray="3 4" opacity=".95"/>
      <path d="M892,444 h64" stroke="${C.mint}" stroke-width="2.5" opacity=".85"/>
      <path d="M892,476 h108" stroke="${C.mint}" stroke-width="2.5" opacity=".55"/>
    </g>
  </g>
  ${txt(64, 678, "Nothing publishes on a model's word alone.", { size: 15, mono: true, fill: C.sub, opacity: ".9" })}
  `, "Content pipeline: a brief, a machine draft, then a human edit and fact-check");
}

/* ── 3. TECHNICAL SEO — crawl tree + Core Web Vitals gauges ─────────────── */
{
  const nodes = [[190, 150], [190, 300], [190, 450], [190, 600], [430, 225], [430, 375], [430, 525], [640, 300], [640, 450]];
  const edges = [[0, 4], [1, 4], [2, 5], [3, 6], [4, 7], [5, 7], [5, 8], [6, 8]];
  const tree = `<g>
    ${edges.map(([a, b]) => `<path d="M${nodes[a][0]},${nodes[a][1]} C${(nodes[a][0] + nodes[b][0]) / 2},${nodes[a][1]} ${(nodes[a][0] + nodes[b][0]) / 2},${nodes[b][1]} ${nodes[b][0]},${nodes[b][1]}" fill="none" stroke="${C.line2}" stroke-width="2"/>`).join("\n    ")}
    ${nodes.map(([x, y], i) => {
      const bad = i === 3, warn = i === 6;
      const col = bad ? C.warn : warn ? C.amber : C.sky;
      return `<g><circle cx="${x}" cy="${y}" r="${i > 6 ? 20 : 15}" fill="${col}" opacity="${bad || warn ? .95 : .8}" ${bad ? 'filter="url(#glow)"' : ""}/>
      <circle cx="${x}" cy="${y}" r="${(i > 6 ? 20 : 15) + 9}" fill="none" stroke="${col}" stroke-width="1.5" opacity=".32"/></g>`;
    }).join("\n    ")}
    <g transform="translate(214,600)">${chip(0, -14, "NOINDEX", { size: 11, bg: "rgba(255,122,89,.16)", stroke: "rgba(255,122,89,.5)", fill: C.warn })}</g>
    <g transform="translate(454,525)">${chip(0, -14, "DEPTH 5", { size: 11, bg: "rgba(245,166,35,.15)", stroke: "rgba(245,166,35,.5)", fill: C.amber })}</g>
  </g>`;

  const gauge = (cx, cy, pct, label, val, col) => {
    const r = 52, circ = 2 * Math.PI * r;
    return `<g transform="translate(${cx},${cy})">
      <circle r="${r}" fill="none" stroke="rgba(255,255,255,.07)" stroke-width="11"/>
      <circle r="${r}" fill="none" stroke="${col}" stroke-width="11" stroke-linecap="round"
        stroke-dasharray="${circ}" stroke-dashoffset="${circ * (1 - pct)}" transform="rotate(-90)"/>
      ${txt(0, 4, val, { size: 22, weight: 700, fill: C.ink, anchor: "middle", mono: true })}
      ${txt(0, 24, label, { size: 11, mono: true, fill: C.mut, anchor: "middle", ls: 1.4 })}
    </g>`;
  };

  out["svc-technical-seo"] = svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[300, 90, 320, C.blue, .26], [1020, 660, 300, C.warn, .12]] })}
  ${txt(64, 92, "Crawl → render → index", { size: 30, weight: 700, fill: C.ink })}
  ${txt(64, 124, "Where the pages actually stop.", { size: 15.5, fill: C.mut })}
  ${tree}
  <g transform="translate(760,150)">
    ${panel(0, 0, 380, 244, { r: 20, fill: C.panel2 })}
    ${txt(28, 42, "CORE WEB VITALS", { size: 12, mono: true, fill: C.sky, ls: 2.2 })}
    <path d="M28,58 H352" stroke="${C.line}"/>
    ${gauge(88, 148, .82, "LCP", "1.9s", C.mint)}
    ${gauge(196, 148, .58, "INP", "212ms", C.amber)}
    ${gauge(304, 148, .93, "CLS", "0.04", C.mint)}
  </g>
  <g transform="translate(760,436)">
    ${panel(0, 0, 380, 208, { r: 20, fill: C.panel2 })}
    ${txt(28, 42, "INDEX COVERAGE", { size: 12, mono: true, fill: C.sky, ls: 2.2 })}
    ${[["Indexed", .74, C.mint], ["Crawled, not indexed", .18, C.amber], ["Excluded", .08, C.warn]].map(([l, p, col], i) => `
    ${txt(28, 76 + i * 46, l, { size: 13.5, fill: C.sub })}
    <rect x="28" y="${86 + i * 46}" width="324" height="9" rx="4.5" fill="rgba(255,255,255,.07)"/>
    <rect x="28" y="${86 + i * 46}" width="${Math.round(324 * p)}" height="9" rx="4.5" fill="${col}"/>
    ${txt(352, 76 + i * 46, Math.round(p * 100) + "%", { size: 12, mono: true, fill: col, anchor: "end" })}`).join("")}
  </g>
  `, "Site crawl tree with blocked pages, alongside Core Web Vitals and index coverage");
}

/* ── 4. AEO — AI answer panel with citations ────────────────────────────── */
{
  const cite = (x, y, host, active) => `<g transform="translate(${x},${y})">
    <rect width="188" height="52" rx="12" fill="${active ? "rgba(27,114,240,.20)" : "rgba(255,255,255,.05)"}" stroke="${active ? "rgba(77,163,255,.62)" : C.line}"/>
    <circle cx="28" cy="26" r="11" fill="${active ? C.sky : C.mut}" opacity="${active ? 1 : .55}"/>
    ${txt(48, 24, host, { size: 12.5, weight: 600, fill: active ? C.ink : C.sub, mono: true })}
    ${txt(48, 40, active ? "cited · rank 1" : "cited", { size: 10.5, mono: true, fill: active ? C.sky : C.mut })}
  </g>`;

  out["svc-answer-engine-optimization"] = svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[900, 100, 340, C.violet, .28], [230, 690, 300, C.sky, .18]] })}
  <g transform="translate(64,84)">
    ${chrome(0, 0, 1072, "ai answer  ·  “best seo agency in atlanta”")}
  </g>
  <g transform="translate(64,146)">
    ${panel(0, 0, 700, 386, { r: 20, fill: C.panel2 })}
    <g transform="translate(30,34)">
      <circle r="15" fill="url(#brand)"/>
      <path d="M-6,0 l4,5 l8,-11" fill="none" stroke="${C.ink}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" opacity=".95"/>
    </g>
    ${txt(60, 40, "AI Overview", { size: 15, weight: 700, fill: C.ink })}
    ${[.96, .88, .99, .74].map((p, i) => `<rect x="30" y="${74 + i * 26}" width="${Math.round(640 * p)}" height="11" rx="5.5" fill="${C.sub}" opacity=".42"/>`).join("\n    ")}
    <g>
      <rect x="30" y="196" width="470" height="13" rx="6.5" fill="${C.sky}" opacity=".72"/>
      <rect x="30" y="196" width="470" height="13" rx="6.5" fill="url(#sweep)"/>
      ${txt(516, 208, "◂ your passage", { size: 12.5, mono: true, fill: C.sky })}
    </g>
    ${[.9, .66].map((p, i) => `<rect x="30" y="${232 + i * 26}" width="${Math.round(640 * p)}" height="11" rx="5.5" fill="${C.sub}" opacity=".34"/>`).join("\n    ")}
    <path d="M30,300 H670" stroke="${C.line}"/>
    ${txt(30, 326, "SOURCES", { size: 11.5, mono: true, fill: C.mut, ls: 2.2 })}
    ${cite(30, 340, "seoatlantaga.com", true)}
    ${cite(238, 340, "trade-journal.org", false)}
    ${cite(446, 340, "atlanta-biz.com", false)}
  </g>
  <g transform="translate(806,146)">
    ${panel(0, 0, 330, 386, { r: 20, fill: C.panel2 })}
    ${txt(26, 42, "CRAWLER ACCESS", { size: 12, mono: true, fill: C.sky, ls: 2.2 })}
    <path d="M26,58 H304" stroke="${C.line}"/>
    ${["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended", "OAI-SearchBot"].map((b, i) => `
    <g transform="translate(26,${82 + i * 54})">
      ${txt(0, 20, b, { size: 14, mono: true, fill: C.sub })}
      <rect x="204" y="4" width="52" height="26" rx="13" fill="${C.mint}" opacity=".22"/>
      <circle cx="243" cy="17" r="10" fill="${C.mint}"/>
      ${txt(216, 22, "on", { size: 11, mono: true, fill: C.mint })}
    </g>`).join("")}
    <g transform="translate(26,352)">${chip(0, 0, "ALLOWED BY POLICY", { size: 11.5, bg: "rgba(15,191,143,.14)", stroke: "rgba(15,191,143,.42)", fill: C.mint })}</g>
  </g>
  `, "An AI-generated answer citing the site as a source, with AI crawler access enabled");
}

/* ── 5. LINK BUILDING — authority network ───────────────────────────────── */
{
  const hub = [600, 380];
  const ring1 = [[600, 168], [812, 262], [852, 470], [672, 596], [452, 592], [320, 440], [346, 246]];
  const ring2 = [[600, 62], [946, 168], [1032, 424], [1010, 620], [742, 700], [430, 704], [200, 596], [162, 320], [258, 122]];
  const edges1 = ring1.map((p, i) => `<path d="M${hub[0]},${hub[1]} L${p[0]},${p[1]}" stroke="${C.sky}" stroke-width="2.2" opacity=".55"/>`).join("");
  const edges2 = ring2.map((p, i) => {
    const near = ring1[i % ring1.length];
    return `<path d="M${near[0]},${near[1]} L${p[0]},${p[1]}" stroke="${C.line2}" stroke-width="1.4" opacity=".8"/>`;
  }).join("");
  const dots = (arr, r, col, op) => arr.map(([x, y]) => `<g><circle cx="${x}" cy="${y}" r="${r + 8}" fill="${col}" opacity=".10"/><circle cx="${x}" cy="${y}" r="${r}" fill="${col}" opacity="${op}"/></g>`).join("");

  out["svc-link-building"] = svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[600, 340, 380, C.blue, .30], [1000, 700, 260, C.mint, .12]] })}
  ${edges2}${edges1}
  ${dots(ring2, 9, C.mut, .55)}
  ${dots(ring1, 16, C.sky, .9)}
  <g>
    <circle cx="${hub[0]}" cy="${hub[1]}" r="70" fill="${C.blue}" opacity=".18"/>
    <circle cx="${hub[0]}" cy="${hub[1]}" r="46" fill="url(#brand)" filter="url(#glow)"/>
    ${txt(hub[0], hub[1] + 6, "DR", { size: 18, weight: 800, fill: C.ink, anchor: "middle", mono: true })}
  </g>
  <g transform="translate(64,64)">
    ${panel(0, 0, 286, 132, { r: 18, fill: C.panel2 })}
    ${txt(24, 38, "REFERRING DOMAINS", { size: 11.5, mono: true, fill: C.sky, ls: 2 })}
    ${txt(24, 84, "312", { size: 42, weight: 800, fill: C.ink, mono: true })}
    ${txt(122, 84, "▲ 46 this quarter", { size: 13, mono: true, fill: C.mint })}
    ${txt(24, 110, "earned · no paid placements", { size: 12, fill: C.mut })}
  </g>
  <g transform="translate(850,554)">
    ${panel(0, 0, 286, 132, { r: 18, fill: C.panel2 })}
    ${txt(24, 38, "SOURCE MIX", { size: 11.5, mono: true, fill: C.sky, ls: 2 })}
    ${[["Digital PR", .42, C.sky], ["Atlanta local", .34, C.mint], ["Reclaimed", .24, C.violet]].map(([l, p, col], i) => `
      ${txt(24, 66 + i * 26, l, { size: 12, fill: C.sub })}
      <rect x="140" y="${58 + i * 26}" width="88" height="9" rx="4.5" fill="rgba(255,255,255,.07)"/>
      <rect x="140" y="${58 + i * 26}" width="${Math.round(88 * p / .42)}" height="9" rx="4.5" fill="${col}" opacity=".9"/>
      ${txt(262, 67 + i * 26, Math.round(p * 100) + "%", { size: 11.5, mono: true, fill: C.mut, anchor: "end" })}`).join("")}
  </g>
  `, "A network of referring domains linking to a central high-authority site");
}

/* ── 6. REPORTING — dashboard ───────────────────────────────────────────── */
{
  const spark = (x, y, w, h, pts, col, fill) => {
    const P = pts.map((v, i) => [x + (w * i) / (pts.length - 1), y + h - v * h]);
    return spline(P, { stroke: col, width: 3, fill, base: y + h });
  };
  const kpi = (x, y, label, val, delta, col) => `<g transform="translate(${x},${y})">
    ${panel(0, 0, 248, 130, { r: 16, fill: C.panel2 })}
    ${txt(22, 36, label, { size: 11, mono: true, fill: C.mut, ls: 1.8 })}
    ${txt(22, 80, val, { size: 32, weight: 800, fill: C.ink, mono: true })}
    ${txt(22, 106, delta, { size: 12.5, mono: true, fill: col })}
    ${spark(150, 46, 76, 46, [.2, .35, .3, .52, .48, .7, .86], col, null)}
  </g>`;

  out["svc-seo-reporting"] = svg(W, H, `${defs()}
  ${ground(W, H, { auras: [[980, 110, 320, C.mint, .20], [220, 680, 300, C.blue, .24]] })}
  <g transform="translate(64,74)">${chrome(0, 0, 1072, "dashboard  ·  organic → leads → revenue")}</g>
  ${kpi(64, 136, "ORGANIC SESSIONS", "18,402", "▲ 34% vs. prior 90d", C.sky)}
  ${kpi(338, 136, "LEADS ATTRIBUTED", "271", "▲ 41% vs. prior 90d", C.mint)}
  ${kpi(612, 136, "CALLS TRACKED", "146", "▲ 22% vs. prior 90d", C.mint)}
  ${kpi(886, 136, "PIPELINE VALUE", "$412k", "▲ 28% vs. prior 90d", C.mint)}
  <g transform="translate(64,296)">
    ${panel(0, 0, 700, 380, { r: 20, fill: C.panel2 })}
    ${txt(28, 44, "ORGANIC SESSIONS → LEADS", { size: 12, mono: true, fill: C.sky, ls: 2.2 })}
    <path d="M28,60 H672" stroke="${C.line}"/>
    ${[0, 1, 2, 3].map(i => `<path d="M28,${112 + i * 62} H672" stroke="${C.line}" opacity=".55"/>`).join("")}
    ${spark(48, 96, 604, 244, [.12, .2, .17, .3, .28, .44, .4, .58, .66, .62, .8, .95], C.sky, "url(#riseFill)")}
    ${spark(48, 96, 604, 244, [.06, .1, .09, .15, .16, .24, .22, .3, .38, .36, .48, .6], C.mint, "url(#mintFill)")}
    <g transform="translate(28,352)">
      <circle cx="6" cy="-4" r="5" fill="${C.sky}"/>${txt(20, 0, "Sessions", { size: 12, mono: true, fill: C.sub })}
      <circle cx="116" cy="-4" r="5" fill="${C.mint}"/>${txt(130, 0, "Leads", { size: 12, mono: true, fill: C.sub })}
    </g>
  </g>
  <g transform="translate(792,296)">
    ${panel(0, 0, 344, 380, { r: 20, fill: C.panel2 })}
    ${txt(28, 44, "TOP QUERIES BY REVENUE", { size: 12, mono: true, fill: C.sky, ls: 2.2 })}
    <path d="M28,60 H316" stroke="${C.line}"/>
    ${[["emergency ac repair", .96], ["commercial cleaning", .78], ["roof replacement cost", .62], ["hvac maintenance", .48], ["water heater install", .34]].map(([q, p], i) => `
    ${txt(28, 94 + i * 58, q, { size: 13, fill: C.sub })}
    <rect x="28" y="${104 + i * 58}" width="288" height="10" rx="5" fill="rgba(255,255,255,.06)"/>
    <rect x="28" y="${104 + i * 58}" width="${Math.round(288 * p)}" height="10" rx="5" fill="url(#brand)"/>`).join("")}
  </g>
  `, "An SEO dashboard tying organic sessions through to leads, calls and pipeline value");
}

for (const [name, body] of Object.entries(out)) {
  fs.writeFileSync(`assets/img/${name}.svg`, body);
  console.log("wrote assets/img/" + name + ".svg", (body.length / 1024).toFixed(1) + "kb");
}
