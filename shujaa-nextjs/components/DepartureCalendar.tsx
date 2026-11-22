'use client'
import { useState, useEffect } from 'react'
import type { Departure } from '@/lib/types'

interface DepartureCalendarProps {
  departures: Departure[]
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const HIGH_SEASON_MONTHS = [6, 7, 10, 11] // Jul, Aug, Nov, Dec (0-indexed)

function scheduledFridays(year: number, month: number) {
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const firstWeekday = new Date(year, month, 1).getDay()
  const lastWeekday = new Date(year, month, daysInMonth).getDay()
  return {
    early: 1 + ((5 - firstWeekday + 7) % 7),
    late: daysInMonth - ((lastWeekday - 5 + 7) % 7),
  }
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric', month: 'short', year: 'numeric',
  }).format(d)
}

function formatWeekday(d: Date) {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long' }).format(d)
}

function BookingCard({
  year, month, day, windowName, highSeason,
}: {
  year: number; month: number; day: number; windowName: string; highSeason: boolean
}) {
  const arrival = new Date(year, month, day)
  const departure = new Date(year, month, day + 8)
  const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`

  const handleBook = () => {
    const params = new URLSearchParams({
      date: `${MONTH_NAMES[month]} ${day}, ${year}`,
      window: windowName,
      price: highSeason ? 'up to €2,700 per person' : 'from €2,400 per person',
    })
    window.location.href = `/booking?${params}`
  }

  return (
    <article className="booking-card">
      <div className="booking-dates" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 30px minmax(0,1fr)', alignItems: 'center', gap: 6 }}>
        <div>
          <div className="booking-date-label" style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 5 }}>ARRIVE</div>
          <div className="booking-date-value" style={{ fontSize: 'clamp(14px,1.8vw,20px)', fontWeight: 800, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{formatDate(arrival)}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 5, lineHeight: 1.4 }}>{formatWeekday(arrival)} · City Blue Creekside Hotel</div>
        </div>
        <div style={{ height: 26, width: 26, display: 'grid', placeItems: 'center', borderRadius: '50%', background: '#20211f', color: '#fff', fontSize: 13, margin: 'auto' }}>➜</div>
        <div>
          <div className="booking-date-label" style={{ fontSize: 9, color: 'var(--muted)', marginBottom: 5 }}>DEPART</div>
          <div className="booking-date-value" style={{ fontSize: 'clamp(14px,1.8vw,20px)', fontWeight: 800, lineHeight: 1.2, whiteSpace: 'nowrap' }}>{formatDate(departure)}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', marginTop: 5, lineHeight: 1.4 }}>{formatWeekday(departure)} · 9 days / 8 nights</div>
        </div>
      </div>

      <div style={{ display: 'inline-block', margin: '17px 0 12px', background: '#e8f7ec', color: '#245a38', borderRadius: 3, padding: '7px 10px', fontSize: 10, fontWeight: 800 }}>
        Available to book
      </div>

      <div style={{ background: '#f4f5f3', textAlign: 'center', padding: '13px 10px', marginBottom: 12 }}>
        <div style={{ fontSize: 'clamp(23px,3vw,32px)', fontWeight: 800, lineHeight: 1.15, color: '#20211f' }}>
          {highSeason ? 'Up to €2,700' : 'From €2,400'}
        </div>
        <div style={{ fontSize: 10, color: '#515c54', marginTop: 5 }}>
          per person · EUR · {highSeason ? 'high-season fare' : 'seasonal fare'}
        </div>
      </div>
      <div style={{ textAlign: 'center', fontSize: 10, color: '#515c54', paddingBottom: 13 }}>
        Private room available for an extra €560
      </div>

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

export default function DepartureCalendar({ departures }: DepartureCalendarProps) {
  const now = new Date()
  const startYear = now.getFullYear()

  const months = Array.from({ length: 12 }, (_, offset) => {
    const monthIndex = (9 + offset) % 12
    const year = startYear + Math.floor((9 + offset) / 12)
    return { monthIndex, year }
  })

  return (
    <div className="departure-month-list" style={{ display: 'grid', gap: 12, margin: '22px 0' }}>
      {months.map(({ monthIndex, year }) => {
        const dates = scheduledFridays(year, monthIndex)
        const highSeason = HIGH_SEASON_MONTHS.includes(monthIndex)
        return (
          <details key={`${year}-${monthIndex}`} className="departure-month-group" open>
            <summary>
              <span>{MONTH_NAMES[monthIndex]} {year}</span>
              <span style={{ font: '700 10px var(--font-dm-sans,DM Sans),sans-serif', color: 'var(--muted)', whiteSpace: 'nowrap' }}>2 Friday departures</span>
            </summary>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 14, padding: '0 16px 16px' }}>
              <BookingCard year={year} month={monthIndex} day={dates.early} windowName="Arrival · first Friday (days 1–9)" highSeason={highSeason} />
              <BookingCard year={year} month={monthIndex} day={dates.late} windowName="Arrival · last Friday (final 9 days)" highSeason={highSeason} />
            </div>
          </details>
        )
      })}
    </div>
  )
}
