
import { createClient } from 'https://esm.sh/@supabase/supabase-js@^2.39.7';

// These environment variables are assumed to be present in the execution environment
const supabaseUrl = (window as any).env?.SUPABASE_URL || 'https://mfddxrpiuawggmnzqagn.supabase.co';
const supabaseAnonKey = (window as any).env?.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1mZGR4cnBpdWF3Z2dtbnpxYWduIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMzY2MjcsImV4cCI6MjA3MDkxMjYyN30.DfF1W6VRqto7KLwatpul63wPJbsJ23cTQ4Z4VGBlKdU';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
