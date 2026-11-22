import { NextResponse } from 'next/server'
import { guardAdmin, adminDb } from '@/lib/admin-db'

export async function GET() {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await adminDb().from('departures').select('*').order('arrival_date', { ascending: true })
  return NextResponse.json(data || [])
}

export async function POST(req: Request) {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  const { data, error } = await adminDb().from('departures').insert(body).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

