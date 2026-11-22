'use client'
import { useEffect, useState } from 'react'

type Departure = { id: string; arrival_date: string; is_high_season: boolean; price_low: number | null; price_high: number | null; is_active: boolean; notes: string }

const inp: React.CSSProperties = { border: '1px solid #d9ddd5', borderRadius: 3, padding: '8px 10px', fontSize: 12, fontFamily: 'DM Sans,sans-serif', background: '#fff' }

export default function DeparturesPage() {
  const [deps, setDeps] = useState<Departure[]>([])
  const [form, setForm] = useState({ arrival_date: '', is_high_season: false, price_low: '', price_high: '', notes: '' })
  const [saving, setSaving] = useState(false)
  const [msg, setMsg] = useState('')

  async function load() {
    const d = await fetch('/api/admin/departures').then(r => r.json())
    setDeps(Array.isArray(d) ? d : [])
  }

  useEffect(() => { load() }, [])

  async function addDep(e: React.FormEvent) {
    e.preventDefault(); setSaving(true); setMsg('')
    const body = { arrival_date: form.arrival_date, is_high_season: form.is_high_season, price_low: form.price_low ? Number(form.price_low) : null, price_high: form.price_high ? Number(form.price_high) : null, notes: form.notes, is_active: true }
    const r = await fetch('/api/admin/departures', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setSaving(false)
    if (r.ok) { setMsg('Departure added!'); setForm({ arrival_date: '', is_high_season: false, price_low: '', price_high: '', notes: '' }); load() }
    else setMsg('Failed to add departure.')
  }

  async function toggle(dep: Departure) {
    await fetch(`/api/admin/departures/${dep.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ is_active: !dep.is_active }) })
    load()
  }

  async function deleteDep(id: string) {
    if (!confirm('Delete this departure?')) return
    await fetch(`/api/admin/departures/${id}`, { method: 'DELETE' })
    load()
  }

  return (
    <div>
      <h1 style={{ font: '500 28px Georgia,serif', margin: '0 0 6px' }}>Departure Dates</h1>
      <p style={{ color: '#777', fontSize: 13, margin: '0 0 28px' }}>Manage all departure dates shown on the site.</p>

      {/* Add form */}
      <div style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: '24px 24px 20px', marginBottom: 28 }}>
        <h2 style={{ font: '500 16px Georgia,serif', margin: '0 0 18px' }}>Add New Departure</h2>
        <form onSubmit={addDep}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr) auto', gap: 12, alignItems: 'end' }}>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#444', display: 'block', marginBottom: 5 }}>Arrival Date *</label>
              <input type="date" required style={inp} value={form.arrival_date} onChange={e => setForm(f => ({ ...f, arrival_date: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#444', display: 'block', marginBottom: 5 }}>Price Low (€)</label>
              <input type="number" style={inp} value={form.price_low} onChange={e => setForm(f => ({ ...f, price_low: e.target.value }))} placeholder="2400" />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#444', display: 'block', marginBottom: 5 }}>Price High (€)</label>
              <input type="number" style={inp} value={form.price_high} onChange={e => setForm(f => ({ ...f, price_high: e.target.value }))} placeholder="2700" />
            </div>
            <div>
              <label style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#444', display: 'block', marginBottom: 5 }}>Notes</label>
              <input style={inp} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Optional note" />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 2 }}>
              <input type="checkbox" id="hs" checked={form.is_high_season} onChange={e => setForm(f => ({ ...f, is_high_season: e.target.checked }))} />
              <label htmlFor="hs" style={{ fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>High season</label>
            </div>
            <button type="submit" disabled={saving}
              style={{ background: '#0f2219', color: '#fff', border: 'none', borderRadius: 3, padding: '9px 18px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
              {saving ? '…' : 'Add →'}
            </button>
          </div>
          {msg && <div style={{ marginTop: 10, fontSize: 12, color: msg.includes('!') ? '#065f46' : '#b91c1c' }}>{msg}</div>}
        </form>
      </div>

      {/* Departures table */}
      <div style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f9f8f5', borderBottom: '1px solid #e2e6df' }}>
              {['Date', 'Price', 'Season', 'Status', 'Notes', 'Actions'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#777' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {deps.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '24px 16px', textAlign: 'center', color: '#999' }}>No departures yet. Add one above.</td></tr>
            )}
            {deps.map(dep => (
              <tr key={dep.id} style={{ borderBottom: '1px solid #f0ede7' }}>
                <td style={{ padding: '12px 16px', fontWeight: 600 }}>
                  {new Date(dep.arrival_date + 'T00:00:00').toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  €{dep.price_low ?? '—'}–€{dep.price_high ?? '—'}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 3, background: dep.is_high_season ? '#fff4e5' : '#f0f9ff', color: dep.is_high_season ? '#92400e' : '#0369a1' }}>
                    {dep.is_high_season ? 'High' : 'Standard'}
                  </span>
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => toggle(dep)} style={{ fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 3, border: 'none', cursor: 'pointer', background: dep.is_active ? '#ecfdf5' : '#f4f5f3', color: dep.is_active ? '#065f46' : '#777' }}>
                    {dep.is_active ? 'Active' : 'Hidden'}
                  </button>
                </td>
                <td style={{ padding: '12px 16px', color: '#777' }}>{dep.notes || '—'}</td>
                <td style={{ padding: '12px 16px' }}>
                  <button onClick={() => deleteDep(dep.id)} style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 3, padding: '5px 10px', fontSize: 11, cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
