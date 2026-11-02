import { createClient } from '@supabase/supabase-js';

// Official project configuration for Ramzan portfolio (project mzbegnyzktdzhvspjucq)
// Allows environment variable override if provided in Cloudflare/hosting,
// with safe fallback to the project's publishable credentials.
const DEFAULT_SUPABASE_URL = 'https://mzbegnyzktdzhvspjucq.supabase.co';
const DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_RmgyJQsfWlzD6xuHBwa4nQ_S-IXDaHL';

const env = typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined;
const rawUrl = typeof env?.VITE_SUPABASE_URL === 'string' ? env.VITE_SUPABASE_URL.trim() : undefined;
const rawKey = typeof env?.VITE_SUPABASE_PUBLISHABLE_KEY === 'string' ? env.VITE_SUPABASE_PUBLISHABLE_KEY.trim() : undefined;

const supabaseUrl =
  rawUrl && !rawUrl.includes('YOUR_PROJECT_REF') && !rawUrl.includes('placeholder.supabase.co')
    ? rawUrl
    : DEFAULT_SUPABASE_URL;

const supabasePublishableKey =
  rawKey && !rawKey.includes('your_project_key') && !rawKey.includes('placeholder-publishable-key')
    ? rawKey
    : DEFAULT_SUPABASE_PUBLISHABLE_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.trim() !== '' &&
  supabasePublishableKey.trim() !== ''
);

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: typeof window !== 'undefined' ? window.localStorage : undefined,
  },
});
