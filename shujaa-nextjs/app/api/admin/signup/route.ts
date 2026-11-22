import { NextResponse } from 'next/server'
import { createAdminCredential, adminExists } from '@/lib/admin-auth'

export async function POST(request: Request) {
  try {
    const { email, password, displayName, setupKey } = await request.json()

    // Require setup key to prevent random people from creating admin accounts
    const expectedKey = process.env.ADMIN_SETUP_KEY || 'savanna-setup-2026'
    if (setupKey !== expectedKey) {
      return NextResponse.json({ error: 'Invalid setup key' }, { status: 403 })
    }

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const result = await createAdminCredential(email, password, displayName)
    if (!result.ok) {
      // Return 409 with a clear message — caller treats "already exists" as non-fatal
      return NextResponse.json({ error: result.error }, { status: 409 })
    }

    return NextResponse.json({ ok: true, message: 'Admin account created. You can now log in.' })

  } catch (err) {
    console.error('Signup error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  // Check if any admin already exists (used by signup page to show/hide form)
  return NextResponse.json({ hasAdmin: await adminExists() })
}

