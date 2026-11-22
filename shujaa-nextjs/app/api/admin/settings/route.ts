import { NextResponse } from 'next/server'
import { guardAdmin, adminDb } from '@/lib/admin-db'

// PUT /api/admin/settings — upsert site_settings key/value pairs
export async function PUT(req: Request) {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body: Record<string, string> = await req.json()
  const db = adminDb()
  const rows = Object.entries(body).map(([key, value]) => ({ key, value, updated_at: new Date().toISOString() }))
  const { error } = await db.from('site_settings').upsert(rows, { onConflict: 'key' })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

