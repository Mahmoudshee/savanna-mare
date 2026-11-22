// Client-side content fetchers (use browser Supabase client)
import { createClient } from './supabase'
import type { HomeContent, ItineraryDay, Departure, SiteSettings } from './types'

export async function getHomeContent(): Promise<HomeContent | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('home_content')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single()
  return data
}

export async function getAllDays(): Promise<ItineraryDay[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('itinerary_days')
    .select('*')
    .order('day_number', { ascending: true })
  return data || []
}

export async function getDayByNumber(num: number): Promise<ItineraryDay | null> {
  const supabase = createClient()
  const { data } = await supabase
    .from('itinerary_days')
    .select('*')
    .eq('day_number', num)
    .single()
  return data
}

export async function getActiveDepartures(): Promise<Departure[]> {
  const supabase = createClient()
  const { data } = await supabase
    .from('departures')
    .select('*')
    .eq('is_active', true)
    .order('arrival_date', { ascending: true })
  return data || []
}

export async function getSiteSettings(): Promise<Record<string, string>> {
  const supabase = createClient()
  const { data } = await supabase.from('site_settings').select('*')
  if (!data) return {}
  return Object.fromEntries(data.map((s: SiteSettings) => [s.key, s.value]))
}

