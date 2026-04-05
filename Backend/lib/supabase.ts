import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for general use
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client with service role for admin tasks (entity resolution, etc.)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);
