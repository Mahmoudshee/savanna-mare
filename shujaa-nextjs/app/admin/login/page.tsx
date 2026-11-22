'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

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
    width: '100%', height: 44, border: '1px solid #d9ddd5', borderRadius: 3,
    padding: '0 12px', fontSize: 13, boxSizing: 'border-box', fontFamily: 'DM Sans,sans-serif',
    outline: 'none', background: '#fafafa',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f3', display: 'grid', placeItems: 'center', fontFamily: 'DM Sans,sans-serif' }}>
      <div style={{ width: 'min(420px, 90vw)', background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: '36px 32px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>

        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ font: '700 16px DM Sans,sans-serif', letterSpacing: '0.045em', textTransform: 'uppercase', color: '#0f2219' }}>SAVANNA & MARE</div>
          <div style={{ font: '500 9px DM Sans,sans-serif', letterSpacing: '0.23em', color: '#5a8a6a', marginTop: 3, textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        <h1 style={{ font: '500 26px Georgia,serif', margin: '0 0 6px', color: '#1a1a1a' }}>Sign in</h1>
        <p style={{ fontSize: 12, color: '#777', margin: '0 0 24px' }}>Access the admin dashboard</p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#444', display: 'block', marginBottom: 6 }}>Email</label>
            <input
              type="email" required value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@savannamare.com"
              style={inp}
            />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#444', display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password" required value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={inp}
            />
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px 14px', borderRadius: 4, fontSize: 12 }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ background: '#0f2219', color: '#fff', border: 'none', borderRadius: 3, padding: '13px 0', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1, marginTop: 4 }}
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN →'}
          </button>
        </form>

        {/* Signup link */}
        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #eee', textAlign: 'center' }}>
          <span style={{ fontSize: 12, color: '#888' }}>No admin account yet? </span>
          <Link href="/admin/signup" style={{ fontSize: 12, color: '#0f2219', fontWeight: 700, textDecoration: 'underline' }}>
            Create admin account
          </Link>
        </div>

      </div>
    </div>
  )
}
