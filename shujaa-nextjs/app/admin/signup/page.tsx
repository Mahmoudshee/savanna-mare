'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const SETUP_KEY = 'savanna-setup-2026'

export default function AdminSignupPage() {
  const router = useRouter()
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirm: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [msg, setMsg] = useState('')
  const [step, setStep] = useState('')

  function set(k: string, v: string) {
    setForm(f => ({ ...f, [k]: v }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')

    if (form.password !== form.confirm) {
      setMsg('Passwords do not match.')
      setStatus('error')
      return
    }
    if (form.password.length < 8) {
      setMsg('Password must be at least 8 characters.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setStep('Creating your admin account…')

    try {
      // Single server-side call: creates user in Supabase Auth (pre-confirmed)
      // + inserts into admin_users (via DB trigger) + saves local credentials
      const res = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          displayName: form.displayName,
          setupKey: SETUP_KEY,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setMsg(data.error || 'Signup failed. Please try again.')
        setStatus('error')
        return
      }

      setStatus('done')
      setMsg('Account created! Redirecting to sign in…')
      setTimeout(() => router.push('/admin/login'), 2000)

    } catch {
      setMsg('Something went wrong. Please try again.')
      setStatus('error')
    }
  }

  const inp: React.CSSProperties = {
    width: '100%', height: 44, border: '1px solid #d9ddd5', borderRadius: 3,
    padding: '0 12px', fontSize: 13, boxSizing: 'border-box',
    fontFamily: 'DM Sans,sans-serif', outline: 'none', background: '#fafafa',
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f4f5f3', display: 'grid', placeItems: 'center', fontFamily: 'DM Sans,sans-serif' }}>
      <div style={{ width: 'min(440px, 90vw)', background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: '36px 32px', boxShadow: '0 2px 20px rgba(0,0,0,0.07)' }}>

        {/* Logo */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ font: '700 16px DM Sans,sans-serif', letterSpacing: '0.045em', textTransform: 'uppercase', color: '#0f2219' }}>SAVANNA & MARE</div>
          <div style={{ font: '500 9px DM Sans,sans-serif', letterSpacing: '0.23em', color: '#5a8a6a', marginTop: 3, textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        <h1 style={{ font: '500 26px Georgia,serif', margin: '0 0 6px', color: '#1a1a1a' }}>Create admin account</h1>
        <p style={{ fontSize: 12, color: '#777', margin: '0 0 24px', lineHeight: 1.65 }}>
          Your account will be saved in Supabase and you can sign in from anywhere.
        </p>

        {status === 'done' ? (
          <div style={{ background: '#ecfdf5', border: '1px solid #6ee7b7', color: '#065f46', padding: '24px 18px', borderRadius: 4, fontSize: 13, textAlign: 'center', lineHeight: 1.7 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>✅</div>
            <strong>Account created!</strong><br />
            {msg}
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#444', display: 'block', marginBottom: 6 }}>Your name</label>
              <input type="text" required value={form.displayName} onChange={e => set('displayName', e.target.value)} placeholder="e.g. Peter Chacha" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#444', display: 'block', marginBottom: 6 }}>Email address</label>
              <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@savannamare.com" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#444', display: 'block', marginBottom: 6 }}>Password</label>
              <input type="password" required value={form.password} onChange={e => set('password', e.target.value)} placeholder="At least 8 characters" style={inp} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase', color: '#444', display: 'block', marginBottom: 6 }}>Confirm password</label>
              <input type="password" required value={form.confirm} onChange={e => set('confirm', e.target.value)} placeholder="Repeat your password" style={inp} />
            </div>

            {status === 'error' && msg && (
              <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '10px 14px', borderRadius: 4, fontSize: 12 }}>
                {msg}
              </div>
            )}

            {status === 'loading' && (
              <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', color: '#0369a1', padding: '10px 14px', borderRadius: 4, fontSize: 12 }}>
                ⏳ {step}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                background: '#0f2219', color: '#fff', border: 'none', borderRadius: 3,
                padding: '13px 0', fontSize: 12, fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', cursor: status === 'loading' ? 'wait' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1, marginTop: 4,
              }}
            >
              {status === 'loading' ? 'CREATING…' : 'CREATE ACCOUNT →'}
            </button>
          </form>
        )}

        <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid #eee', textAlign: 'center' }}>
          <Link href="/admin/login" style={{ fontSize: 12, color: '#666', textDecoration: 'none' }}>
            ← Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
