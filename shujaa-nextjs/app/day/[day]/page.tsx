import { notFound } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { getDayByNumber, getSiteSettings } from '@/lib/content'
import SiteFooter from '@/components/SiteFooter'
import DayNavProgress from '@/components/DayNavProgress'

export const revalidate = 0
export const dynamic = 'force-dynamic'

export async function generateStaticParams() {
  return Array.from({ length: 9 }, (_, i) => ({ day: String(i + 1) }))
}

export async function generateMetadata({ params }: { params: { day: string } }) {
  const dayNum = parseInt(params.day, 10)
  const day = await getDayByNumber(dayNum)
  if (!day) return {}
  return {
    title: `Day ${String(dayNum).padStart(2,'0')} — ${day.title} | Savanna & Mare Adventures`,
    description: day.subtitle,
  }
}

export default async function DayPage({ params }: { params: { day: string } }) {
  const dayNum = parseInt(params.day, 10)
  if (isNaN(dayNum) || dayNum < 1 || dayNum > 9) notFound()

  const [day, settings] = await Promise.all([
    getDayByNumber(dayNum),
    getSiteSettings(),
  ])
  if (!day) notFound()

  const whatsappNumber = settings.whatsapp_number || '254115119090'
  const waMsg = settings.whatsapp_message || "Hello Savanna & Mare Adventures, I'd like to ask about the Kenya trip."
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(waMsg)}`

  const prevDay = dayNum > 1 ? dayNum - 1 : null
  const nextDay = dayNum < 9 ? dayNum + 1 : null
  const allImages = [...(day.sub_images_json || []), ...(day.gallery_json || [])]
  const [, ...subImgs] = allImages

  return (
    <>
      {/* Header — matches homepage style */}
      <div style={{ background: '#0f2219', borderBottom: '1px solid #1a3528' }}>
        <div style={{ background: '#18352b', textAlign: 'center', fontSize: 10, letterSpacing: '0.13em', textTransform: 'uppercase', color: '#c8d8c5', padding: '7px 0' }}>
          {settings.bar_text || 'Small groups · local knowledge · journeys made with care'}
        </div>
        <div className="shell" style={{ display: 'flex', alignItems: 'center', height: 58, justifyContent: 'space-between' }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
            <Logo height={36} variant="light" />
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <Link href="/?tab=itinerary" style={{ fontSize: 11, fontWeight: 700, color: '#c8d8c5', textDecoration: 'none' }}>← Full itinerary</Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: '#25D366', padding: '8px 14px', borderRadius: 3, textDecoration: 'none' }}>
              WhatsApp ↗
            </a>
          </div>
        </div>
      </div>

      <main className="shell">
        {/* Breadcrumb */}
        <div style={{ padding: '16px 0', color: '#8b9288', fontSize: 10 }}>
          <Link href="/" style={{ color: 'inherit' }}>Home</Link>
          &nbsp;›&nbsp;
          <Link href="/" style={{ color: 'inherit' }}>Itinerary</Link>
          &nbsp;›&nbsp;
          <b style={{ color: 'var(--ink)' }}>Day {String(dayNum).padStart(2,'0')} — {day.title}</b>
        </div>

        {/* Progress bar */}
        <DayNavProgress currentDay={dayNum} />

        {/* Headline */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 20, marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 9, color: 'var(--moss)', fontWeight: 800, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
              {day.location} · Day {String(dayNum).padStart(2,'0')} of 9
            </div>
            <h1 style={{ font: '500 clamp(32px,4vw,50px)/1.05 var(--font-playfair,Playfair Display),serif', letterSpacing: '-1px', margin: '7px 0' }}>
              {day.title}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--muted)', margin: 0 }}>{day.subtitle}</p>
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
            <b style={{ color: 'var(--ink)', fontSize: 13 }}>DAY {String(dayNum).padStart(2,'0')} / 09</b><br />
            9 days · small-group journey
          </div>
        </div>

        {/* Hero: photos + story */}
        <section className="day-hero-grid" style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 36, alignItems: 'stretch' }}>
          {/* Photos */}
          <div style={{ display: 'grid', gridTemplateRows: '1fr 128px', gap: 8, minHeight: 400 }}>
            <img src={day.hero_image_url} alt={day.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {subImgs.slice(0, 2).map((img, i) => (
                <img key={i} src={img.url} alt={img.alt} loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 4 }} />
              ))}
            </div>
          </div>

          {/* Story */}
          <div style={{ background: '#f5f1e7', padding: 32, display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: 4 }}>
            <h2 style={{ font: '500 26px var(--font-playfair,Playfair Display),serif', margin: '0 0 13px' }}>{day.story_heading}</h2>
            <p style={{ fontSize: 13, lineHeight: 1.85, color: '#5e6b62' }}>{day.story_body}</p>

            {/* Videos */}
            {day.videos_json.map((vid, i) => (
              <div key={i} style={{ marginTop: 12, background: '#18352b', color: 'white', padding: '10px 10px 14px', borderRadius: 3 }}>
                {vid.type === 'youtube' ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${vid.src}?rel=0`}
                    title={vid.caption} loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ display: 'block', width: '100%', aspectRatio: '16/9', border: 0 }}
                  />
                ) : (
                  <video controls playsInline preload="metadata" poster={vid.poster}
                    style={{ display: 'block', width: '100%', aspectRatio: '16/9' }}>
                    <source src={vid.src} type="video/mp4" />
                  </video>
                )}
                <span style={{ display: 'block', fontSize: 9, color: '#e4e9df', padding: '8px 4px 0', letterSpacing: '0.04em' }}>{vid.caption}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Included / Not included */}
        <section className="day-included-grid" style={{ margin: '32px 0 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          <div style={{ borderTop: '3px solid var(--moss)', paddingTop: 18 }}>
            <h3 style={{ font: '500 20px var(--font-playfair,Playfair Display),serif', margin: '0 0 14px' }}>Included today</h3>
            <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
              {day.included_items.map((item, i) => (
                <li key={i} style={{ fontSize: 12, color: '#59665c', lineHeight: 1.6, padding: '8px 0', borderBottom: '1px solid #efede6', display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--moss)', fontWeight: 700, flexShrink: 0 }}>✓</span>{item}
                </li>
              ))}
            </ul>
          </div>
          <div style={{ borderTop: '3px solid var(--coral)', paddingTop: 18 }}>
            <h3 style={{ font: '500 20px var(--font-playfair,Playfair Display),serif', margin: '0 0 14px' }}>Not included / check before travel</h3>
            <ul style={{ padding: 0, listStyle: 'none', margin: 0 }}>
              {day.not_included_items.map((item, i) => (
                <li key={i} style={{ fontSize: 12, color: '#59665c', lineHeight: 1.6, padding: '8px 0', borderBottom: '1px solid #efede6', display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--coral)', fontWeight: 700, flexShrink: 0 }}>✗</span>{item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* WhatsApp CTA */}
        <div style={{ margin: '36px 0', padding: '28px 32px', background: '#0f2219', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24 }}>
          <div>
            <div style={{ font: '500 20px var(--font-playfair,Playfair Display),serif', color: '#fff', marginBottom: 6 }}>Interested in this trip?</div>
            <div style={{ fontSize: 12, color: '#8ba896' }}>Message us on WhatsApp — we reply personally, usually within a few hours.</div>
          </div>
          <a href={waUrl} target="_blank" rel="noopener noreferrer"
            style={{ flexShrink: 0, background: '#25D366', color: '#fff', padding: '13px 24px', borderRadius: 3, fontSize: 11, fontWeight: 700, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            WHATSAPP US ↗
          </a>
        </div>

        {/* Day pager */}
        <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', padding: '20px 0', marginBottom: 32 }}>
          {prevDay
            ? <Link href={`/day/${prevDay}`} style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textDecoration: 'none' }}>← Day {String(prevDay).padStart(2,'0')}</Link>
            : <span style={{ color: '#aeb3aa', fontSize: 11 }}>← Start of trip</span>}
          <Link href="/" style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textDecoration: 'none' }}>All nine days ↑</Link>
          {nextDay
            ? <Link href={`/day/${nextDay}`} style={{ fontSize: 11, fontWeight: 700, color: 'var(--green)', textDecoration: 'none' }}>Day {String(nextDay).padStart(2,'0')} →</Link>
            : <span style={{ color: '#aeb3aa', fontSize: 11 }}>End of trip →</span>}
        </nav>
      </main>

      <SiteFooter />
    </>
  )
}
