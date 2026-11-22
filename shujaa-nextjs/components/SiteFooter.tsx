'use client'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type Settings = Record<string, string>

export default function SiteFooter() {
  const [s, setS] = useState<Settings>({})

  useEffect(() => {
    supabase.from('site_settings').select('key,value').then(({ data }) => {
      if (data) setS(Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value])))
    })
  }, [])

  const whatsapp = s.whatsapp_number || '254115119090'
  const whatsappMsg = s.whatsapp_message || "Hello Savanna & Mare Adventures, I'd like to ask about the Kenya trip."
  const description = s.footer_description || 'Small-group safaris and coastal journeys rooted in local knowledge and genuine care. Founded by Emmanuel Mweu & Peter Chacha.'
  const phone = s.contact_phone || '+254 115 119 090'
  const address = s.contact_address || 'Mombasa, Kenya'

  return (
    <footer style={{ background: '#0f2219', color: '#c8d8c5' }}>
      {/* Top section */}
      <div className="shell footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr 1fr 1fr', gap: 48, padding: '56px 3% 48px' }}>
        {/* Brand column */}
        <div>
          <Link href="/" style={{ display: 'inline-block', marginBottom: 16 }}>
            <Logo height={42} variant="light" />
          </Link>
          <p style={{ fontSize: 12, lineHeight: 1.75, color: '#8ba896', maxWidth: 240 }}>
            {description}
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
            <a href={`https://wa.me/${whatsapp}?text=${encodeURIComponent(whatsappMsg)}`} target="_blank" rel="noopener noreferrer"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#25D366', color: '#fff', padding: '10px 16px', borderRadius: 4, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.374 0 0 5.373 0 12c0 2.117.549 4.107 1.504 5.838L.072 23.928l6.264-1.44A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.774 9.774 0 01-5.044-1.4l-.36-.214-3.738.859.882-3.638-.235-.374A9.773 9.773 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>
              WhatsApp
            </a>
          </div>
        </div>

        {/* Trip links */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 16 }}>The Trip</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {[
              ['Overview',            '/'],
              ['Itinerary',           '/'],
              ['Tour Package',        '/'],
              ['Your Hosts & Contact','/'],
            ].map(([label, href]) => (
              <Link key={label} href={href} style={{ fontSize: 12, color: '#8ba896', transition: 'color 0.15s' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = '#8ba896')}>
                {label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Destinations */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 16 }}>Destinations</div>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {['Mombasa · Day 1 & 9', 'Tsavo East · Days 2–5', "Marafa (Hell's Kitchen)", 'Watamu Marine Park', 'Sardegna Due Island', 'Gede Ruins'].map(place => (
              <span key={place} style={{ fontSize: 12, color: '#8ba896' }}>{place}</span>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 16 }}>Contact</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 13, fontSize: 12, color: '#8ba896' }}>
            <div>
              <div style={{ color: '#c8d8c5', fontWeight: 600, marginBottom: 3 }}>WhatsApp</div>
              <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: '#8ba896' }}>{phone}</a>
            </div>
            <div>
              <div style={{ color: '#c8d8c5', fontWeight: 600, marginBottom: 3 }}>Departure base</div>
              <span>{address}</span>
            </div>
            <div>
              <div style={{ color: '#c8d8c5', fontWeight: 600, marginBottom: 3 }}>Payment</div>
              <span>EUR · USD · GBP</span>
            </div>

          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #1f3d2e' }} />

      {/* Bottom bar */}
      <div className="shell footer-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 3%', fontSize: 10, color: '#4a6358' }}>
        <span>© {new Date().getFullYear()} Savanna &amp; Mare Adventures. Founded and owned by Emmanuel Mweu &amp; Peter Chacha.</span>
        <span>Mombasa · Tsavo East · Watamu · Kenya</span>
      </div>
    </footer>
  )
}
