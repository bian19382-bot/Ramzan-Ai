# Portfolio Projects: Desktop and Mobile Cloud Sync

## Data source
Portfolio project records are stored in the existing `public.portfolio_projects` table in Supabase project `mzbegnyzktdzhvspjucq`. The browser's Local Storage is no longer the write source for the Projects admin screen.

- Public pages read only published projects.
- Admin CRUD requires a valid Supabase Auth session and a matching `public.profiles.role = 'admin'` record.
- The existing `portfolio_projects_admin_all` and `portfolio_projects_public_read` RLS policies remain in place.
- Realtime is enabled for `public.portfolio_projects` so open pages can refresh after a project change.

## Legacy desktop-only projects
The Admin Projects screen no longer displays the legacy-project detection banner or an Import to Supabase action. Projects that existed only in an old browser's Local Storage are not automatically copied into the shared database. If those records are needed, they must be recovered separately from that browser's data; this deployment does not delete the browser's existing Local Storage.

## Project images
The `portfolio-projects` bucket is public-read for rendering portfolio images. Upload, update, and delete operations are restricted by Storage RLS to the existing `public.is_portfolio_admin()` check. Supported types: JPEG, PNG, WebP, GIF; maximum 8 MiB.

## Environment
The existing `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` settings are reused. The repository currently also has the public project URL and publishable key fallback in `src/lib/supabase.ts`. Do not add a service-role key to Cloudflare Pages frontend variables or commit one to Git.

## Verification checklist
- [ ] Cloudflare Pages preview for this branch builds successfully.
- [ ] Admin login works on the branch preview.
- [ ] Desktop Projects admin loads cloud rows.
- [ ] Create a test draft; confirm it appears in admin but not public pages.
- [ ] Publish a test project; confirm it appears on desktop and phone.
- [ ] Edit the project on desktop; confirm refresh/realtime updates mobile.
- [ ] Upload a cover image; confirm the public URL loads on another device.
- [ ] Delete the test project and verify it disappears from the public page.
- [ ] Confirm old desktop Local Storage remains available as a backup.

## Rollback
The original `src/admin/pages/AdminProjects.tsx` and local data provider remain in the repository. Reverting the feature commit restores the old admin screen. The Storage bucket and Realtime publication changes are additive; do not remove them until the application rollback and any stored image references have been reviewed.
