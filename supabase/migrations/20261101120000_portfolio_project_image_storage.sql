-- Shared project image bucket. Existing portfolio project rows and tables are preserved.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-projects',
  'portfolio-projects',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do nothing;

create policy "portfolio project images public read"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'portfolio-projects');

create policy "portfolio project images admin upload"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'portfolio-projects'
  and (select public.is_portfolio_admin())
);

create policy "portfolio project images admin update"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'portfolio-projects'
  and (select public.is_portfolio_admin())
)
with check (
  bucket_id = 'portfolio-projects'
  and (select public.is_portfolio_admin())
);

create policy "portfolio project images admin delete"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'portfolio-projects'
  and (select public.is_portfolio_admin())
);
