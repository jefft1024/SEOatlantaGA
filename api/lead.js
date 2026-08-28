/* POST /api/lead — receives a form submission, validates it, and forwards it.
 *
 * Delivery is driven entirely by environment variables set in the Vercel
 * dashboard (Settings → Environment Variables). Set whichever you use; the
 * handler forwards to every one that is configured, and still returns 200 if
 * none are set (so the form never appears broken while you wire things up —
 * the submission is written to the function log either way).
 *
 *   LEAD_WEBHOOK_URL   any HTTPS endpoint (Zapier, Make, Slack, n8n, CRM)
 *   RESEND_API_KEY     Resend API key, for email delivery
 *   LEAD_TO_EMAIL      where lead emails land   (default hello@seoatlantaga.com)
 *   LEAD_FROM_EMAIL    verified Resend sender   (default leads@seoatlantaga.com)
 */

const FIELDS = ["name", "email", "company", "website", "phone", "budget", "service", "message"];
const META = ["page", "referrer", "utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"];
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MAX_LEN = 4000;

const hits = new Map(); // best-effort per-instance rate limit

function rateLimited(ip) {
  const now = Date.now();
  const window = 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < window);
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) hits.clear();
  return list.length > 5;
}

function clean(v) {
  return typeof v === "string" ? v.trim().slice(0, MAX_LEN) : "";
}

module.exports = async function handler(req, res) {
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = null; }
  }
  if (!body || typeof body !== "object") {
    return res.status(400).json({ ok: false, error: "Invalid request body" });
  }

  // Honeypot: real people leave it empty; bots fill everything in.
  if (clean(body.company_website)) return res.status(200).json({ ok: true });

  const ip = (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip)) {
    return res.status(429).json({ ok: false, error: "Too many submissions. Please try again in a minute." });
  }

  const lead = {};
  for (const f of FIELDS) { const v = clean(body[f]); if (v) lead[f] = v; }
  for (const m of META) { const v = clean(body[m]); if (v) lead[m] = v; }

  if (!lead.email || !EMAIL_RE.test(lead.email)) {
    return res.status(400).json({ ok: false, error: "A valid email address is required." });
  }
  if (!lead.name && !lead.website) {
    return res.status(400).json({ ok: false, error: "Tell us your name or your website so we know who to reply to." });
  }

  lead.received_at = new Date().toISOString();
  lead.ip = ip;

  const results = [];

  if (process.env.LEAD_WEBHOOK_URL) {
    results.push(
      fetch(process.env.LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      }).then((r) => (r.ok ? null : `webhook ${r.status}`))
    );
  }

  if (process.env.RESEND_API_KEY) {
    const rows = Object.entries(lead)
      .map(([k, v]) => `<tr><td style="padding:6px 12px;border:1px solid #e3e9f5"><b>${k}</b></td><td style="padding:6px 12px;border:1px solid #e3e9f5">${escapeHtml(v)}</td></tr>`)
      .join("");
    results.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          from: process.env.LEAD_FROM_EMAIL || "leads@seoatlantaga.com",
          to: [process.env.LEAD_TO_EMAIL || "hello@seoatlantaga.com"],
          reply_to: lead.email,
          subject: `New lead — ${lead.name || lead.website || lead.email}`,
          html: `<h2 style="font-family:sans-serif">New lead from SEOAtlantaGA.com</h2><table style="border-collapse:collapse;font-family:sans-serif;font-size:14px">${rows}</table>`
        })
      }).then((r) => (r.ok ? null : `resend ${r.status}`))
    );
  }

  const failures = (await Promise.allSettled(results))
    .map((r) => (r.status === "rejected" ? String(r.reason) : r.value))
    .filter(Boolean);

  // The lead is never lost: it is always in the function log, whatever happens
  // downstream.
  console.log("[lead]", JSON.stringify(lead), failures.length ? `delivery_failures=${failures.join(",")}` : "");

  if (results.length && failures.length === results.length) {
    return res.status(502).json({ ok: false, error: "We could not deliver your message. Please email hello@seoatlantaga.com." });
  }

  return res.status(200).json({ ok: true });
};

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
