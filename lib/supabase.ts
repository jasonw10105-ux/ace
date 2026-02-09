
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.7';

/**
 * ArtFlow Infrastructure Initializer
 * 
 * To link your Supabase project:
 * 1. Go to Project Settings > API in your Supabase Dashboard.
 * 2. Copy the 'Project URL' and 'anon public' key.
 * 3. Set them as environment variables (SUPABASE_URL and SUPABASE_ANON_KEY) in your project dashboard.
 */

// We use placeholders to prevent the 'supabaseUrl is required' error during boot
// if environment variables are not yet injected.
const supabaseUrl = process.env.SUPABASE_URL || 'https://your-project-id.supabase.co';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || 'your-anon-public-key';

const isPlaceholder = supabaseUrl.includes('your-project-id') || !process.env.SUPABASE_URL;

if (isPlaceholder) {
  console.warn(
    "ArtFlow: Supabase Connection strings missing. \n" +
    "The ledger will remain disconnected until SUPABASE_URL and SUPABASE_ANON_KEY are set in the environment variables. \n" +
    "Follow the link steps in the code comments of lib/supabase.ts"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
