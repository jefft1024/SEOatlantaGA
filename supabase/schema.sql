-- ============================================================================
-- SEOAtlantaGA.com — Supabase schema
-- Run this ONCE in the Supabase dashboard → SQL Editor → New query → Run.
-- Safe to re-run: every statement is idempotent (IF NOT EXISTS / OR REPLACE).
-- ============================================================================

-- ── Blog posts ──────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id                uuid primary key default gen_random_uuid(),
  slug              text unique not null,
  title             text not null,
  excerpt           text default '',          -- the lede shown under the title
  category          text default 'SEO',
  author            text default '',          -- byline / schema author (optional)
  cover_url         text default '',          -- optional hero image URL
  body_md           text default '',          -- markdown source (what you edit)
  body_html         text default '',          -- rendered HTML (what visitors see)
  meta_title        text default '',          -- optional SEO <title> override
  meta_description  text default '',
  read_minutes      int  default 5,
  status            text not null default 'draft' check (status in ('draft','published')),
  published_at      timestamptz,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create index if not exists posts_status_published_idx
  on public.posts (status, published_at desc);

-- ── Redirects (old URL → new URL) ────────────────────────────────────────────
create table if not exists public.redirects (
  id         uuid primary key default gen_random_uuid(),
  source     text not null,                 -- path on this site, e.g. /old-page
  target     text not null,                 -- /new-page or https://external.com/...
  code       int  not null default 301 check (code in (301,302)),
  active     boolean not null default true,
  hits       int  not null default 0,       -- times this redirect has fired
  last_hit   timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists redirects_source_key on public.redirects (lower(source));

-- ── Custom code snippets (tracking codes, meta tags, pixels) ──────────────────
create table if not exists public.code_snippets (
  id         uuid primary key default gen_random_uuid(),
  title      text not null default '',
  location   text not null default 'head' check (location in ('head','body_start','body_end')),
  priority   int  not null default 10,     -- lower runs earlier
  active     boolean not null default false,
  code       text default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Leads (form submissions) ────────────────────────────────────────────────
create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  name          text,
  email         text,
  company       text,
  website       text,
  phone         text,
  budget        text,
  service       text,
  message       text,
  page          text,
  referrer      text,
  utm_source    text,
  utm_medium    text,
  utm_campaign  text,
  utm_term      text,
  utm_content   text,
  gclid         text,
  ip            text,
  status        text not null default 'new' check (status in ('new','read','archived')),
  created_at    timestamptz not null default now()
);

create index if not exists leads_created_idx on public.leads (created_at desc);

-- ── Page content overrides (editable marketing-page text) ───────────────────
create table if not exists public.page_overrides (
  page       text primary key,          -- e.g. 'service:local-seo'
  data       jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ── Lead-delivery settings (single row) ─────────────────────────────────────
create table if not exists public.settings (
  id               int primary key default 1,
  lead_to_email    text default '',
  lead_from_email  text default '',
  lead_webhook_url text default '',
  ga4_id           text default '',          -- Google Analytics 4 Measurement ID
  gtm_id           text default '',          -- Google Tag Manager container ID
  head_html        text default '',          -- custom code injected into <head>
  body_html        text default '',          -- custom code injected before </body>
  updated_at       timestamptz not null default now(),
  constraint settings_singleton check (id = 1)
);
insert into public.settings (id) values (1) on conflict (id) do nothing;

-- ── Keep updated_at fresh on edits ──────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql
set search_path = ''   -- pin the search_path so the function can't be hijacked
as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists posts_touch on public.posts;
create trigger posts_touch before update on public.posts
  for each row execute function public.touch_updated_at();

drop trigger if exists settings_touch on public.settings;
create trigger settings_touch before update on public.settings
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- Row Level Security
-- The service_role key (used only server-side in /api) bypasses all of this,
-- so the lead form can still write even though the public has no insert rights.
-- ============================================================================
alter table public.posts          enable row level security;
alter table public.leads          enable row level security;
alter table public.settings       enable row level security;
alter table public.page_overrides enable row level security;

-- page_overrides: only logged-in admins may read/write. The render functions
-- read via the service_role key, which bypasses RLS.
drop policy if exists "page_overrides_admin_all" on public.page_overrides;
create policy "page_overrides_admin_all" on public.page_overrides
  for all to authenticated using (true) with check (true);

-- posts: anyone may read PUBLISHED posts; logged-in admins may do anything.
drop policy if exists "posts_public_read_published" on public.posts;
create policy "posts_public_read_published" on public.posts
  for select using (status = 'published');

drop policy if exists "posts_admin_all" on public.posts;
create policy "posts_admin_all" on public.posts
  for all to authenticated using (true) with check (true);

-- leads: only logged-in admins may read or update. No public/insert policy —
-- inserts come from the server via the service_role key.
drop policy if exists "leads_admin_read" on public.leads;
create policy "leads_admin_read" on public.leads
  for select to authenticated using (true);

drop policy if exists "leads_admin_update" on public.leads;
create policy "leads_admin_update" on public.leads
  for update to authenticated using (true) with check (true);

-- settings: only logged-in admins may read or change delivery config.
drop policy if exists "settings_admin_read" on public.settings;
create policy "settings_admin_read" on public.settings
  for select to authenticated using (true);

drop policy if exists "settings_admin_write" on public.settings;
create policy "settings_admin_write" on public.settings
  for update to authenticated using (true) with check (true);

-- Done. Next: create your admin user in Authentication → Users, and turn OFF
-- public sign-ups in Authentication → Providers → Email (so only you can log in).
