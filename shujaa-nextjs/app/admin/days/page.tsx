'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDaysPage() {
  const [days, setDays] = useState<Array<{ id: string; day_number: number; location: string; title: string; hero_image_url: string }>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/admin/days').then(r => r.json()).then(d => { setDays(d); setLoading(false) })
  }, [])

  if (loading) return <div style={{ padding: 40, color: '#777' }}>Loading days…</div>

  return (
    <div>
      <h1 style={{ font: '500 28px Georgia,serif', margin: '0 0 6px' }}>Itinerary Days</h1>
      <p style={{ color: '#777', fontSize: 13, margin: '0 0 28px' }}>Click any day to edit its content, images and details.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {days.map(day => (
          <Link key={day.id} href={`/admin/days/${day.id}`} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, overflow: 'hidden', transition: 'box-shadow 0.2s', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
              onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}>
              {day.hero_image_url
                ? <img src={day.hero_image_url} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                : <div style={{ width: '100%', height: 140, background: '#e8f4ee', display: 'grid', placeItems: 'center', fontSize: 32 }}>🌍</div>
              }
              <div style={{ padding: '14px 16px' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#5a8a6a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                  Day {day.day_number} · {day.location}
                </div>
                <div style={{ font: '500 16px Georgia,serif', color: '#1a1a1a' }}>{day.title || 'Untitled'}</div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
