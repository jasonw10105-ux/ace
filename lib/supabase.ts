
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.7';

/**
 * ArtFlow Infrastructure Initializer
 * Hardcoded fallbacks ensure the prototype remains functional even if 
 * environment variables are not correctly injected by the host.
 */

const projectUrl = 'https://badyvqcyjbvlafvpuvwc.supabase.co';
const anonKey = 'sb_publishable_ozl2h4BuOQP-Np_ftskG3w_3Y2nNieH';

const envUrl = process.env.SUPABASE_URL;
const envKey = process.env.SUPABASE_ANON_KEY;

// Prefer environment variables, but use hardcoded project strings as a reliable fallback
const supabaseUrl = (envUrl && !envUrl.includes('your-project-id')) 
  ? envUrl 
  : projectUrl;

const supabaseAnonKey = (envKey && !envKey.includes('your-anon-public-key'))
  ? envKey
  : anonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Debugging signal for the Co-Founder
if (supabaseUrl.includes('your-project-id') || supabaseUrl.includes('placeholder')) {
  console.warn("ArtFlow: Supabase credentials missing. Check .env configuration.");
}
