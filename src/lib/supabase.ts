import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublishableKey &&
  supabaseUrl.trim() !== '' &&
  supabasePublishableKey.trim() !== '' &&
  !supabaseUrl.includes('YOUR_PROJECT_REF') &&
  !supabaseUrl.includes('placeholder.supabase.co')
);

// We use console.warn when unconfigured so dev/test tools and AI Studio don't treat it as an unhandled fatal application crash
if (!isSupabaseConfigured) {
  console.warn(
    'Supabase is not configured yet. Set VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in your environment to enable Supabase authentication.'
  );
}

export const supabase = createClient(
  isSupabaseConfigured ? supabaseUrl! : 'https://placeholder.supabase.co',
  isSupabaseConfigured ? supabasePublishableKey! : 'placeholder-publishable-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
