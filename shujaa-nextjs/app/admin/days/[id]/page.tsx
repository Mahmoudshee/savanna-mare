'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const inp: React.CSSProperties = { width: '100%', border: '1px solid #d9ddd5', borderRadius: 3, padding: '9px 11px', fontSize: 13, fontFamily: 'DM Sans,sans-serif', background: '#fff', boxSizing: 'border-box' }
const ta: React.CSSProperties = { ...inp, minHeight: 110, resize: 'vertical' }
const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#444', display: 'block', marginBottom: 5 }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div style={{ marginBottom: 18 }}><label style={lbl}>{label}</label>{children}</div>
}

function ImageUpload({ label, currentUrl, folder, onUploaded }: { label: string; currentUrl: string; folder: string; onUploaded: (url: string) => void }) {
  const [preview, setPreview] = useState(currentUrl)
  const [uploading, setUploading] = useState(false)
  const [msg, setMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setPreview(URL.createObjectURL(file)); setUploading(true); setMsg('')
    const fd = new FormData(); fd.append('file', file); fd.append('path', `${folder}/${Date.now()}-${file.name.replace(/\s/g, '-')}`)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json(); setUploading(false)
    if (data.url) { onUploaded(data.url); setPreview(data.url); setMsg('✅ Uploaded') }
    else setMsg('❌ ' + (data.error || 'Upload failed'))
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={lbl}>{label}</label>
      {preview && <img src={preview} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 4, marginBottom: 8, border: '1px solid #e2e6df' }} />}
      <input style={{ ...inp, marginBottom: 6 }} value={currentUrl} readOnly placeholder="URL will appear after upload" />
      <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
        style={{ background: '#f4f5f3', border: '1px solid #d9ddd5', borderRadius: 3, padding: '8px 16px', fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
        {uploading ? 'Uploading…' : '📷 Upload image'}
      </button>
      {msg && <span style={{ fontSize: 11, marginLeft: 10 }}>{msg}</span>}
    </div>
  )
}

function ListEditor({ label, items, onChange }: { label: string; items: string[]; onChange: (items: string[]) => void }) {
  function update(i: number, v: string) { const a = [...items]; a[i] = v; onChange(a) }
  function remove(i: number) { onChange(items.filter((_, j) => j !== i)) }
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={lbl}>{label}</label>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input value={item} onChange={e => update(i, e.target.value)} style={{ ...inp, flex: 1 }} />
          <button type="button" onClick={() => remove(i)} style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 3, padding: '0 10px', cursor: 'pointer' }}>✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...items, ''])}
        style={{ background: '#f4f5f3', border: '1px dashed #aaa', borderRadius: 3, padding: '7px 14px', fontSize: 11, cursor: 'pointer' }}>+ Add item</button>
    </div>
  )
}

type DayData = {
  id: string; day_number: number; location: string; title: string; subtitle: string
  story_heading: string; story_body: string; hero_image_url: string
  sub_images_json: Array<{ url: string; alt: string }>
  gallery_json: Array<{ url: string; alt: string }>
  included_items: string[]; not_included_items: string[]
}

export default function DayEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [day, setDay] = useState<DayData | null>(null)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', ok: true })

  useEffect(() => {
    fetch(`/api/admin/days/${params.id}`).then(r => r.json()).then(setDay)
  }, [params.id])

  if (!day) return <div style={{ padding: 40, color: '#777' }}>Loading…</div>

  function setF(k: keyof DayData, v: unknown) { setDay(d => d ? { ...d, [k]: v } : d) }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const r = await fetch(`/api/admin/days/${params.id}`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(day),
    })
    setSaving(false); setToast({ msg: r.ok ? 'Day saved! ✅' : 'Save failed ❌', ok: r.ok })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
        <Link href="/admin/days" style={{ fontSize: 12, color: '#777', textDecoration: 'none' }}>← All Days</Link>
        <h1 style={{ font: '500 24px Georgia,serif', margin: 0 }}>Day {day.day_number} — {day.title || 'Edit'}</h1>
      </div>

      {toast.msg && (
        <div style={{ padding: '12px 16px', borderRadius: 4, marginBottom: 20, background: toast.ok ? '#ecfdf5' : '#fef2f2', color: toast.ok ? '#065f46' : '#b91c1c', border: `1px solid ${toast.ok ? '#6ee7b7' : '#fca5a5'}` }}>
          {toast.msg}
        </div>
      )}

      <form onSubmit={handleSave}>
        {/* Basic Info */}
        <div style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: 24, marginBottom: 16 }}>
          <h2 style={{ font: '500 16px Georgia,serif', margin: '0 0 20px' }}>Basic Info</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <Field label="Location"><input style={inp} value={day.location} onChange={e => setF('location', e.target.value)} /></Field>
            <Field label="Title"><input style={inp} value={day.title} onChange={e => setF('title', e.target.value)} /></Field>
            <Field label="Subtitle"><input style={inp} value={day.subtitle} onChange={e => setF('subtitle', e.target.value)} /></Field>
            <Field label="Story Heading"><input style={inp} value={day.story_heading} onChange={e => setF('story_heading', e.target.value)} /></Field>
          </div>
          <Field label="Story Body">
            <textarea style={{ ...ta, minHeight: 160 }} value={day.story_body} onChange={e => setF('story_body', e.target.value)} />
          </Field>
        </div>

        {/* Hero Image */}
        <div style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: 24, marginBottom: 16 }}>
          <h2 style={{ font: '500 16px Georgia,serif', margin: '0 0 20px' }}>Hero Image</h2>
          <ImageUpload label="Main Hero Photo" currentUrl={day.hero_image_url} folder={`days/day-${day.day_number}`} onUploaded={url => setF('hero_image_url', url)} />
        </div>

        {/* Gallery */}
        <div style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: 24, marginBottom: 16 }}>
          <h2 style={{ font: '500 16px Georgia,serif', margin: '0 0 20px' }}>Gallery Images</h2>
          <GalleryEditor images={day.gallery_json || []} folder={`days/day-${day.day_number}`} onChange={v => setF('gallery_json', v)} />
        </div>

        {/* Included / Not included */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
          <div style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: 24 }}>
            <ListEditor label="✅ Included" items={day.included_items || []} onChange={v => setF('included_items', v)} />
          </div>
          <div style={{ background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: 24 }}>
            <ListEditor label="❌ Not Included" items={day.not_included_items || []} onChange={v => setF('not_included_items', v)} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <button type="submit" disabled={saving}
            style={{ background: '#0f2219', color: '#fff', border: 'none', borderRadius: 3, padding: '12px 28px', fontSize: 12, fontWeight: 700, cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
            {saving ? 'Saving…' : 'Save Day →'}
          </button>
          <button type="button" onClick={() => router.push('/admin/days')}
            style={{ background: '#f4f5f3', border: '1px solid #d9ddd5', borderRadius: 3, padding: '12px 20px', fontSize: 12, cursor: 'pointer' }}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

function GalleryEditor({ images, folder, onChange }: { images: Array<{ url: string; alt: string }>; folder: string; onChange: (v: Array<{ url: string; alt: string }>) => void }) {
  const [uploading, setUploading] = useState<number | null>(null)

  async function uploadFor(i: number, file: File) {
    setUploading(i)
    const fd = new FormData(); fd.append('file', file); fd.append('path', `${folder}/${Date.now()}-${file.name.replace(/\s/g, '-')}`)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json(); setUploading(null)
    if (data.url) { const a = [...images]; a[i] = { ...a[i], url: data.url }; onChange(a) }
  }

  function update(i: number, field: 'url' | 'alt', v: string) { const a = [...images]; a[i] = { ...a[i], [field]: v }; onChange(a) }
  function remove(i: number) { onChange(images.filter((_, j) => j !== i)) }

  return (
    <div>
      {images.map((img, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: 'auto 1fr 1fr auto', gap: 10, alignItems: 'end', marginBottom: 10, padding: 10, background: '#f9f9f8', borderRadius: 4 }}>
          {img.url
            ? <img src={img.url} alt="" style={{ width: 72, height: 52, objectFit: 'cover', borderRadius: 3 }} />
            : <div style={{ width: 72, height: 52, background: '#e5e7e4', borderRadius: 3, display: 'grid', placeItems: 'center', fontSize: 24 }}>🖼️</div>
          }
          <div>
            <label style={{ ...lbl, marginBottom: 4 }}>Image URL</label>
            <div style={{ display: 'flex', gap: 4 }}>
              <input style={{ ...inp, flex: 1, fontSize: 11 }} value={img.url} onChange={e => update(i, 'url', e.target.value)} />
              <label style={{ background: '#f4f5f3', border: '1px solid #d9ddd5', borderRadius: 3, padding: '0 8px', cursor: 'pointer', display: 'grid', placeItems: 'center', fontSize: 14 }}>
                {uploading === i ? '⏳' : '📷'}
                <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) uploadFor(i, f) }} />
              </label>
            </div>
          </div>
          <div>
            <label style={{ ...lbl, marginBottom: 4 }}>Alt text</label>
            <input style={{ ...inp, fontSize: 11 }} value={img.alt} onChange={e => update(i, 'alt', e.target.value)} />
          </div>
          <button type="button" onClick={() => remove(i)} style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 3, padding: '8px 10px', cursor: 'pointer', alignSelf: 'end' }}>✕</button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...images, { url: '', alt: '' }])}
        style={{ width: '100%', background: '#f4f5f3', border: '1px dashed #aaa', borderRadius: 3, padding: '10px', fontSize: 12, cursor: 'pointer', marginTop: 4 }}>
        + Add gallery image
      </button>
    </div>
  )
}

