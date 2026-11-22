'use client'
import Link from 'next/link'
import Logo from '@/components/Logo'

interface SiteHeaderProps {
  barText?: string
  whatsappNumber?: string
  whatsappMessage?: string
  showNav?: boolean
}

export default function SiteHeader({
  barText = 'Small groups · local knowledge · journeys made with care',
  whatsappNumber = '254115119090',
  whatsappMessage = "Hello Savanna & Mare Adventures, I'd like to ask about the Kenya trip.",
  showNav = false,
}: SiteHeaderProps) {
  const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`

  return (
    <>
      <div className="top-bar">{barText}</div>
      <header className="shell nav-bar">
        <Link href="/" className="brand-logo" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <Logo height={40} variant="light" />
        </Link>

        {showNav && (
          <nav style={{ display: 'flex', gap: 31, fontSize: 12, fontWeight: 600 }}>
            <Link href="/" style={{ color: 'inherit' }}>Our experiences</Link>
            <Link href="/" style={{ color: 'inherit' }}>Itinerary</Link>
            <Link href="/" style={{ color: 'inherit' }}>About us</Link>
          </nav>
        )}

        <div style={{ display: 'flex', gap: 19, alignItems: 'center', fontSize: 12 }}>
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="btn-outline">
            WhatsApp&nbsp; ↗
          </a>
        </div>
      </header>
    </>
  )
}
