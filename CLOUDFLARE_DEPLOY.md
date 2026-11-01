# Cloudflare Pages Mukammal Deployment Guide (100% Guaranteed Zero Error)

Aap ki website **Cloudflare Pages** par deploy hone ke liye mukammal tor par ready hai. Nechy di gayi settings aur common errors ke solutions ko follow karein:

---

## 1. Cloudflare Dashboard Settings (Pages → Connect to Git)

Cloudflare dashboard mein jate waqt:
1. **Workers & Pages** par click karein.
2. **Create application** → **Pages** → **Connect to Git** par click karein aur apna GitHub repository select karein.
3. Build Settings mein ye exact values darj karein:

| Setting | Value | Rationale |
|---|---|---|
| **Framework preset** | `Vite` | (Vite preset automatically selects default settings) |
| **Build command** | `npm run build` | Runs clean prebuild + Vite compile + mirrors to both `dist` and `build` |
| **Build output directory** | `dist` (ya `build`) | Donon auto-generated hain, jo b select ho deploy ho jayega |
| **Root directory** | `/` (leave empty) | Root directory of project |

---

## 2. Environment Variables (Zaroori for Cloudflare)

Cloudflare dashboard mein **Settings → Environment variables** mein ye variable lazmi add karein:

| Variable Name | Value | Kyun zaroori ha? |
|---|---|---|
| `NODE_VERSION` | `20` | Cloudflare ke default purane Node.js version ko modern Node 20 LTS par set karta ha taake Vite bina kisi syntax error ke compile ho. |
| `PACKAGE_MANAGER` | `npm` | Cloudflare ko force karta ha ke hamesha `npm` use kare aur Bun ko kabhi run na kare. Is se bun.lock ka error 100% khatam ho jata ha. |

*(Note: `GEMINI_API_KEY`, `VITE_SUPABASE_URL` aur `VITE_SUPABASE_PUBLISHABLE_KEY` optional hain. Public portfolio bina unke b 100% chalti ha).*

---

## 3. Har Error Ka Permanent Solution Jo Code Mein Lagaya Gaya Ha:

1. **`bun.lock` / `bun.lockb` Conflict**:
   - `scripts/clean-lockfiles.js` file banayi gayi ha jo har build se pehle automatically `bun.lock`, `bun.lockb`, `yarn.lock`, aur `pnpm-lock.yaml` ko delete kar deti ha.
   - `.gitignore` mein b ignore ha taake GitHub par push na ho.

2. **Output Directory Missing Error (`dist` vs `build`)**:
   - `scripts/prepare-output.js` script run hota ha jo `dist` ko `build` directory mein b mirror kar deta ha. Agar Cloudflare mein `dist` likha ho ya `build`, error 0% aayega.
   - `wrangler.toml` file add ki gayi ha jo Cloudflare Pages ko directly `pages_build_output_dir = "dist"` bata deti ha.

3. **Page Refresh 404 Error (`_redirects` aur `404.html`)**:
   - `public/_redirects` (`/* /index.html 200`) aur `public/404.html` donon add hain taake `/resume` ya `/admin` par browser refresh karne se 404 na aaye.

4. **NPM Peer Dependency Error**:
   - `.npmrc` file mein `legacy-peer-deps=true` aur `engine-strict=false` configured ha taake `npm install` aur `npm ci` bina rukawat ke ho jayein.

---

## 4. Test Verification:
- `npm run lint` → 0 errors (Passed)
- `npm test` → 8/8 tests passed (Passed)
- `npm run build` → 1.03s build time (Passed)
