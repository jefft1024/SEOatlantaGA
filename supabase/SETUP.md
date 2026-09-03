# Supabase setup — admin dashboard, blog & leads

This connects the site to Supabase so you can write blog posts, see leads, and
manage lead delivery from a dashboard at **`/admin`**. One-time setup, ~10 min.

## 1. Create the database tables
Supabase dashboard → **SQL Editor** → **New query** → paste the whole of
[`schema.sql`](./schema.sql) → **Run**. (Safe to re-run.)

This creates three tables — `posts`, `leads`, `settings` — and the security
rules (Row Level Security) that keep them private until you log in.

## 2. Create your admin login
Supabase dashboard → **Authentication → Users → Add user** → enter your email
and a password → create. This is the account you'll sign into `/admin` with.

Then **turn off public sign-ups** so nobody else can create an account:
**Authentication → Sign In / Providers → Email** → disable "Allow new users to
sign up" (or set the project to invite-only). Only the user you just made will
be able to log in.

## 3. Add the environment variables in Vercel
Vercel → your project → **Settings → Environment Variables**. Add:

| Name | Value | Notes |
|---|---|---|
| `SUPABASE_URL` | `https://jzhnbjrigyouirwgfeye.supabase.co` | Your project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | *(the secret `service_role` key)* | 🔒 **Settings → API → service_role**. Never commit this. |

Get the `service_role` key from Supabase → **Settings → API → Project API keys
→ `service_role` (secret)**. The public `anon` key is already wired into the
site and needs no env var.

Redeploy (or it applies on the next deploy) so the serverless functions pick up
the variables.

## 4. Use it
- **Dashboard:** go to `https://your-site/admin`, log in.
- **Posts:** write in Markdown with a live preview, Save draft or Publish.
  Published posts appear instantly at `/blog/<slug>` and on the `/blog` index.
- **Leads:** every form submission is saved here automatically.
- **Settings:** set where leads are emailed / a webhook URL — no redeploy needed.

## How it fits together
- The 3 launch blog posts stay as static files (unchanged). New posts you write
  in the dashboard are stored in Supabase and rendered live by
  `api/blog-post.js` using the same page design.
- `api/lead.js` saves every lead to Supabase **and** still emails / webhooks it
  (email needs `RESEND_API_KEY` in Vercel; see `api/lead.js` header).
- Nothing is exposed: the public `anon` key can only read *published* posts;
  everything else requires your login (enforced by RLS in `schema.sql`).

## Image uploads (device upload / drag-and-drop in the editor)
To let the post editor upload images from your device — the **Image** button,
drag-and-drop, and paste — run **`supabase/storage.sql`** once in the SQL editor.
It creates a public `blog-images` storage bucket and the access policies (admins
upload, everyone can view). Until it's run, the editor's **Image URL** button
still works for images you host elsewhere. Uploaded images are served from your
Supabase domain, which is already allowed in the site's CSP.

## Optional later
- Add new posts to `sitemap.xml` (currently static) so they're discovered
  faster — can be automated in a follow-up.
- Migrate the 3 launch posts into the dashboard so they're editable there too.
