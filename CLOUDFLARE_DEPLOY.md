# Cloudflare Pages Deployment Guide

Your project is now fully configured for automatic, zero-error deployments on **Cloudflare Pages**!

---

### 1. Cloudflare Pages Build Settings

When connecting your GitHub repository in the **Cloudflare Dashboard (Workers & Pages → Create Application → Pages → Connect to Git)**, use these exact settings:

| Setting | Value |
|---|---|
| **Project Name** | `ramzan-portfolio` (or your choice) |
| **Framework preset** | `Vite` |
| **Build command** | `npm run build` |
| **Build output directory** | `dist` |
| **Root directory** | `/` (leave empty or default) |

---

### 2. Environment Variables in Cloudflare Pages

In **Settings → Environment variables** (or during initial project setup in Cloudflare Pages), add:

| Variable Name | Value | Purpose |
|---|---|---|
| `NODE_VERSION` | `20` | Guarantees modern Node 20 LTS for building Vite |
| `VITE_SUPABASE_URL` | `https://YOUR_PROJECT_REF.supabase.co` | (Optional) Your Supabase project URL |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` | (Optional) Your Supabase publishable key |

*(Note: The public website works out of the box even without Supabase credentials. Supabase is only needed if you wish to use cloud auth for the `/admin` portal).*

---

### 3. Automatic Protections Included

1. **`bun.lock` / `bun.lockb` Auto-Removal**:
   - `bun.lock` and `bun.lockb` are ignored in `.gitignore`.
   - A cross-platform `prebuild` hook in `package.json` automatically checks and removes any `bun.lock` files before Vite builds.
   - GitHub Actions workflow (`.github/workflows/ci.yml`) also cleans any lockfiles automatically.

2. **SPA Client-Side Routing**:
   - A `public/_redirects` file is included with `/* /index.html 200`.
   - This ensures routes like `/resume`, `/projects/:slug`, and `/admin` will load directly on refresh without 404 errors.
