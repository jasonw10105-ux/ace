
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.7';

const projectUrl = 'https://badyvqcyjbvlafvpuvwc.supabase.co';
const anonKey = 'sb_publishable_ozl2h4BuOQP-Np_ftskG3w_3Y2nNieH';

// Production configuration for launch stability
export const supabase = createClient(projectUrl, anonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce' // High-security modern flow
  }
});

/**
 * Verified Protocol Diagnostic
 * Pings the database to ensure the auth environment is responsive.
 */
export const checkSystemIntegrity = async () => {
  const start = Date.now();
  try {
    const { data, error } = await supabase.from('profiles').select('id').limit(1).maybeSingle();
    if (error && error.code !== 'PGRST116') throw error;
    return {
      status: 'online',
      latency: Date.now() - start,
      ledger: 'connected',
      identity: 'active'
    };
  } catch (e) {
    return {
      status: 'degraded',
      latency: Date.now() - start,
      error: e instanceof Error ? e.message : 'Registry link timeout'
    };
  }
};
