import { NextResponse } from 'next/server'
import { requireAdminSession } from '@/lib/admin-auth'
import { createClient } from '@supabase/supabase-js'

function serviceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}

/** POST /api/admin/change-password
 *  Requires a valid admin session cookie.
 *  Body: { currentPassword, newPassword }
 */
export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'currentPassword and newPassword are required' }, { status: 400 })
    }
    if (newPassword.length < 8) {
      return NextResponse.json({ error: 'New password must be at least 8 characters' }, { status: 400 })
    }

    const supabase = serviceClient()

    // 1. Verify the current password by attempting a sign-in
    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: session.email,
      password: currentPassword,
    })
    if (verifyError) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 })
    }

    // 2. Update password via admin API
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      session.adminId,
      { password: newPassword }
    )
    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true, message: 'Password updated successfully' })
  } catch (err) {
    console.error('change-password error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

