'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import SiteHeader from '@/components/SiteHeader'
import SiteFooter from '@/components/SiteFooter'
import Link from 'next/link'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface GalleryImage {
  url: string
  alt: string
  caption?: string
  source: string // 'hero' | 'day-N'
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState<GalleryImage | null>(null)

  useEffect(() => {
    async function load() {
      const all: GalleryImage[] = []

      // 1. Hero gallery from home_content
      const { data: home } = await supabase
        .from('home_content')
        .select('gallery_images_json')
        .limit(1)
        .single()

      if (home?.gallery_images_json) {
        const imgs = Array.isArray(home.gallery_images_json) ? home.gallery_images_json : []
        imgs.forEach((img: { url: string; alt: string }) => {
          if (img.url) all.push({ url: img.url, alt: img.alt || '', caption: img.alt, source: 'Overview' })
        })
      }

      // 2. All days: hero + sub_images_json + gallery_json
      const { data: days } = await supabase
        .from('itinerary_days')
        .select('day_number, location, hero_image_url, sub_images_json, gallery_json')
        .order('day_number')

      if (days) {
        for (const day of days) {
          const label = `Day ${day.day_number} · ${day.location}`
          if (day.hero_image_url) {
            all.push({ url: day.hero_image_url, alt: label, caption: label, source: label })
          }
          const subs = Array.isArray(day.sub_images_json) ? day.sub_images_json : []
          subs.forEach((img: { url: string; alt: string }) => {
            if (img.url) all.push({ url: img.url, alt: img.alt || label, caption: img.alt, source: label })
          })
          const gallery = Array.isArray(day.gallery_json) ? day.gallery_json : []
          gallery.forEach((img: { url: string; alt: string; caption?: string }) => {
            if (img.url) all.push({ url: img.url, alt: img.alt || label, caption: img.caption || img.alt, source: label })
          })
        }
      }

      // De-duplicate by URL
      const seen = new Set<string>()
      const unique = all.filter(img => {
        if (seen.has(img.url)) return false
        seen.add(img.url)
        return true
      })

      setImages(unique)
      setLoading(false)
    }
    load()
  }, [])

  // Close lightbox on Escape
  useEffect(() => {
    if (!lightbox) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setLightbox(null) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox])

  return (
    <>
      <SiteHeader />

      <div style={{ background: '#f4f5f3', minHeight: '100vh' }}>
        {/* Page header */}
        <div style={{ background: '#0f2219', padding: '48px 5% 40px' }}>
          <div style={{ fontSize: 10, fontWeight: 800, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#6a9e7f', marginBottom: 10 }}>
            Kenya · Small group safari &amp; coast
          </div>
          <h1 style={{ font: '500 42px Georgia,serif', color: '#f5f0e8', margin: '0 0 12px', letterSpacing: '-0.5px' }}>
            Photo Gallery
          </h1>
          <p style={{ fontSize: 14, color: '#8ba896', margin: 0, maxWidth: 520 }}>
            Every photo below was captured on the Tsavo Safari &amp; Watamu Coast journey —
            from red-dust elephant herds to turquoise coral reefs.
          </p>
          <div style={{ marginTop: 20 }}>
            <Link href="/" style={{ fontSize: 12, color: '#dc7855', textDecoration: 'none', fontWeight: 700 }}>
              ← Back to trip overview
            </Link>
          </div>
        </div>

        {/* Gallery grid */}
        <div style={{ padding: '40px 4%' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 80, color: '#888', fontSize: 13 }}>Loading gallery…</div>
          ) : images.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 80, color: '#888', fontSize: 13 }}>
              No images yet. Add gallery images in the admin CMS.
            </div>
          ) : (
            <>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 24 }}>
                {images.length} photos · click to enlarge
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 10,
              }}>
                {images.map((img, i) => (
                  <div
                    key={i}
                    onClick={() => setLightbox(img)}
                    style={{
                      cursor: 'pointer',
                      borderRadius: 4,
                      overflow: 'hidden',
                      position: 'relative',
                      aspectRatio: '4/3',
                      background: '#1a2e1e',
                    }}
                  >
                    <img
                      src={img.url}
                      alt={img.alt}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.3s ease' }}
                      onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.04)')}
                      onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    {img.source && (
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '20px 10px 8px',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 100%)',
                        fontSize: 10, color: 'rgba(255,255,255,0.85)', fontWeight: 600, letterSpacing: '0.05em',
                      }}>
                        {img.source}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '20px',
          }}
        >
          <button
            onClick={() => setLightbox(null)}
            style={{ position: 'absolute', top: 20, right: 24, background: 'none', border: 0, color: '#fff', fontSize: 28, cursor: 'pointer', lineHeight: 1 }}
          >✕</button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            <img
              src={lightbox.url}
              alt={lightbox.alt}
              style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain', borderRadius: 4 }}
            />
            {lightbox.caption && (
              <div style={{ color: '#c8d8c5', fontSize: 13, textAlign: 'center' }}>{lightbox.caption}</div>
            )}
            {lightbox.source && (
              <div style={{ color: '#6a9e7f', fontSize: 11, letterSpacing: '0.08em' }}>{lightbox.source}</div>
            )}
          </div>
        </div>
      )}

      <SiteFooter />
    </>
  )
}

