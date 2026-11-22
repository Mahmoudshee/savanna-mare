'use client'
import { useState } from 'react'

interface VideoModalProps {
  youtubeId: string
  label?: string
}

export default function VideoModal({ youtubeId, label = 'Watch film' }: VideoModalProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="video-play"
        onClick={() => setOpen(true)}
        style={{ position: 'absolute', left: 22, bottom: 22, border: 0, borderRadius: 30, background: 'white', padding: '12px 17px', fontSize: 11, fontWeight: 700, color: 'var(--ink)', boxShadow: '0 4px 20px #0002', cursor: 'pointer' }}
      >
        <span style={{ display: 'inline-grid', width: 22, height: 22, placeItems: 'center', border: '1px solid var(--ink)', borderRadius: '50%', marginRight: 8 }}>▶</span>
        {label}
      </button>

      {open && (
        <div
          className="modal-overlay open"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div style={{ width: 'min(900px,100%)', aspectRatio: '16/9', position: 'relative' }}>
            <button
              onClick={() => setOpen(false)}
              style={{ position: 'absolute', right: 0, top: -40, border: 0, background: 'none', color: '#fff', fontSize: 26, cursor: 'pointer' }}
              aria-label="Close video"
            >×</button>
            <iframe
              width="100%" height="100%"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
              title="Safari film"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
              style={{ border: 0, width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )}
    </>
  )
}
