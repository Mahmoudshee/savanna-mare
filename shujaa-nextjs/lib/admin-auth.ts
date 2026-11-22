import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

const SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'shujaa-admin-secret'
)
const COOKIE_NAME = 'shujaa_admin_session'
const MAX_AGE = 60 * 60 * 24 * 7 // 7 days

/** Service-role Supabase client — bypasses RLS */
function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

export interface AdminRecord {
  id: string
  email: string
  displayName: string
  role: string
}

// ── Auth via Supabase ──────────────────────────────────────────────────────

export async function verifyAdminCredential(
  email: string,
  password: string
): Promise<AdminRecord | null> {
  const supabase = serviceClient()

  // 1. Sign in with Supabase Auth to verify the password
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (authError || !authData.user) {
    console.error('Supabase auth error:', authError?.message)
    return null
  }

  // 2. Look up the admin_users row to get role + display_name
  const { data: adminRow, error: dbError } = await supabase
    .from('admin_users')
    .select('id, email, display_name, role')
    .eq('id', authData.user.id)
    .single()

  if (dbError || !adminRow) {
    console.error('admin_users lookup failed:', dbError?.message)
    return null
  }

  return {
    id: adminRow.id,
    email: adminRow.email,
    displayName: adminRow.display_name,
    role: adminRow.role,
  }
}

export async function createAdminCredential(
  email: string,
  password: string,
  displayName: string,
  role = 'super_admin'
): Promise<{ ok: boolean; error?: string }> {
  const supabase = serviceClient()

  // Check if the email is already registered in admin_users
  const { data: existing } = await supabase
    .from('admin_users')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (existing) {
    return { ok: false, error: 'An account with this email already exists.' }
  }

  // Create the user in Supabase Auth (auto-confirm email)
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email: email.toLowerCase(),
    password,
    email_confirm: true,
    user_metadata: { display_name: displayName, is_admin: 'true' },
  })

  if (authError || !authData.user) {
    return { ok: false, error: authError?.message || 'Failed to create auth user.' }
  }

  // Upsert into admin_users (the trigger should handle this, but upsert as safety net)
  const { error: dbError } = await supabase.from('admin_users').upsert({
    id: authData.user.id,
    email: email.toLowerCase(),
    display_name: displayName,
    role,
  })

  if (dbError) {
    return { ok: false, error: dbError.message }
  }

  return { ok: true }
}

export async function adminExists(): Promise<boolean> {
  const supabase = serviceClient()
  const { count } = await supabase
    .from('admin_users')
    .select('id', { count: 'exact', head: true })
  return (count ?? 0) > 0
}

// ── JWT session ────────────────────────────────────────────────────────────

export async function createAdminToken(adminId: string, email: string, role: string) {
  return new SignJWT({ adminId, email, role })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyAdminToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as { adminId: string; email: string; role: string }
  } catch {
    return null
  }
}

export async function getAdminSession() {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyAdminToken(token)
}

export function setAdminCookie(token: string) {
  cookies().set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: MAX_AGE,
  })
}

export function clearAdminCookie() {
  cookies().set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  })
}

export async function requireAdminSession() {
  const session = await getAdminSession()
  if (!session) return null

  // Verify admin still exists in Supabase
  const supabase = serviceClient()
  const { data: admin } = await supabase
    .from('admin_users')
    .select('display_name, role')
    .eq('id', session.adminId)
    .maybeSingle()

  if (!admin) return null
  return { ...session, displayName: admin.display_name }
}
