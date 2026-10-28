# Supabase email/password authentication

This branch adds email/password sign-in and requires a verified Supabase user session for every application page. The existing portfolio, resume, project-detail, and admin components remain in place; only the login route is public.

## 1. Environment variables

Create a local `.env` file (do not commit it) using `.env.example`:

```dotenv
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_project_key
```

Use the Project URL and publishable key from **Supabase Dashboard → Connect** (or **Project Settings → API Keys**). A legacy `anon` key is also supported if that is what the project dashboard provides. These values are intended for browser applications; never put a `service_role` key or secret key in a `VITE_*` variable or in frontend code.

For deployments, set the same two variables in the hosting provider's environment-variable settings, then rebuild/redeploy the frontend.

## 2. Supabase dashboard settings

1. Open **Authentication → Sign In / Providers → Email** and enable the Email provider.
2. For an invite-only/private portfolio, disable public sign-ups if the project dashboard exposes that option. Create the permitted account yourself in **Authentication → Users → Add user** and set a strong password. If public sign-ups remain enabled, anyone may create an account and access the entire site.
3. In **Authentication → URL Configuration**, set **Site URL** to the deployed site origin (for example, `https://your-domain.example`). Add the local development origin (for example, `http://localhost:3000`) and each exact deployed preview origin you use to **Redirect URLs** if needed.
4. Confirm email confirmation settings match your onboarding policy. If confirmation is required, the user must confirm their email before signing in.
5. Never expose Supabase secret or `service_role` keys in the frontend.

## 3. Route and session behavior

- `/login` is the only unauthenticated application route.
- All other paths are wrapped by `ProtectedRoute`; unauthenticated visitors are redirected to login and returned to their original URL after a successful login.
- The Supabase client persists sessions, refreshes tokens automatically, and listens for sign-in/sign-out changes. On app startup, the saved session is verified using `supabase.auth.getUser()` before protected content is rendered.
- A sign-out control is available on protected pages.

## 4. Important security note

A client-side route guard controls the UI, but it is not authorization for private database data or server APIs. Any private Supabase tables must have Row Level Security enabled with policies appropriate to the data and user. Any private server endpoint must validate the bearer token server-side. Do not rely on hiding a route to secure data.

## 5. Verification checklist

- Set environment variables and restart the dev server.
- Visit `/login` and sign in with the account created in Supabase.
- Open `/`, `/resume`, `/projects/<slug>`, and `/admin`; each should require login.
- Open a protected URL in a private/incognito window; verify it redirects to `/login`, then returns to the intended URL after signing in.
- Sign out and confirm protected pages redirect back to login.
- Run `npm run build` and `npm run lint`.
