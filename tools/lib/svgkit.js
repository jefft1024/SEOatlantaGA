/* Shared primitives so every illustration reads as one system.
   Palette is lifted straight from the site's CSS custom properties. */
const C = {
  navy: "#0E2A5C", blue: "#1B72F0", sky: "#4DA3FF", mint: "#0FBF8F",
  warn: "#FF7A59", amber: "#F5A623", violet: "#8B7BF0",
  ink: "#EAF2FF", sub: "#AEC2E8", mut: "#7E93C4",
  bg0: "#04081A", bg1: "#081431", bg2: "#0E2450",
  line: "rgba(120,168,255,.16)", line2: "rgba(120,168,255,.30)",
  panel: "rgba(10,27,66,.72)", panel2: "rgba(12,32,74,.92)"
};

const MONO = "ui-monospace, 'SF Mono', Menlo, Consolas, monospace";
const SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Gradients and filters every illustration can reference. */
function defs(extra = "") {
  return `<defs>
  <radialGradient id="sky" cx="72%" cy="4%" r="112%">
    <stop offset="0%" stop-color="${C.bg2}"/><stop offset="46%" stop-color="${C.bg1}"/><stop offset="100%" stop-color="${C.bg0}"/>
  </radialGradient>
  <linearGradient id="brand" x1="0" y1="0" x2="1" y2="1">
    <stop offset="0%" stop-color="${C.navy}"/><stop offset="55%" stop-color="${C.blue}"/><stop offset="100%" stop-color="${C.sky}"/>
  </linearGradient>
  <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="rgba(255,255,255,.10)"/><stop offset="100%" stop-color="rgba(255,255,255,.03)"/>
  </linearGradient>
  <linearGradient id="riseFill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${C.blue}" stop-opacity=".42"/><stop offset="100%" stop-color="${C.blue}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="mintFill" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%" stop-color="${C.mint}" stop-opacity=".40"/><stop offset="100%" stop-color="${C.mint}" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="sweep" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%" stop-color="${C.sky}" stop-opacity="0"/><stop offset="50%" stop-color="${C.sky}" stop-opacity=".55"/><stop offset="100%" stop-color="${C.sky}" stop-opacity="0"/>
  </linearGradient>
  <pattern id="mesh" width="56" height="56" patternUnits="userSpaceOnUse">
    <path d="M56 0H0v56" fill="none" stroke="${C.line}" stroke-width="1"/>
  </pattern>
  <filter id="soft" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="26"/>
  </filter>
  <filter id="glow" x="-70%" y="-70%" width="240%" height="240%">
    <feGaussianBlur stdDeviation="7" result="b"/>
    <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
  </filter>
  ${extra}
</defs>`;
}

/* Dark ground: gradient, mesh, two drifting auras, vignette. */
function ground(w, h, opts = {}) {
  const a = opts.auras || [[w * 0.82, h * 0.06, 330, C.blue, 0.34], [w * 0.12, h * 0.96, 300, C.sky, 0.20]];
  return `<rect width="${w}" height="${h}" fill="url(#sky)"/>
  ${a.map(([cx, cy, r, col, o]) => `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${col}" opacity="${o}" filter="url(#soft)"/>`).join("\n  ")}
  <rect width="${w}" height="${h}" fill="url(#mesh)" opacity=".85"/>
  <rect width="${w}" height="${h}" fill="none" stroke="${C.line2}" stroke-width="1"/>`;
}

/* Glass panel. */
function panel(x, y, w, h, o = {}) {
  const r = o.r ?? 16;
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${o.fill || C.panel}" stroke="${o.stroke || C.line2}" stroke-width="1"/>
    ${o.sheen === false ? "" : `<rect x="${x}" y="${y}" width="${w}" height="${Math.min(h, 44)}" rx="${r}" fill="url(#glass)"/>`}
  </g>`;
}

function txt(x, y, s, o = {}) {
  const anchor = o.anchor ? ` text-anchor="${o.anchor}"` : "";
  const ls = o.ls ? ` letter-spacing="${o.ls}"` : "";
  const op = o.opacity ? ` opacity="${o.opacity}"` : "";
  return `<text x="${x}" y="${y}" font-family="${o.mono ? MONO : SANS}" font-size="${o.size || 16}" font-weight="${o.weight || 500}" fill="${o.fill || C.sub}"${anchor}${ls}${op}>${esc(s)}</text>`;
}

/* Small pill label. */
function chip(x, y, label, o = {}) {
  const pad = o.pad ?? 11, size = o.size || 13;
  const w = o.w ?? Math.round(label.length * size * 0.60 + pad * 2), h = o.h ?? 28;
  return `<g><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="${o.bg || "rgba(77,163,255,.16)"}" stroke="${o.stroke || "rgba(77,163,255,.42)"}"/>
  ${txt(x + w / 2, y + h / 2 + size * 0.36, label, { size, mono: o.mono !== false, fill: o.fill || C.sky, anchor: "middle", weight: 500 })}</g>`;
}

/* Map pin. */
function pin(cx, cy, s = 1, col = C.blue, o = {}) {
  const d = `M0,-${22 * s} a${13 * s},${13 * s} 0 1,1 -0.01,0 M0,${2 * s} L-${8 * s},-${9 * s} L${8 * s},-${9 * s} Z`;
  return `<g transform="translate(${cx},${cy})">
    ${o.halo ? `<circle r="${34 * s}" fill="${col}" opacity=".18"/><circle r="${22 * s}" fill="${col}" opacity=".16"/>` : ""}
    <path d="M0,${4 * s} C0,${4 * s} ${17 * s},${-12 * s} ${17 * s},${-24 * s} A${17 * s},${17 * s} 0 1,0 ${-17 * s},${-24 * s} C${-17 * s},${-12 * s} 0,${4 * s} 0,${4 * s} Z" fill="${col}" ${o.glow ? 'filter="url(#glow)"' : ""}/>
    <circle cy="${-24 * s}" r="${6.5 * s}" fill="${C.bg0}" opacity=".85"/>
  </g>`;
}

/* Bar in a chart. */
function bar(x, y, w, h, col, o = {}) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.r ?? 4}" fill="${col}" opacity="${o.opacity ?? 1}"/>`;
}

/* Smooth line through points, optionally area-filled to `base`. */
function spline(pts, o = {}) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [x0, y0] = pts[i], [x1, y1] = pts[i + 1];
    const mx = (x0 + x1) / 2;
    d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
  }
  const stroke = `<path d="${d}" fill="none" stroke="${o.stroke || C.sky}" stroke-width="${o.width || 3.5}" stroke-linecap="round"${o.glow ? ' filter="url(#glow)"' : ""}/>`;
  if (o.fill) {
    const area = d + ` L${pts[pts.length - 1][0]},${o.base} L${pts[0][0]},${o.base} Z`;
    return `<path d="${area}" fill="${o.fill}"/>` + stroke;
  }
  return stroke;
}

/* Browser/app chrome bar with three dots. */
function chrome(x, y, w, label, o = {}) {
  return `<g>
    <rect x="${x}" y="${y}" width="${w}" height="38" rx="10" fill="rgba(255,255,255,.05)" stroke="${C.line}"/>
    <circle cx="${x + 20}" cy="${y + 19}" r="4.5" fill="${C.warn}" opacity=".8"/>
    <circle cx="${x + 36}" cy="${y + 19}" r="4.5" fill="${C.amber}" opacity=".8"/>
    <circle cx="${x + 52}" cy="${y + 19}" r="4.5" fill="${C.mint}" opacity=".8"/>
    ${label ? txt(x + 74, y + 24, label, { size: 13, mono: true, fill: o.fill || C.mut }) : ""}
  </g>`;
}

function svg(w, h, body, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${esc(title)}">
<title>${esc(title)}</title>
${body}
</svg>
`;
}

module.exports = { C, MONO, SANS, defs, ground, panel, txt, chip, pin, bar, spline, chrome, svg, esc };
