import { createClient, SupabaseClient } from '@supabase/supabase-js';

export function getSupabaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_NEXT_PUBLIC_SUPABASE_URL_SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL_SUPABASE_URL ||
    process.env.SUPABASE_URL ||
    ''
  );
}

export function getSupabaseAnonKey(): string {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_NEXT_PUBLIC_SUPABASE_URL_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL_SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    process.env.SUPABASE_PUBLISHABLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL_SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_URL_SUPABASE_SECRET_KEY ||
    ''
  );
}

let supabaseInstance: SupabaseClient | null = null;

export function isSupabaseConfigured(): boolean {
  const url = getSupabaseUrl();
  const key = getSupabaseAnonKey();
  return Boolean(
    url &&
    key &&
    url.startsWith('https://') &&
    key.length > 20
  );
}

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!supabaseInstance) {
    supabaseInstance = createClient(getSupabaseUrl(), getSupabaseAnonKey());
  }
  return supabaseInstance;
}
