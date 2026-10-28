# Repository instructions

## Supabase access and safety
- Use the official Supabase MCP server configured in `.codex/config.toml`.
- Keep MCP access scoped to project `mzbegnyzktdzhvspjucq` and read-only for the initial inspection.
- Do not delete tables, change existing database records, alter schemas, or run/apply database migrations without asking the user first and receiving explicit approval.
- Never put Supabase secret or service-role keys in frontend code, client bundles, source control, or committed configuration.
- Use only the Supabase publishable key in browser-side code. Keep any server-side secrets in the deployment provider's secret/environment-variable settings, never in Git.
- Before suggesting database changes, inspect the existing schema and relevant Row Level Security policies.
