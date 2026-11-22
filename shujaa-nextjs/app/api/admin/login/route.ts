import { NextResponse } from 'next/server'
import { verifyAdminCredential, createAdminToken, setAdminCookie } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const admin = await verifyAdminCredential(email, password)
    if (!admin) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
    }

    const token = await createAdminToken(admin.id, admin.email, admin.role)
    setAdminCookie(token)

    return NextResponse.json({ ok: true, role: admin.role, displayName: admin.displayName })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
