import { NextResponse } from 'next/server'
import { guardAdmin, adminDb } from '@/lib/admin-db'

export async function GET() {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await adminDb().from('bookings').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

export async function PUT(req: Request) {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, status } = await req.json()
  const { error } = await adminDb().from('bookings').update({ status }).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

