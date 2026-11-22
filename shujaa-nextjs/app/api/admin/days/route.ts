import { NextResponse } from 'next/server'
import { guardAdmin, adminDb } from '@/lib/admin-db'

export async function GET() {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { data } = await adminDb().from('itinerary_days').select('*').order('day_number', { ascending: true })
  return NextResponse.json(data || [])
}

