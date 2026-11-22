import { NextResponse } from 'next/server'
import { guardAdmin, adminDb } from '@/lib/admin-db'

// GET /api/admin/content — returns site_settings + home_content
export async function GET() {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = adminDb()
  const [{ data: settingsRows }, { data: home }] = await Promise.all([
    db.from('site_settings').select('*'),
    db.from('home_content').select('*').order('updated_at', { ascending: false }).limit(1).single(),
  ])
  const settings = Object.fromEntries((settingsRows || []).map((r: { key: string; value: string }) => [r.key, r.value]))
  return NextResponse.json({ settings, home: home || {} })
}

// PUT /api/admin/content — update home_content fields
export async function PUT(req: Request) {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const db = adminDb()
  // Get existing home row id
  const { data: existing } = await db.from('home_content').select('id').limit(1).single()
  if (!existing) return NextResponse.json({ error: 'No home_content row found' }, { status: 404 })
  const { error } = await db.from('home_content').update({ ...body, updated_at: new Date().toISOString() }).eq('id', existing.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

