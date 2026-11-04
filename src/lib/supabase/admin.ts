import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl } from './env';

/**
 * Service-role client. Bypasses RLS, so it is only used on the server to read a
 * single letter by slug for /s/[slug] and to inspect uploaded media.
 * The key lives in SUPABASE_SERVICE_ROLE_KEY and is never sent to the browser.
 */
export function createAdminClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY belum diisi (lihat .env.example)');
  return createClient(supabaseUrl(), key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
