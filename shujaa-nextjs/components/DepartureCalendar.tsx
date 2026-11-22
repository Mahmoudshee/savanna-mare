'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import type { Departure } from '@/lib/types'

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(d)
}

function formatWeekday(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(d)
}

function BookingCard({
  departure,
}: {
  departure: Departure
}) {
  const arrivalDate = new Date(departure.arrival_date + 'T00:00:00')
  const departureDate = new Date(arrivalDate)
  departureDate.setDate(departureDate.getDate() + 8)

  const priceLow = departure.price_low
  const priceHigh = departure.price_high
  const isHigh = departure.is_high_season

  const priceDisplay = priceLow && priceHigh
    ? `€${priceLow.toLocaleString()}–€${priceHigh.toLocaleString()}`
    : isHigh ? 'Up to €2,700' : 'From €2,400'

  const handleBook = () => {
    const params = new URLSearchParams({
      date: formatDate(arrivalDate),
      window: `Arrival · ${formatWeekday(arrivalDate)}`,
      price: priceDisplay + ' per person',
    })
    window.location.href = `/booking?${params}`
  }

  return (
    <article className="booking-card">
      <div className="booking-dates" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 30px minmax(0,1fr)', alignItems: 'center', gap: 6 }}>
        <div>
          <div className="booking-date-label" style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 5 }}>ARRIVE</div>
          <div className="booking-date-value" style={{ fontSize: 'clamp(14px,1.8vw,20px)', fontWeight: 800, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{formatDate(arrivalDate)}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 5, lineHeight: 1.4 }}>{formatWeekday(arrivalDate)} · City Blue Creekside Hotel</div>
        </div>
        <div style={{ height: 26, width: 26, display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#20211f', color: '#fff', fontSize: 13, margin: 'auto' }}>➜</div>
        <div>
          <div className="booking-date-label" style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 5 }}>DEPART</div>
          <div className="booking-date-value" style={{ fontSize: 'clamp(14px,1.8vw,20px)', fontWeight: 800, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{formatDate(departureDate)}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 5, lineHeight: 1.4 }}>{formatWeekday(departureDate)} · 9 days / 8 nights</div>
        </div>
      </div>

      <div style={{ display: 'inline-block', margin: '17px 0 12px', background: '#e8f7ec', color: '#245a38', borderRadius: 3, padding: '7px 10px', fontSize: 10, fontWeight: 800 }}>
        Available to book
      </div>

      <div style={{ background: '#f4f5f3', textAlign: 'center', padding: '13px 10px', marginBottom: 12 }}>
        <div style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 800, lineHeight: 1.15, color: '#20211f' }}>
          {priceDisplay}
        </div>
        <div style={{ fontSize: 10, color: '#515c54', marginTop: 5 }}>
          per person · EUR · {isHigh ? 'high-season fare' : 'seasonal fare'}
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 10, color: '#515c54', paddingBottom: 13 }}>
        Private room available for an extra €560
      </div>

      {departure.notes && (
        <div style={{ fontSize: 10, color: '#515c54', background: '#fdf9f4', padding: '8px 10px', borderRadius: 3, marginBottom: 10 }}>
          {departure.notes}
        </div>
      )}

      <button
        onClick={handleBook}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, width: '100%', minHeight: 53, border: 0, borderRadius: 4, background: '#20211f', color: '#fff', fontSize: 15, fontWeight: 700, marginBottom: 12, cursor: 'pointer' }}
      >
        Enquire for this date <span>→</span>
      </button>

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, borderTop: '1px solid #ecece8', paddingTop: 12, fontSize: 9, lineHeight: 1.5, color: 'var(--muted)' }}>
        <span><strong style={{ color: 'var(--ink)' }}>Open departure</strong> · maximum 15 travellers</span>
        <span>Minimum 6 travellers to operate</span>
      </div>
      <div style={{ fontSize: 9, color: 'var(--muted)', lineHeight: 1.5, textAlign: 'center' }}>
        No separate availability check is needed to begin booking.
      </div>
    </article>
  )
}

// Group departures by year-month
function groupByMonth(departures: Departure[]) {
  const groups: Record<string, Departure[]> = {}
  for (const dep of departures) {
    const key = dep.arrival_date.slice(0, 7) // "YYYY-MM"
    if (!groups[key]) groups[key] = []
    groups[key].push(dep)
  }
  return groups
}

export default function DepartureCalendar() {
  const [departures, setDepartures] = useState<Departure[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase
      .from('departures')
      .select('*')
      .eq('is_active', true)
      .gte('arrival_date', new Date().toISOString().slice(0, 10))
      .order('arrival_date', { ascending: true })
      .then(({ data }) => {
        setDepartures(data || [])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div style={{ padding: '20px 0', color: 'var(--muted)', fontSize: 12 }}>Loading departures…</div>
  }

  if (departures.length === 0) {
    return (
      <div style={{ padding: '24px', background: '#f9f8f5', borderRadius: 4, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
        No upcoming departures listed yet. Contact us on WhatsApp to ask about availability.
      </div>
    )
  }

  return (
    <div className="booking-cards-grid" style={{ margin: '22px 0' }}>
      {departures.map(dep => (
        <BookingCard key={dep.id} departure={dep} />
      ))}
    </div>
  )
}
