'use client'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import SiteFooter from '@/components/SiteFooter'

const W3F_KEY = 'b14304cf-3a64-408c-a302-d6d49852e0dd'

const field = {
  height: 44,
  border: '1px solid #d9ddd5',
  padding: '0 12px',
  background: '#fff',
  color: 'var(--ink)',
  font: '13px DM Sans,sans-serif',
  borderRadius: 3,
  width: '100%',
  boxSizing: 'border-box' as const,
}

function EnquiryForm() {
  const params = useSearchParams()
  const router = useRouter()
  const date     = params.get('date')    || ''
  const window_  = params.get('window')  || ''
  const price    = params.get('price')   || ''

  const [status, setStatus] = useState<'idle'|'sending'|'sent'|'error'>('idle')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('sending')
    const form = e.currentTarget
    const data: Record<string, string> = {
      access_key: W3F_KEY,
      subject: `New trip enquiry — Savanna & Mare Adventures${date ? ` (${date})` : ''}`,
    }
    new FormData(form).forEach((v, k) => { data[k] = v.toString() })
    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      setStatus(json.success ? 'sent' : 'error')
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      {/* Header */}
      <div style={{ background: '#0f2219', borderBottom: '1px solid #1a3528' }}>
        <div style={{ background: '#18352b', textAlign: 'center', fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#c8d8c5', padding: '7px 0' }}>
          Savanna & Mare Adventures · Kenya coast & safari
        </div>
        <div className="shell" style={{ display: 'flex', alignItems: 'center', height: 58, justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Logo height={36} variant="light" />
          </Link>
          <Link href="/" style={{ fontSize: 11, fontWeight: 700, color: '#c8d8c5', textDecoration: 'none' }}>← Back to site</Link>
        </div>
      </div>

      <main className="shell-sm" style={{ padding: '48px 3% 80px' }}>

        {status === 'sent' ? (
          /* ── SUCCESS STATE ── */
          <div style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 20 }}>🎉</div>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 8 }}>Enquiry received</div>
            <h1 style={{ font: '500 36px var(--font-playfair,Playfair Display),serif', margin: '0 0 16px' }}>Thank you!</h1>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 32px' }}>
              We have received your enquiry and will get back to you personally within a few hours on WhatsApp or email.
            </p>
            <Link href="/" className="btn-primary" style={{ display: 'inline-block', padding: '14px 28px', borderRadius: 3, textDecoration: 'none' }}>
              Back to the site
            </Link>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase' }}>
              Trip Enquiry
            </div>
            <h1 style={{ font: '500 clamp(28px,5vw,42px)/1.1 var(--font-playfair,Playfair Display),serif', margin: '8px 0 10px' }}>
              Send us your details
            </h1>
            <p style={{ fontSize: 13, lineHeight: 1.75, color: 'var(--muted)', maxWidth: 580, margin: '0 0 28px' }}>
              Fill in the form below and we will get back to you personally. No account needed — just your name, contact and preferred dates.
            </p>

            {/* Selected departure banner */}
            {date && (
              <div style={{ background: '#e8f4ee', border: '1px solid #b8d8c4', padding: '14px 18px', marginBottom: 28, borderRadius: 4, fontSize: 13, lineHeight: 1.7 }}>
                📅 <strong>Selected arrival:</strong> {date}{window_ ? ` · ${window_}` : ''}{price ? ` · from ${price} per person` : ''}<br />
                <span style={{ fontSize: 11, color: '#5a7a68' }}>Meet at City Blue Creekside Hotel, Mombasa</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ background: '#fff', border: '1px solid var(--line)', padding: '32px 28px', borderRadius: 6 }}>
              {/* Hidden fields for Web3Forms */}
              <input type="hidden" name="access_key" value={W3F_KEY} />
              <input type="hidden" name="subject" value={`Trip enquiry — Savanna & Mare Adventures${date ? ` (${date})` : ''}`} />
              {date     && <input type="hidden" name="Selected Date"   value={date} />}
              {window_  && <input type="hidden" name="Departure Window" value={window_} />}
              {price    && <input type="hidden" name="Price Quoted"    value={price} />}
              {/* Honeypot */}
              <input type="checkbox" name="botcheck" style={{ display: 'none' }} />

              {/* Personal details */}
              <h2 style={{ font: '500 20px var(--font-playfair,Playfair Display),serif', margin: '0 0 20px', borderBottom: '1px solid var(--line)', paddingBottom: 12 }}>
                Your details
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,minmax(0,1fr))', gap: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700 }}>First name *</label>
                  <input name="First Name" type="text" required autoComplete="given-name" style={field} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700 }}>Surname *</label>
                  <input name="Surname" type="text" required autoComplete="family-name" style={field} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700 }}>Email address *</label>
                  <input name="email" type="email" required autoComplete="email" style={field} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700 }}>Phone / WhatsApp *</label>
                  <input name="Phone / WhatsApp" type="tel" required autoComplete="tel" style={field} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700 }}>Nationality</label>
                  <input name="Nationality" type="text" autoComplete="country-name" style={field} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={{ fontSize: 11, fontWeight: 700 }}>Number of travellers</label>
                  <select name="Number of Travellers" style={{ ...field, height: 44, cursor: 'pointer' }}>
                    {['1','2','3','4','5','6+'].map(n => <option key={n}>{n}</option>)}
                  </select>
                </div>
              </div>

              {/* Room preference */}
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 8 }}>Room preference</label>
                <div style={{ display: 'flex', gap: 16 }}>
                  {['Shared room (lower price)', 'Own room (supplement applies)'].map(opt => (
                    <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, cursor: 'pointer' }}>
                      <input type="radio" name="Room Preference" value={opt} defaultChecked={opt.startsWith('Shared')} />
                      {opt}
                    </label>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: 24 }}>
                <label style={{ fontSize: 11, fontWeight: 700, display: 'block', marginBottom: 6 }}>Message or questions (optional)</label>
                <textarea name="message" rows={4}
                  placeholder="Tell us your preferred dates, any dietary needs, or anything else you'd like to know…"
                  style={{ ...field, height: 'auto', padding: '10px 12px', resize: 'vertical', lineHeight: 1.6 }} />
              </div>

              <p style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 20 }}>
                By submitting this form you agree for us to contact you regarding your enquiry. We do not share your data with third parties.
              </p>

              {status === 'error' && (
                <div style={{ background: '#fef2f2', color: '#a43d2c', padding: '12px 16px', borderRadius: 4, fontSize: 12, marginBottom: 16 }}>
                  Something went wrong — please try again or message us on WhatsApp.
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="submit" className="btn-primary" disabled={status === 'sending'}
                  style={{ padding: '14px 32px', borderRadius: 3, opacity: status === 'sending' ? 0.7 : 1 }}>
                  {status === 'sending' ? 'SENDING…' : 'SEND ENQUIRY →'}
                </button>
              </div>
            </form>
          </>
        )}
      </main>

      <SiteFooter />
    </>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div style={{ padding: '5vw', textAlign: 'center' }}>Loading…</div>}>
      <EnquiryForm />
    </Suspense>
  )
}
