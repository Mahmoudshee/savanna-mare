'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const AUTH_PATHS = ['/admin/login', '/admin/signup']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Login & signup pages: render standalone with NO sidebar
  if (AUTH_PATHS.includes(pathname)) {
    return <>{children}</>
  }

  // All other admin pages: render with sidebar
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'DM Sans,sans-serif' }}>

      {/* ── Sidebar ── */}
      <aside style={{
        width: 220, minHeight: '100vh', background: '#0f2219',
        display: 'flex', flexDirection: 'column', flexShrink: 0,
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid #1f4336' }}>
          <div style={{ font: '700 13px DM Sans,sans-serif', letterSpacing: '0.045em', textTransform: 'uppercase', color: '#fff' }}>SAVANNA & MARE</div>
          <div style={{ font: '500 8px DM Sans,sans-serif', letterSpacing: '0.23em', color: '#5a8a6a', marginTop: 4, textTransform: 'uppercase' }}>Admin Panel</div>
        </div>

        {/* Nav links */}
        <nav style={{ flex: 1, padding: '12px 0' }}>
          {[
            { href: '/admin/dashboard',  label: 'Dashboard',      icon: '▤' },
            { href: '/admin/content',    label: 'Site Content',   icon: '✏️' },
            { href: '/admin/days',       label: 'Itinerary Days', icon: '📅' },
            { href: '/admin/departures', label: 'Departures',     icon: '✈️' },
            { href: '/admin/bookings',   label: 'Bookings',       icon: '📋' },
          ].map(({ href, label, icon }) => (
            <Link
              key={href}
              href={href}
              style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '11px 20px', fontSize: 12, color: '#c8d8c5',
                fontWeight: 600, textDecoration: 'none',
                borderBottom: '1px solid #1a3528',
                transition: 'background 0.15s',
              }}
            >
              <span style={{ fontSize: 14 }}>{icon}</span>
              {label}
            </Link>
          ))}
        </nav>

        {/* Sign out */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid #1f4336' }}>
          <form action="/api/admin/logout" method="POST">
            <button
              type="submit"
              style={{ background: 'none', border: 0, color: '#7aab8a', fontSize: 11, cursor: 'pointer', padding: 0, letterSpacing: '0.07em' }}
            >
              ← Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* ── Main content ── */}
      <main style={{ flex: 1, background: '#f4f5f3', padding: '36px 40px', overflowY: 'auto', minWidth: 0 }}>
        {children}
      </main>
    </div>
  )
}
