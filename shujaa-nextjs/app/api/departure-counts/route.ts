import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase-server'

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()
    const { data, error } = await supabase
      .from('bookings')
      .select('departure_id, departures!inner(arrival_date)')
      .eq('status', 'confirmed')

    if (error) throw error

    const counts: Record<string, number> = {}
    for (const row of data || []) {
      const dep = (row.departures as unknown) as { arrival_date: string } | null
      if (dep?.arrival_date) {
        counts[dep.arrival_date] = (counts[dep.arrival_date] || 0) + 1
      }
    }

    return NextResponse.json({ counts })
  } catch {
    return NextResponse.json({ counts: {} }, { status: 200 })
  }
}
