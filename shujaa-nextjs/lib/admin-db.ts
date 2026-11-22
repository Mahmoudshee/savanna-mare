import { createClient } from '@supabase/supabase-js'
import { requireAdminSession } from './admin-auth'

/** Service-role Supabase client — bypasses RLS, use only in API routes */
export function adminDb() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/** Guard for admin API routes. Returns session or null. */
export async function guardAdmin() {
  return requireAdminSession()
}

export const SUPABASE_URL = () => process.env.NEXT_PUBLIC_SUPABASE_URL!
export const SERVICE_KEY  = () => process.env.SUPABASE_SERVICE_ROLE_KEY!

