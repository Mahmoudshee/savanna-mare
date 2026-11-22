import { NextResponse } from 'next/server'
import { requireAdminSession, createAdminCredential } from '@/lib/admin-auth'

/** POST /api/admin/add-admin
 *  Requires a valid admin session cookie.
 *  Body: { email, password, displayName, role? }
 */
export async function POST(request: Request) {
  const session = await requireAdminSession()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  try {
    const { email, password, displayName, role } = await request.json()

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'email, password and displayName are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const result = await createAdminCredential(
      email.trim().toLowerCase(),
      password,
      displayName.trim(),
      (role === 'super_admin' ? 'super_admin' : 'admin')
    )

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 409 })
    }

    return NextResponse.json({ ok: true, message: `Admin account created for ${email}` })
  } catch (err) {
    console.error('add-admin error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

