/* Server-side Supabase helpers over the PostgREST/Auth REST API.
 *
 * Uses plain fetch so the repo needs no npm dependencies. Reads config from
 * Vercel environment variables (Settings → Environment Variables):
 *
 *   SUPABASE_URL                https://xxxx.supabase.co   (also public)
 *   SUPABASE_SERVICE_ROLE_KEY   the SECRET key — server only, never in the repo
 *
 * The service_role key bypasses Row Level Security, so these run with full
 * access. Only import this from /api serverless functions, never client code.
 */

const URL = process.env.SUPABASE_URL || "";
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function configured() {
  return Boolean(URL && KEY);
}

function headers(extra) {
  return Object.assign(
    {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json"
    },
    extra || {}
  );
}

/* Insert one or more rows. Returns the inserted rows. */
async function insert(table, row) {
  const res = await fetch(`${URL}/rest/v1/${table}`, {
    method: "POST",
    headers: headers({ Prefer: "return=representation" }),
    body: JSON.stringify(row)
  });
  if (!res.ok) throw new Error(`supabase insert ${table} ${res.status}: ${await res.text()}`);
  return res.json();
}

/* Select rows with a raw PostgREST query string, e.g.
 *   select("posts", "slug=eq.foo&status=eq.published&select=*&limit=1")   */
async function select(table, query) {
  const res = await fetch(`${URL}/rest/v1/${table}?${query}`, { headers: headers() });
  if (!res.ok) throw new Error(`supabase select ${table} ${res.status}: ${await res.text()}`);
  return res.json();
}

module.exports = { configured, insert, select, URL, KEY };
