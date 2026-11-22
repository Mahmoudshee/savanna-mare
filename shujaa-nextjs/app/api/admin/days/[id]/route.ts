import { NextResponse } from 'next/server'
import { guardAdmin, adminDb } from '@/lib/admin-db'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data, error } = await adminDb().from('itinerary_days').select('*').eq('id', params.id).single()
  if (error || !data) return NextResponse.json({ error: 'Day not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { error } = await adminDb()
    .from('itinerary_days')
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq('id', params.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

