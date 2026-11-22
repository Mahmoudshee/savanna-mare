'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getHomeContent, getSiteSettings, getAllDays } from '@/lib/content-client'
import SiteFooter from '@/components/SiteFooter'
import VideoModal from '@/components/VideoModal'
import DepartureCalendar from '@/components/DepartureCalendar'
import type { HomeContent, ItineraryDay } from '@/lib/types'

const TABS = [
  { id: 'overview',  label: 'Overview' },
  { id: 'itinerary', label: 'Itinerary' },
  { id: 'package',   label: 'Tour Package' },
  { id: 'contact',   label: 'Your Hosts & Contact' },
]

export default function HomePage() {
  const [home, setHome] = useState<HomeContent | null>(null)
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [days, setDays] = useState<ItineraryDay[]>([])
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    Promise.all([getHomeContent(), getSiteSettings(), getAllDays()]).then(([h, s, d]) => {
      setHome(h)
      setSettings(s)
      setDays(d)
    })
  }, [])

  const waUrl = `https://wa.me/${settings.whatsapp_number || '254115119090'}?text=${encodeURIComponent(settings.whatsapp_message || "Hello Savanna & Mare Adventures, I'd like to ask about the Kenya trip.")}`

  return (
    <>
      {/* ── SINGLE UNIFIED HEADER ── */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100, background: '#0f2219', borderBottom: '1px solid #1a3528' }}>
        {/* Announcement bar */}
        <div style={{ background: '#18352b', textAlign: 'center', fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#c8d8c5', padding: '7px 0' }}>
          {settings.bar_text || 'Small groups · local knowledge · journeys made with care'}
        </div>

        {/* Logo | Tabs | Actions — all in one row */}
        <div className="shell header-row">
          {/* Brand */}
          <Link href="/" style={{ flexShrink: 0, marginRight: 40, textDecoration: 'none' }}>
            <div style={{ font: '700 15px DM Sans,sans-serif', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#fff', lineHeight: 1 }}>SAVANNA</div>
            <div style={{ font: '500 7.5px DM Sans,sans-serif', letterSpacing: '0.22em', textTransform: 'uppercase', color: '#6a9e7f', marginTop: 3 }}>& MARE ADVENTURES</div>
          </Link>

          {/* Tabs */}
          <nav className="header-tabs-nav" style={{}}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`site-tab-btn${activeTab === tab.id ? ' active' : ''}`}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="header-wa-btn" style={{ flexShrink: 0, marginLeft: 16 }}>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#25D366', padding: '8px 14px', borderRadius: 3, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              WhatsApp ↗
            </a>
          </div>
        </div>
      </div>

      {/* ── HERO GALLERY ── */}
      {home && (
        <div className="shell" style={{ paddingTop: 20 }}>
          <div className="gallery-grid" style={{ position: 'relative' }}>
            {home.gallery_images_json.map((img, i) => (
              <div key={i} className={`gphoto${i === 0 ? ' gmain' : ''}`} role="img" aria-label={img.alt}
                style={{ backgroundImage: `url('${img.url}')` }} />
            ))}
            <VideoModal youtubeId={home.video_youtube_id} label="Watch Tsavo East film" />
            <button style={{ position: 'absolute', right: 16, bottom: 15, border: 0, borderRadius: 2, background: '#fff', padding: '10px 13px', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
              View all photos ↗
            </button>
          </div>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      {home ? (
        <div className="shell">
          <div className="main-content-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 340px', gap: 52, padding: '40px 0 80px', alignItems: 'start' }}>
            <article>

              {/* ══ OVERVIEW ══ */}
              {activeTab === 'overview' && (
                <section>
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase' }}>{home.label}</div>
                    <h1 style={{ font: '500 clamp(34px,4vw,56px)/1.04 var(--font-playfair,Playfair Display),serif', letterSpacing: '-1.2px', margin: '8px 0 12px' }}>{home.title}</h1>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.75, margin: '0 0 14px', maxWidth: 680 }}>{home.subtitle}</p>
                    <div style={{ fontSize: 11, color: '#6d776e' }}>
                      <span style={{ color: '#dc7855', letterSpacing: 2 }}>★★★★★</span>&nbsp; Hosted by <strong style={{ color: 'var(--ink)' }}>Emmanuel Mweu & Peter Chacha</strong>
                    </div>
                  </div>

                  {/* Facts strip */}
                  <div className="facts-strip">
                    {home.facts_json.map((f, i) => (
                      <div key={i} className="fact-item">
                        <small style={{ display: 'block', color: '#8b9288', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.13em', marginBottom: 5 }}>{f.label}</small>
                        <strong style={{ fontSize: 12 }}>{f.value}</strong>
                      </div>
                    ))}
                  </div>

                  {/* Intro text */}
                  <div style={{ fontSize: 15, lineHeight: 1.9, color: '#56635a' }}>
                    <em style={{ color: 'var(--ink)', fontFamily: 'var(--font-playfair,Playfair Display),serif', fontSize: 21, fontStyle: 'italic', display: 'block', marginBottom: 18 }}>
                      {home.intro_quote}
                    </em>
                    <p style={{ margin: 0 }}>{home.intro_body}</p>
                  </div>

                  {/* Big Five preview */}
                  <div style={{ marginTop: 48, borderTop: '1px solid var(--line)', paddingTop: 36 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 6 }}>Wildlife encounters</div>
                    <h2 style={{ font: '500 28px var(--font-playfair,Playfair Display),serif', margin: '0 0 20px', letterSpacing: '-0.5px' }}>The Big Five in Tsavo East</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,minmax(0,1fr))', gap: 10 }}>
                      {home.big_five_json.map((animal, i) => (
                        <figure key={i} style={{ margin: 0, background: '#fff', border: '1px solid var(--line)', overflow: 'hidden', borderRadius: 4 }}>
                          <img src={animal.image} alt={animal.name} loading="lazy" style={{ display: 'block', width: '100%', height: 140, objectFit: 'cover' }} />
                          <figcaption style={{ padding: '10px 12px 12px' }}>
                            <strong style={{ display: 'block', font: '500 16px var(--font-playfair,Playfair Display),serif' }}>{animal.name}</strong>
                            <small style={{ display: 'block', marginTop: 4, color: 'var(--muted)', fontSize: 9, lineHeight: 1.5 }}>{animal.caption}</small>
                          </figcaption>
                        </figure>
                      ))}
                    </div>
                  </div>

                  {/* CTA */}
                  <div style={{ marginTop: 40, display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                    <button className="btn-primary" onClick={() => setActiveTab('itinerary')} style={{ padding: '14px 28px', borderRadius: 3 }}>
                      VIEW ITINERARY →
                    </button>
                    <button onClick={() => setActiveTab('package')}
                      style={{ padding: '13px 28px', background: 'transparent', border: '1px solid var(--ink)', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', cursor: 'pointer', borderRadius: 3 }}>
                      SEE PRICING & DATES
                    </button>
                  </div>
                </section>
              )}

              {/* ══ ITINERARY ══ */}
              {activeTab === 'itinerary' && (
                <section>
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase' }}>Nine days in Kenya</div>
                    <h2 style={{ font: '500 34px var(--font-playfair,Playfair Display),serif', margin: '6px 0', letterSpacing: '-0.5px' }}>Your journey, day by day</h2>
                    <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>Mombasa · Tsavo East · Marafa · Watamu</p>
                  </div>
                  <div className="days-grid">
                    {days.map((day) => (
                      <Link key={day.day_number} href={`/day/${day.day_number}`}
                        style={{ display: 'block', border: '1px solid var(--line)', background: '#fff', padding: 20, minHeight: 150, color: 'inherit', textDecoration: 'none', position: 'relative', paddingBottom: 36, borderRadius: 4, transition: 'box-shadow 0.2s' }}>
                        <small style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--coral)', fontWeight: 800 }}>
                          Day {String(day.day_number).padStart(2, '0')} · {day.location}
                        </small>
                        <h3 style={{ font: '500 19px var(--font-playfair,Playfair Display),serif', margin: '9px 0 6px' }}>
                          {day.title}
                        </h3>
                        <p style={{ fontSize: 11, color: 'var(--muted)', margin: 0, lineHeight: 1.5 }}>
                          {day.subtitle}
                        </p>
                        <span style={{ position: 'absolute', bottom: 14, fontSize: 10, color: 'var(--coral)', fontWeight: 700 }}>Read day {day.day_number} →</span>
                      </Link>
                    ))}
                  </div>
                  <p style={{ fontSize: 10, color: '#858d82', marginTop: 14 }}>Click any day for the full story, photos and videos.</p>
                </section>
              )}

              {/* ══ TOUR PACKAGE ══ */}
              {activeTab === 'package' && (
                <section>
                  {/* Pricing */}
                  <div style={{ marginBottom: 36 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase' }}>Pricing</div>
                    <h2 style={{ font: '500 34px var(--font-playfair,Playfair Display),serif', margin: '6px 0 4px', letterSpacing: '-0.5px' }}>
                      €{home.price_low.toLocaleString()}–€{home.price_high.toLocaleString()} <span style={{ font: '400 16px DM Sans,sans-serif', color: 'var(--muted)' }}>/ person</span>
                    </h2>
                    <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>July, August, November & December are high season (up to €2,700). All other months from €2,400.</p>
                  </div>

                  {/* What's included */}
                  <div style={{ marginBottom: 36 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 14 }}>What's included</div>
                    <div className="inclusions-grid">
                      {home.inclusions_json.map((item, i) => (
                        <div key={i} className="include-item">
                          <b style={{ color: 'var(--moss)', fontSize: 15 }}>✳</b>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Not included */}
                  <div style={{ marginBottom: 36, padding: '24px', background: '#fdf9f4', border: '1px solid var(--line)', borderRadius: 4 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 10 }}>Not included</div>
                    <p style={{ fontSize: 14, lineHeight: 1.9, color: '#56635a', margin: 0 }}>{home.not_included_text}</p>
                  </div>

                  {/* Departure calendar */}
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 14 }}>Departure dates</div>
                    <DepartureCalendar departures={[]} />
                    <p style={{ fontSize: 10, color: 'var(--muted)', lineHeight: 1.7, marginTop: 14 }}>
                      Two Friday departures each month. Trips confirm at 6 travellers, maximum 15.
                      Reserve for €0 · €200 deposit once confirmed · instalments available until 31 days before departure.
                    </p>
                  </div>

                  <div style={{ marginTop: 32 }}>
                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 3, textDecoration: 'none' }}>
                      ENQUIRE ON WHATSAPP ↗
                    </a>
                  </div>
                </section>
              )}

              {/* ══ YOUR HOSTS & CONTACT ══ */}
              {activeTab === 'contact' && (
                <section>
                  {/* Hosts */}
                  <div style={{ marginBottom: 40 }}>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 6 }}>Meet the team</div>
                    <h2 style={{ font: '500 34px var(--font-playfair,Playfair Display),serif', margin: '0 0 24px', letterSpacing: '-0.5px' }}>{home.hosts_name}</h2>
                    <div style={{ background: 'var(--sand)', padding: 32, display: 'flex', alignItems: 'flex-start', gap: 28, borderRadius: 4 }}>
                      <div style={{ width: 72, height: 72, flexShrink: 0, display: 'grid', placeItems: 'center', borderRadius: '50%', background: 'var(--green)', color: '#fff', font: 'italic 15px var(--font-playfair,Playfair Display),serif', textAlign: 'center' }}>EM · PC</div>
                      <div>
                        <h3 style={{ font: '500 22px var(--font-playfair,Playfair Display),serif', margin: '0 0 10px' }}>{home.hosts_name}</h3>
                        <p style={{ fontSize: 14, lineHeight: 1.75, color: '#657268', margin: 0 }}>{home.hosts_bio}</p>
                      </div>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <div style={{ fontSize: 9, fontWeight: 800, color: 'var(--moss)', letterSpacing: '0.17em', textTransform: 'uppercase', marginBottom: 20 }}>Get in touch</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 28 }}>
                      {[
                        { icon: '📱', label: 'WhatsApp', value: '+254 115 119 090', href: waUrl },
                        { icon: '📍', label: 'Base', value: 'Mombasa, Kenya', href: null },
                        { icon: '💶', label: 'Payment', value: 'EUR · USD · GBP accepted', href: null },
                        { icon: '🕐', label: 'Response time', value: 'Within a few hours', href: null },
                      ].map(({ icon, label, value, href }) => (
                        <div key={label} style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 6, padding: '20px 22px' }}>
                          <div style={{ fontSize: 20, marginBottom: 8 }}>{icon}</div>
                          <div style={{ fontSize: 10, color: 'var(--muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{label}</div>
                          {href
                            ? <a href={href} target="_blank" rel="noopener noreferrer" style={{ fontSize: 15, fontWeight: 600, color: 'var(--green)', textDecoration: 'none' }}>{value}</a>
                            : <div style={{ fontSize: 14, color: 'var(--ink)' }}>{value}</div>}
                        </div>
                      ))}
                    </div>

                    <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 3, textDecoration: 'none', fontSize: 11 }}>
                      SEND A WHATSAPP MESSAGE ↗
                    </a>

                    <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 20, lineHeight: 1.75 }}>
                      We reply to all enquiries personally. Send us a message on WhatsApp and we will get back to you with availability, pricing and any questions you have about the trip.
                    </p>
                  </div>
                </section>
              )}

            </article>

            {/* ── SIDEBAR ── */}
            <aside className="book-card" style={{ borderRadius: 6 }}>
              <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Kenya · 9 Days · Small group</div>
              <div style={{ font: '500 30px var(--font-playfair,Playfair Display),serif', margin: '10px 0 4px' }}>
                €{home.price_low.toLocaleString()}–€{home.price_high.toLocaleString()}
                <small style={{ font: '400 11px DM Sans,sans-serif', color: 'var(--muted)' }}> / person</small>
              </div>
              <p style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 16 }}>
                {(home as unknown as Record<string, unknown>).sidebar_intro as string || 'High season (Jul, Aug, Nov, Dec) up to €2,700. All other months from €2,400.'}
              </p>

              <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-primary"
                style={{ display: 'block', textAlign: 'center', width: '100%', boxSizing: 'border-box', borderRadius: 3, textDecoration: 'none', marginBottom: 10, padding: '14px' }}>
                ENQUIRE ON WHATSAPP ↗
              </a>
              <button className="btn-primary" onClick={() => setActiveTab('package')}
                style={{ display: 'block', width: '100%', textAlign: 'center', borderRadius: 3, background: 'var(--green)', marginBottom: 4 }}>
                SEE DATES & PRICING
              </button>

              <p style={{ textAlign: 'center', fontSize: 10, color: 'var(--muted)', lineHeight: 1.7, marginTop: 12 }}>
                Reserve for €0 · €200 deposit on confirmation<br />
                Instalments available until 31 days before departure
              </p>
              <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '18px 0' }} />
              <div style={{ fontSize: 11, color: '#53665a', lineHeight: 2.2 }}>
                {(Array.isArray((home as unknown as Record<string,unknown>).sidebar_bullets_json) && ((home as unknown as Record<string,unknown>).sidebar_bullets_json as string[]).length > 0
                  ? (home as unknown as Record<string,unknown>).sidebar_bullets_json as string[]
                  : ['Two Friday departures every month','Trips confirm at 6 travellers · max 15','Private jeep & professional guide included','All safari lodge stays full board','Free trip changes up to 31 days prior']
                ).map((p, i) => (
                  <div key={i}><b style={{ color: 'var(--moss)', marginRight: 8 }}>✓</b>{p}</div>
                ))}
              </div>
              <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '18px 0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {TABS.map(tab => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                    style={{ background: 'none', border: '1px solid', borderColor: activeTab === tab.id ? 'var(--coral)' : 'var(--line)', borderRadius: 3, padding: '9px 14px', textAlign: 'left', fontSize: 11, fontWeight: 600, cursor: 'pointer', color: activeTab === tab.id ? 'var(--coral)' : 'var(--ink)' }}>
                    {tab.label}
                  </button>
                ))}
              </div>
            </aside>
          </div>
        </div>
      ) : (
        <div style={{ minHeight: '60vh', display: 'grid', placeItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>Loading</div>
            <div style={{ width: 36, height: 3, background: 'var(--coral)', margin: '0 auto' }} />
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  )
}
