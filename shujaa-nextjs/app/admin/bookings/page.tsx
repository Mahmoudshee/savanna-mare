'use client'
import { useEffect, useState } from 'react'

type Booking = { id: string; first_name: string; surname: string; email: string; phone: string; room_preference: string; status: string; created_at: string; notes?: string }

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(true)

  async function load() {
    const d = await fetch('/api/admin/bookings').then(r => r.json())
    setBookings(Array.isArray(d) ? d : []); setLoading(false)
  }
  useEffect(() => { load() }, [])

  async function setStatus(id: string, status: string) {
    await fetch('/api/admin/bookings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, status }) })
    load()
  }

  const shown = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)

  const statusColor = (s: string) => s === 'confirmed' ? { bg: '#ecfdf5', c: '#065f46' } : s === 'cancelled' ? { bg: '#fef2f2', c: '#b91c1c' } : { bg: '#fefce8', c: '#854d0e' }

  return (
    <div>
      <h1 style={{ font: '500 28px Georgia,serif', margin: '0 0 6px' }}>Enquiries & Bookings</h1>
      <p style={{ color: '#777', fontSize: 13, margin: '0 0 20px' }}>All enquiries submitted via the booking form.</p>

      {/* Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {['all', 'pending', 'confirmed', 'cancelled'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            style={{ padding: '7px 16px', border: 'none', borderRadius: 20, fontSize: 11, fontWeight: 700, cursor: 'pointer', background: filter === f ? '#0f2219' : '#f4f5f3', color: filter === f ? '#fff' : '#555', textTransform: 'capitalize' }}>
            {f === 'all' ? `All (${bookings.length})` : `${f.charAt(0).toUpperCase() + f.slice(1)} (${bookings.filter(b => b.status === f).length})`}
          </button>
        ))}
      </div>

      {loading && <div style={{ padding: 40, color: '#777', textAlign: 'center' }}>Loading…</div>}

      {!loading && shown.length === 0 && (
        <div style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: '48px 24px', textAlign: 'center', color: '#999', fontSize: 13 }}>
          No {filter !== 'all' ? filter : ''} enquiries yet.
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {shown.map(b => {
          const sc = statusColor(b.status)
          return (
            <div key={b.id} style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: '18px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                <div>
                  <div style={{ font: '600 16px DM Sans,sans-serif', marginBottom: 2 }}>{b.first_name} {b.surname}</div>
                  <div style={{ fontSize: 12, color: '#777' }}>
                    <a href={`mailto:${b.email}`} style={{ color: '#5a8a6a' }}>{b.email}</a>
                    {b.phone && <> · <a href={`tel:${b.phone}`} style={{ color: '#5a8a6a' }}>{b.phone}</a></>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 20, background: sc.bg, color: sc.c, textTransform: 'capitalize' }}>{b.status}</span>
                  <span style={{ fontSize: 10, color: '#aaa' }}>{new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 16, fontSize: 11, color: '#777', marginBottom: 12 }}>
                {b.room_preference && <span>🛏 {b.room_preference}</span>}
              </div>
              {b.notes && <div style={{ fontSize: 12, background: '#f9f8f5', borderRadius: 4, padding: '10px 12px', marginBottom: 12, color: '#555', lineHeight: 1.6 }}>{b.notes}</div>}
              <div style={{ display: 'flex', gap: 8 }}>
                {b.status !== 'confirmed' && (
                  <button onClick={() => setStatus(b.id, 'confirmed')}
                    style={{ background: '#ecfdf5', color: '#065f46', border: '1px solid #6ee7b7', borderRadius: 3, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    ✓ Confirm
                  </button>
                )}
                {b.status !== 'cancelled' && (
                  <button onClick={() => setStatus(b.id, 'cancelled')}
                    style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 3, padding: '5px 12px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
                    ✕ Cancel
                  </button>
                )}
                {b.status !== 'pending' && (
                  <button onClick={() => setStatus(b.id, 'pending')}
                    style={{ background: '#f4f5f3', color: '#555', border: '1px solid #d9ddd5', borderRadius: 3, padding: '5px 12px', fontSize: 11, cursor: 'pointer' }}>
                    Reset to pending
                  </button>
                )}
                <a href={`https://wa.me/${(b.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  style={{ background: '#25D366', color: '#fff', border: 'none', borderRadius: 3, padding: '5px 12px', fontSize: 11, fontWeight: 700, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  WhatsApp
                </a>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
