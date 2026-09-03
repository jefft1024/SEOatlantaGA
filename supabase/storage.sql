-- Blog image uploads
-- ------------------------------------------------------------------
-- Run this ONCE in the Supabase SQL editor (Dashboard → SQL editor →
-- New query → paste → Run). It creates a public storage bucket for
-- images added from the admin post editor (the "Image" button, plus
-- drag-and-drop and paste), and the access policies that let a
-- logged-in admin upload while everyone can view the images on the site.
--
-- Safe to re-run: every statement is idempotent.

-- 1. The bucket. `public = true` means the files are readable by URL,
--    which is what lets them show up on the live blog.
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do update set public = true;

-- 2. Anyone may read the images (they are public assets on the website).
drop policy if exists "blog images are public" on storage.objects;
create policy "blog images are public"
  on storage.objects for select
  using (bucket_id = 'blog-images');

-- 3. Only a logged-in admin may upload / replace / delete them.
drop policy if exists "admins upload blog images" on storage.objects;
create policy "admins upload blog images"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'blog-images');

drop policy if exists "admins update blog images" on storage.objects;
create policy "admins update blog images"
  on storage.objects for update to authenticated
  using (bucket_id = 'blog-images')
  with check (bucket_id = 'blog-images');

drop policy if exists "admins delete blog images" on storage.objects;
create policy "admins delete blog images"
  on storage.objects for delete to authenticated
  using (bucket_id = 'blog-images');
