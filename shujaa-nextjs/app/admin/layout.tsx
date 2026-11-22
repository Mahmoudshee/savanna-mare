'use client'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Logo from '@/components/Logo'

const AUTH_PATHS = ['/admin/login', '/admin/signup']

const NAV = [
  { href: '/admin/dashboard',  label: 'Dashboard',      icon: '▤'  },
  { href: '/admin/content',    label: 'Site Content',   icon: '✏️' },
  { href: '/admin/days',       label: 'Itinerary Days', icon: '📅' },
  { href: '/admin/departures', label: 'Departures',     icon: '✈️' },
  { href: '/admin/bookings',   label: 'Bookings',       icon: '📋' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])

  // Close sidebar when navigating on mobile
  useEffect(() => { if (isMobile) setOpen(false) }, [pathname, isMobile])

  // Auth pages: no sidebar
  if (AUTH_PATHS.includes(pathname)) return <>{children}</>

  const sidebarVisible = !isMobile || open

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'DM Sans,sans-serif', position: 'relative' }}>

      {/* ── Mobile overlay ── */}
      {isMobile && open && (
        <div
          onClick={() => setOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 40 }}
        />
      )}

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, minHeight: '100vh', background: '#0f2219',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
        position: isMobile ? 'fixed' : 'relative',
        top: 0, left: 0, bottom: 0, zIndex: 50,
        transform: sidebarVisible ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.25s ease',
      }}>
        {/* Brand + close button */}
        <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid #1f4336', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Logo height={34} variant="light" />
          {isMobile && (
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 0, color: '#7aab8a', fontSize: 20, cursor: 'pointer', lineHeight: 1, padding: 4 }}
              aria-label="Close menu"
            >✕</button>
          )}
        </div>
        <div style={{ padding: '4px 16px 10px', borderBottom: '1px solid #1f4336' }}>
          <div style={{ font: '500 8px DM Sans,sans-serif', letterSpacing: '0.3em', color: '#5a8a6a', textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          {NAV.map(({ href, label, icon }) => {
            const active = pathname === href
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 18px', fontSize: 12,
                  color: active ? '#fff' : '#c8d8c5',
                  fontWeight: active ? 700 : 600,
                  textDecoration: 'none',
                  background: active ? '#1f4336' : 'transparent',
                  borderLeft: active ? '3px solid #dc7855' : '3px solid transparent',
                  borderBottom: '1px solid #1a3528',
                  transition: 'background 0.15s',
                }}
              >
                <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '14px 18px', borderTop: '1px solid #1f4336' }}>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" style={{ background: 'none', border: 0, color: '#7aab8a', fontSize: 11, cursor: 'pointer', padding: 0, letterSpacing: '0.07em' }}>
              ← Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main area ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

        {/* Mobile top bar */}
        {isMobile && (
          <div style={{ background: '#0f2219', display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', flexShrink: 0 }}>
            <button
              onClick={() => setOpen(true)}
              style={{ background: 'none', border: 0, color: '#c8d8c5', fontSize: 22, cursor: 'pointer', lineHeight: 1, padding: 0 }}
              aria-label="Open menu"
            >☰</button>
            <Logo height={30} variant="light" />
          </div>
        )}

        <main style={{ flex: 1, background: '#f4f5f3', padding: isMobile ? '20px 16px' : '36px 40px', overflowY: 'auto', minWidth: 0 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
