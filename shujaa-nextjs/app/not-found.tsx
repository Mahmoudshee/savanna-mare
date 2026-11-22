import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '70vh', display: 'grid', placeItems: 'center', fontFamily: 'DM Sans,sans-serif', textAlign: 'center', padding: '5vw' }}>
      <div>
        <div style={{ font: '500 9px DM Sans,sans-serif', letterSpacing: '0.17em', color: 'var(--moss)', textTransform: 'uppercase', marginBottom: 12 }}>404</div>
        <h1 style={{ font: '500 clamp(34px,5vw,56px)/1.1 Playfair Display,serif', margin: '0 0 16px', color: 'var(--ink)' }}>Page not found</h1>
        <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 400, margin: '0 auto 28px' }}>
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/" style={{ display: 'inline-block', background: 'var(--coral)', color: '#fff', padding: '14px 24px', fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', textDecoration: 'none' }}>
          BACK TO HOME
        </Link>
      </div>
    </div>
  )
}
