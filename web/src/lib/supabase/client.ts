import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

// These will be loaded from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client for browser-side operations (uses anon key)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Client for server-side operations (uses service role key)
export const supabaseAdmin = supabaseServiceRoleKey 
  ? createClient<Database>(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase;

// Helper function to check if data is stale (older than 24 hours)
export const isDataStale = (timestamp: string | null): boolean => {
  if (!timestamp) return true;
  const lastUpdate = new Date(timestamp).getTime();
  const now = new Date().getTime();
  const hoursDiff = (now - lastUpdate) / (1000 * 60 * 60);
  return hoursDiff >= 24;
}; 