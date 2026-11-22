import { NextResponse } from 'next/server'
import { createAdminCredential } from '@/lib/admin-auth'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
const SETUP_KEY = process.env.ADMIN_SETUP_KEY || 'savanna-setup-2026'

export async function POST(request: Request) {
  try {
    const { email, password, displayName, setupKey } = await request.json()

    if (setupKey !== SETUP_KEY) {
      return NextResponse.json({ error: 'Invalid setup key' }, { status: 403 })
    }
    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    // ── Step 1: Create user in Supabase Auth via Admin API (auto-confirmed) ──
    const createRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      },
      body: JSON.stringify({
        email,
        password,
        email_confirm: true,          // skip email verification
        user_metadata: {
          is_admin: 'true',
          display_name: displayName,
        },
      }),
    })

    const authJson = await createRes.json()

    if (!createRes.ok) {
      // If user already exists (422), that's acceptable — continue to local save
      if (createRes.status !== 422) {
        return NextResponse.json(
          { error: authJson.message || authJson.error || 'Failed to create Supabase account' },
          { status: createRes.status }
        )
      }
    }

    // ── Step 2: Save to local credentials file (for local dev login) ──
    const result = await createAdminCredential(email, password, displayName)
    // Treat "already exists" as OK
    if (!result.ok && !result.error?.includes('already exists')) {
      return NextResponse.json({ error: result.error }, { status: 409 })
    }

    return NextResponse.json({
      ok: true,
      userId: authJson.id,
      message: 'Admin account created. You can now sign in.',
    })

  } catch (err) {
    console.error('Admin create-user error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

