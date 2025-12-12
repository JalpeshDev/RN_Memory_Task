/**
 * Supabase Client
 * -------------------
 * Centralized client for:
 *  - Authentication (if added later)
 *  - Database queries
 *  - Storage operations
 *
 * PersistSession is disabled because this app does not require auth yet.
 * Env variables are pulled from constants → can be switched to react-native-dotenv easily.
 */

import { createClient } from "@supabase/supabase-js";
import constant from "app/constants/constant";

const SUPABASE_URL = constant.supabase.url;
const SUPABASE_ANON_KEY = constant.supabase.anonKey;

// Ensure environment config is present
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase configuration. Set SUPABASE_URL and SUPABASE_ANON_KEY in app config or env."
  );
}

// Shared Supabase Client instance
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: false }, // No persistent auth needed
});

export default supabase;
