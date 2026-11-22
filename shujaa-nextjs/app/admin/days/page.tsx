'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDaysPage() {
  const [days, setDays] = useState<Array<{ id: string; day_number: number; location: string; title: string; hero_image_url: string }>>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  function load() {
    fetch('/api/admin/days').then(r => r.json()).then(d => { setDays(d); setLoading(false) })
  }

  useEffect(() => { load() }, [])

  async function deleteDay(id: string, dayNum: number) {
    if (!confirm(`Delete Day ${dayNum}? This cannot be undone.`)) return
    setDeleting(id)
    await fetch(`/api/admin/days/${id}`, { method: 'DELETE' })
    setDeleting(null)
    load()
  }

  if (loading) return <div style={{ padding: 40, color: '#777' }}>Loading days…</div>

  return (
    <div>
      <h1 style={{ font: '500 28px Georgia,serif', margin: '0 0 6px' }}>Itinerary Days</h1>
      <p style={{ color: '#777', fontSize: 13, margin: '0 0 28px' }}>Click any day to edit its content, images and details. Use Delete to remove a day permanently.</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {days.map(day => (
          <div key={day.id} style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, overflow: 'hidden', position: 'relative' }}>
            {/* Delete button — top right corner */}
            <button
              onClick={e => { e.preventDefault(); e.stopPropagation(); deleteDay(day.id, day.day_number) }}
              disabled={deleting === day.id}
              title="Delete this day"
              style={{
                position: 'absolute', top: 8, right: 8, zIndex: 2,
                background: 'rgba(255,255,255,0.92)', color: '#b91c1c',
                border: '1px solid #fca5a5', borderRadius: 4,
                padding: '4px 8px', fontSize: 11, fontWeight: 700,
                cursor: 'pointer', lineHeight: 1,
                backdropFilter: 'blur(2px)',
              }}
            >
              {deleting === day.id ? '…' : '🗑 Delete'}
            </button>

            <Link href={`/admin/days/${day.id}`} style={{ textDecoration: 'none', display: 'block' }}>
              <div
                style={{ cursor: 'pointer' }}
                onMouseEnter={e => ((e.currentTarget.closest('[style]') as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)')}
                onMouseLeave={e => ((e.currentTarget.closest('[style]') as HTMLElement).style.boxShadow = 'none')}
              >
                {day.hero_image_url
                  ? <img src={day.hero_image_url} alt="" style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  : <div style={{ width: '100%', height: 140, background: '#e8f4ee', display: 'grid', placeItems: 'center', fontSize: 32 }}>🌍</div>
                }
                <div style={{ padding: '14px 16px' }}>
                  <div style={{ fontSize: 10, fontWeight: 800, color: '#5a8a6a', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>
                    Day {day.day_number} · {day.location}
                  </div>
                  <div style={{ font: '500 16px Georgia,serif', color: '#1a1a1a' }}>{day.title || 'Untitled'}</div>
                  <div style={{ fontSize: 11, color: '#6a9e7f', marginTop: 8, fontWeight: 600 }}>✏️ Click to edit →</div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
