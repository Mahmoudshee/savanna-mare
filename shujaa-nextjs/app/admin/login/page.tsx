'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      router.push('/admin/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', height: 44, border: '1px solid #2a4a35', borderRadius: 4,
    padding: '0 12px', fontSize: 13, boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif',
    outline: 'none', background: '#1a3828', color: '#f5f0e8',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f2219', display: 'grid', placeItems: 'center', fontFamily: 'DM Sans,sans-serif' }}>
      <div style={{ width: 'min(440px, 90vw)', background: '#152e1e', border: '1px solid #2a4a35', borderRadius: 8, padding: '40px 36px', boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}>

        {/* Logo — centred */}
        <div style={{ marginBottom: 32, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Logo height={52} variant="light" />
          <div style={{ font: '500 9px DM Sans,sans-serif', letterSpacing: '0.3em', color: '#6a9e7f', marginTop: 12, textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        <h1 style={{ font: '500 24px Georgia,serif', margin: '0 0 6px', color: '#f5f0e8' }}>Sign in</h1>
        <p style={{ fontSize: 12, color: '#6a9e7f', margin: '0 0 28px' }}>Access the admin dashboard</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#a8c4b0', display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@savannamare.com"
              style={inp}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#a8c4b0', display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inp}
            />
          </div>

          {error && (
            <div style={{ background: 'rgba(220,80,60,0.15)', border: '1px solid rgba(220,80,60,0.4)', color: '#f87171', padding: '10px 14px', borderRadius: 4, fontSize: 12 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: '#dc7855', color: '#fff', border: 'none', borderRadius: 4, padding: '14px 0', fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 6 }}
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN →'}
          </button>
        </form>



      </div>
    </div>
  )
}
