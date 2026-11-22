'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ── Shared styles ──────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', border: '1px solid #d9ddd5', borderRadius: 3, padding: '9px 11px',
  fontSize: 13, fontFamily: 'DM Sans,sans-serif', background: '#fff', boxSizing: 'border-box',
}
const ta: React.CSSProperties = { ...inp, minHeight: 90, resize: 'vertical' }
const lbl: React.CSSProperties = { fontSize: 11, fontWeight: 700, letterSpacing: '0.07em', textTransform: 'uppercase' as const, color: '#444', display: 'block', marginBottom: 5 }
const card: React.CSSProperties = { background: '#fff', border: '1px solid #e2e6df', borderRadius: 6, padding: '28px 28px', marginBottom: 20 }
const sectionTitle: React.CSSProperties = { font: '500 18px Georgia,serif', margin: '0 0 20px', borderBottom: '1px solid #eee', paddingBottom: 10 }

function Field({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={lbl}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: '#888', marginBottom: 5 }}>{hint}</div>}
      {children}
    </div>
  )
}

function SaveBtn({ saving, label = 'Save Changes' }: { saving: boolean; label?: string }) {
  return (
    <button type="submit" disabled={saving}
      style={{ background: '#0f2219', color: '#fff', border: 'none', borderRadius: 3, padding: '11px 24px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1 }}>
      {saving ? 'Saving…' : label}
    </button>
  )
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  if (!msg) return null
  return (
    <div style={{ padding: '10px 14px', borderRadius: 4, fontSize: 12, marginTop: 12, background: ok ? '#ecfdf5' : '#fef2f2', color: ok ? '#065f46' : '#b91c1c', border: `1px solid ${ok ? '#6ee7b7' : '#fca5a5'}` }}>
      {ok ? '✅' : '❌'} {msg}
    </div>
  )
}

// ── Upload field: paste URL or pick file ───────────────────────────────────
function UploadField({ label, value, folder, onChange, hint, showPreview = true }: { label: string; value: string; folder: string; onChange: (url: string) => void; hint?: string; showPreview?: boolean }) {
  const [uploading, setUploading] = useState(false)
  const ref = useRef<HTMLInputElement>(null)

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('path', `${folder}/${Date.now()}-${file.name.replace(/\s/g, '-')}`)
    const res = await fetch('/api/admin/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploading(false)
    if (data.url) onChange(data.url)
  }

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={lbl}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: '#888', marginBottom: 5 }}>{hint}</div>}
      {showPreview && value && (
        <img src={value} alt="" style={{ width: '100%', maxHeight: 160, objectFit: 'cover', borderRadius: 4, marginBottom: 8, border: '1px solid #e2e6df' }} />
      )}
      <div style={{ display: 'flex', gap: 6 }}>
        <input style={{ ...inp, flex: 1 }} value={value} onChange={e => onChange(e.target.value)} placeholder="Paste URL or click 📷 to upload" />
        <input ref={ref} type="file" accept="image/*" onChange={handleFile} style={{ display: 'none' }} />
        <button type="button" onClick={() => ref.current?.click()} disabled={uploading}
          style={{ background: '#f4f5f3', border: '1px solid #d9ddd5', borderRadius: 3, padding: '0 12px', fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}>
          {uploading ? '⏳' : '📷 Upload'}
        </button>
      </div>
    </div>
  )
}

// ── Simple text list editor ────────────────────────────────────────────────
function ListEditor({ label, items, onChange, hint }: { label: string; items: string[]; onChange: (items: string[]) => void; hint?: string }) {
  function update(i: number, v: string) { const a = [...items]; a[i] = v; onChange(a) }
  function remove(i: number) { onChange(items.filter((_, j) => j !== i)) }
  function add() { onChange([...items, '']) }
  return (
    <div style={{ marginBottom: 18 }}>
      <label style={lbl}>{label}</label>
      {hint && <div style={{ fontSize: 10, color: '#888', marginBottom: 5 }}>{hint}</div>}
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input value={item} onChange={e => update(i, e.target.value)} style={{ ...inp, flex: 1 }} placeholder={`Item ${i + 1}`} />
          <button type="button" onClick={() => remove(i)} style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 3, padding: '0 10px', cursor: 'pointer', fontSize: 14 }}>✕</button>
        </div>
      ))}
      <button type="button" onClick={add} style={{ background: '#f4f5f3', border: '1px dashed #aaa', borderRadius: 3, padding: '7px 14px', fontSize: 11, cursor: 'pointer', marginTop: 2 }}>+ Add item</button>
    </div>
  )
}

// ── Facts strip editor [{label, value}] ────────────────────────────────────
function FactsEditor({ facts, onChange }: { facts: { label: string; value: string }[]; onChange: (v: { label: string; value: string }[]) => void }) {
  function update(i: number, field: 'label' | 'value', v: string) {
    onChange(facts.map((f, j) => j === i ? { ...f, [field]: v } : f))
  }
  function remove(i: number) { onChange(facts.filter((_, j) => j !== i)) }
  function add() { onChange([...facts, { label: '', value: '' }]) }

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={lbl}>Trip Facts Strip</label>
      <div style={{ fontSize: 10, color: '#888', marginBottom: 8 }}>These appear as the small info boxes below the title (e.g. Duration: 9 days, Group size: max 15)</div>
      {facts.map((f, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8, padding: 12, background: '#f9f9f8', borderRadius: 4, border: '1px solid #e2e6df' }}>
          <div>
            <label style={{ ...lbl, marginBottom: 3 }}>Label</label>
            <input style={inp} value={f.label} onChange={e => update(i, 'label', e.target.value)} placeholder="e.g. Duration" />
          </div>
          <div>
            <label style={{ ...lbl, marginBottom: 3 }}>Value</label>
            <input style={inp} value={f.value} onChange={e => update(i, 'value', e.target.value)} placeholder="e.g. 9 days" />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button type="button" onClick={() => remove(i)} style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 3, padding: '9px 10px', cursor: 'pointer' }}>✕</button>
          </div>
        </div>
      ))}
      <button type="button" onClick={add} style={{ background: '#f4f5f3', border: '1px dashed #aaa', borderRadius: 3, padding: '8px 16px', fontSize: 11, cursor: 'pointer' }}>+ Add fact</button>
    </div>
  )
}

// ── Big Five editor ────────────────────────────────────────────────────────
function BigFiveEditor({ animals, onChange }: { animals: { name: string; image: string; caption: string }[]; onChange: (v: { name: string; image: string; caption: string }[]) => void }) {
  function update(i: number, field: string, v: string) {
    onChange(animals.map((a, j) => j === i ? { ...a, [field]: v } : a))
  }
  function remove(i: number) { onChange(animals.filter((_, j) => j !== i)) }
  function add() { onChange([...animals, { name: '', image: '', caption: '' }]) }

  return (
    <div>
      {animals.map((animal, i) => (
        <div key={i} style={{ padding: 16, background: '#f9f9f8', border: '1px solid #e2e6df', borderRadius: 6, marginBottom: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Animal {i + 1}{animal.name ? ` — ${animal.name}` : ''}</div>
            <button type="button" onClick={() => remove(i)} style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 3, padding: '5px 10px', cursor: 'pointer', fontSize: 12 }}>Remove</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field label="Animal Name">
              <input style={inp} value={animal.name} onChange={e => update(i, 'name', e.target.value)} placeholder="e.g. Lion" />
            </Field>
            <Field label="Caption / Fact">
              <input style={inp} value={animal.caption} onChange={e => update(i, 'caption', e.target.value)} placeholder="e.g. Tsavo is home to the famous maneless lions" />
            </Field>
          </div>
          <UploadField label="Animal Photo" value={animal.image} folder={`big-five`} onChange={url => update(i, 'image', url)} hint="Best size: 400×300px" />
        </div>
      ))}
      <button type="button" onClick={add} style={{ background: '#f4f5f3', border: '1px dashed #aaa', borderRadius: 3, padding: '10px 20px', fontSize: 12, cursor: 'pointer', width: '100%' }}>+ Add animal</button>
    </div>
  )
}

// ── Gallery editor ─────────────────────────────────────────────────────────
function GalleryEditor({ images, onChange }: { images: { url: string; alt: string }[]; onChange: (v: { url: string; alt: string }[]) => void }) {
  function update(i: number, field: 'url' | 'alt', v: string) {
    onChange(images.map((img, j) => j === i ? { ...img, [field]: v } : img))
  }
  function remove(i: number) { onChange(images.filter((_, j) => j !== i)) }
  function add() { onChange([...images, { url: '', alt: '' }]) }

  return (
    <div>
      {images.map((img, i) => (
        <div key={i} style={{ marginBottom: 14, padding: 14, background: '#f9f9f8', borderRadius: 6, border: '1px solid #e2e6df' }}>
          {/* Row 1: label + X button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Image {i + 1}</span>
            <button type="button" onClick={() => remove(i)} style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fca5a5', borderRadius: 4, padding: '4px 10px', cursor: 'pointer', fontSize: 13, lineHeight: 1 }}>✕ Remove</button>
          </div>
          {/* Row 2: thumbnail + upload side by side */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
            <div style={{ width: 72, height: 54, background: '#e5e7e4', borderRadius: 3, overflow: 'hidden', flexShrink: 0 }}>
              {img.url ? <img src={img.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ width: '100%', height: '100%', display: 'grid', placeItems: 'center', fontSize: 20 }}>🖼️</div>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <UploadField label="Image URL" value={img.url} folder="gallery" onChange={v => update(i, 'url', v)} showPreview={false} />
            </div>
          </div>
          {/* Row 3: alt text full width */}
          <div>
            <label style={lbl}>Alt text</label>
            <input style={inp} value={img.alt} onChange={e => update(i, 'alt', e.target.value)} placeholder="Describe the image (e.g. Red elephants in Tsavo)" />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} style={{ background: '#f4f5f3', border: '1px dashed #aaa', borderRadius: 3, padding: '10px 20px', fontSize: 12, cursor: 'pointer', width: '100%', marginTop: 4 }}>+ Add image</button>
    </div>
  )
}

// ── MAIN PAGE ─────────────────────────────────────────────────────────────
const CMS_TABS = [
  { id: 'settings',    label: '⚙️ Settings' },
  { id: 'hero',        label: '🏠 Overview & Hero' },
  { id: 'gallery',     label: '🖼️ Gallery' },
  { id: 'facts',       label: '📊 Facts & Pricing' },
  { id: 'inclusions',  label: '✅ Inclusions' },
  { id: 'bigfive',     label: '🦁 Big Five' },
  { id: 'hosts',       label: '👥 Hosts & Contact' },
  { id: 'sidebar',     label: '📋 Booking Sidebar' },
  { id: 'itinerary',   label: '📅 Itinerary Overview' },
]

export default function ContentPage() {
  const [tab, setTab] = useState('settings')
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [home, setHome] = useState<Record<string, unknown>>({})
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', ok: true })

  useEffect(() => {
    fetch('/api/admin/content')
      .then(r => r.json())
      .then(d => { setSettings(d.settings || {}); setHome(d.home || {}) })
  }, [])

  function setSetting(k: string, v: string) { setSettings(s => ({ ...s, [k]: v })) }
  function setH(k: string, v: unknown) { setHome(h => ({ ...h, [k]: v })) }

  async function saveSettings(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const r = await fetch('/api/admin/settings', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(settings) })
    setSaving(false); setToast({ msg: r.ok ? '✅ Settings saved!' : 'Save failed.', ok: r.ok })
  }

  async function saveHome(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const r = await fetch('/api/admin/content', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(home) })
    setSaving(false); setToast({ msg: r.ok ? '✅ Saved to database!' : 'Save failed.', ok: r.ok })
  }

  function changeTab(t: string) { setTab(t); setToast({ msg: '', ok: true }) }

  const tabBtn = (t: string) => ({
    padding: '8px 16px', border: 'none',
    background: tab === t ? '#0f2219' : '#f4f5f3',
    color: tab === t ? '#fff' : '#555',
    borderRadius: 4, fontSize: 11, fontWeight: 700,
    cursor: 'pointer', letterSpacing: '0.04em',
    whiteSpace: 'nowrap' as const,
  })

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 6 }}>
        <h1 style={{ font: '500 28px Georgia,serif', margin: 0 }}>Site Content</h1>
        <Link href="/admin/days" style={{ fontSize: 12, color: '#0f2219', fontWeight: 700, textDecoration: 'none' }}>
          Edit Day-by-Day pages →
        </Link>
      </div>
      <p style={{ color: '#777', fontSize: 13, margin: '0 0 24px' }}>
        All changes save directly to Supabase and go live on the site immediately. No coding needed.
      </p>

      {/* Tab nav */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
        {CMS_TABS.map(t => <button key={t.id} style={tabBtn(t.id)} onClick={() => changeTab(t.id)}>{t.label}</button>)}
      </div>

      {/* ── ⚙️ SETTINGS ── */}
      {tab === 'settings' && (
        <form onSubmit={saveSettings}>
          <div style={card}>
            <h2 style={sectionTitle}>Global Site Settings</h2>
            <p style={{ fontSize: 12, color: '#777', marginBottom: 20 }}>These affect the whole site — header bar, WhatsApp links, footer, contact info.</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Site Name"><input style={inp} value={settings.site_name || ''} onChange={e => setSetting('site_name', e.target.value)} /></Field>
              <Field label="Announcement Bar Text" hint="The small text in the green bar at the top of every page">
                <input style={inp} value={settings.bar_text || ''} onChange={e => setSetting('bar_text', e.target.value)} />
              </Field>
              <Field label="WhatsApp Number (digits only, no +)" hint="e.g. 254115119090">
                <input style={inp} value={settings.whatsapp_number || ''} onChange={e => setSetting('whatsapp_number', e.target.value)} />
              </Field>
              <Field label="WhatsApp Default Message">
                <input style={inp} value={settings.whatsapp_message || ''} onChange={e => setSetting('whatsapp_message', e.target.value)} />
              </Field>
              <Field label="Contact Email">
                <input style={inp} type="email" value={settings.contact_email || ''} onChange={e => setSetting('contact_email', e.target.value)} />
              </Field>
              <Field label="Contact Phone (displayed in footer)">
                <input style={inp} value={settings.contact_phone || ''} onChange={e => setSetting('contact_phone', e.target.value)} />
              </Field>
              <Field label="Departure Base / Address">
                <input style={inp} value={settings.contact_address || ''} onChange={e => setSetting('contact_address', e.target.value)} />
              </Field>
              <Field label="Instagram URL">
                <input style={inp} value={settings.instagram_url || ''} onChange={e => setSetting('instagram_url', e.target.value)} />
              </Field>
              <Field label="Facebook URL">
                <input style={inp} value={settings.facebook_url || ''} onChange={e => setSetting('facebook_url', e.target.value)} />
              </Field>
            </div>
            <Field label="Footer Description" hint="Short paragraph shown in the footer under the brand name">
              <textarea style={ta} value={settings.footer_description || ''} onChange={e => setSetting('footer_description', e.target.value)} />
            </Field>
          </div>
          <SaveBtn saving={saving} />
          <Toast {...toast} />
        </form>
      )}

      {/* ── 🏠 OVERVIEW & HERO ── */}
      {tab === 'hero' && (
        <form onSubmit={saveHome}>
          <div style={card}>
            <h2 style={sectionTitle}>Overview Tab — Titles & Intro Text</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Region Label" hint='Small caps above the title, e.g. "KENYA · SAFARI & COAST"'>
                <input style={inp} value={(home.label as string) || ''} onChange={e => setH('label', e.target.value)} />
              </Field>
              <Field label="Main Trip Title" hint='e.g. "Kenya: Coast & Safari"'>
                <input style={inp} value={(home.title as string) || ''} onChange={e => setH('title', e.target.value)} />
              </Field>
              <Field label="YouTube Video ID" hint='e.g. dQw4w9WgXcQ (the part after youtube.com/watch?v=)'>
                <input style={inp} value={(home.video_youtube_id as string) || ''} onChange={e => setH('video_youtube_id', e.target.value)} />
              </Field>
            </div>
            <Field label="Subtitle / Trip Description" hint="1–2 sentences shown below the title">
              <textarea style={{ ...ta, minHeight: 80 }} value={(home.subtitle as string) || ''} onChange={e => setH('subtitle', e.target.value)} />
            </Field>
            <Field label="Intro Quote" hint="Bold italic opening line in the description area">
              <textarea style={{ ...ta, minHeight: 60 }} value={(home.intro_quote as string) || ''} onChange={e => setH('intro_quote', e.target.value)} />
            </Field>
            <Field label="Intro Body" hint="Longer paragraph below the quote">
              <textarea style={{ ...ta, minHeight: 140 }} value={(home.intro_body as string) || ''} onChange={e => setH('intro_body', e.target.value)} />
            </Field>
          </div>
          <SaveBtn saving={saving} />
          <Toast {...toast} />
        </form>
      )}

      {/* ── 🖼️ GALLERY ── */}
      {tab === 'gallery' && (
        <form onSubmit={saveHome}>
          <div style={card}>
            <h2 style={sectionTitle}>Homepage Hero Gallery</h2>
            <p style={{ fontSize: 12, color: '#777', marginBottom: 20 }}>
              The 5 images shown in the main gallery grid on the homepage. The <strong>first image</strong> is the large hero. Upload from your computer or paste a URL.
            </p>
            <GalleryEditor
              images={(home.gallery_images_json as { url: string; alt: string }[]) || []}
              onChange={v => setH('gallery_images_json', v)}
            />
          </div>
          <SaveBtn saving={saving} />
          <Toast {...toast} />
        </form>
      )}

      {/* ── 📊 FACTS & PRICING ── */}
      {tab === 'facts' && (
        <form onSubmit={saveHome}>
          <div style={card}>
            <h2 style={sectionTitle}>Pricing</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Price Low (€)" hint="Low season price per person">
                <input style={inp} type="number" value={(home.price_low as number) || 0} onChange={e => setH('price_low', Number(e.target.value))} />
              </Field>
              <Field label="Price High (€)" hint="High season price per person">
                <input style={inp} type="number" value={(home.price_high as number) || 0} onChange={e => setH('price_high', Number(e.target.value))} />
              </Field>
            </div>
            <Field label="Pricing Note" hint="Short text shown under the price (e.g. 'July, August, November & December are high season')">
              <textarea style={{ ...ta, minHeight: 60 }} value={(home.pricing_note as string) || ''} onChange={e => setH('pricing_note', e.target.value)} />
            </Field>
          </div>
          <div style={card}>
            <h2 style={sectionTitle}>Facts Strip</h2>
            <FactsEditor
              facts={(home.facts_json as { label: string; value: string }[]) || []}
              onChange={v => setH('facts_json', v)}
            />
          </div>
          <SaveBtn saving={saving} />
          <Toast {...toast} />
        </form>
      )}

      {/* ── ✅ INCLUSIONS ── */}
      {tab === 'inclusions' && (
        <form onSubmit={saveHome}>
          <div style={card}>
            <h2 style={sectionTitle}>What&apos;s Included</h2>
            <ListEditor
              label="Included items (one per row)"
              items={(home.inclusions_json as string[]) || []}
              onChange={v => setH('inclusions_json', v)}
              hint="Each item appears with a ✳ bullet in the Tour Package tab"
            />
          </div>
          <div style={card}>
            <h2 style={sectionTitle}>Not Included</h2>
            <Field label="Not Included Text" hint="Free-form text paragraph shown in the beige box">
              <textarea style={{ ...ta, minHeight: 120 }} value={(home.not_included_text as string) || ''} onChange={e => setH('not_included_text', e.target.value)} />
            </Field>
          </div>
          <div style={card}>
            <h2 style={sectionTitle}>Departure Calendar Note</h2>
            <Field label="Departure note text" hint="Shown below the departure calendar (e.g. 'Two Friday departures each month. Trips confirm at 6…')">
              <textarea style={ta} value={(home.departure_note as string) || ''} onChange={e => setH('departure_note', e.target.value)} />
            </Field>
          </div>
          <SaveBtn saving={saving} />
          <Toast {...toast} />
        </form>
      )}

      {/* ── 🦁 BIG FIVE ── */}
      {tab === 'bigfive' && (
        <form onSubmit={saveHome}>
          <div style={card}>
            <h2 style={sectionTitle}>Big Five Animals</h2>
            <p style={{ fontSize: 12, color: '#777', marginBottom: 20 }}>
              The 5 animals shown in the &quot;Wildlife encounters&quot; section of the Overview tab. Upload a photo for each.
            </p>
            <BigFiveEditor
              animals={(home.big_five_json as { name: string; image: string; caption: string }[]) || []}
              onChange={v => setH('big_five_json', v)}
            />
          </div>
          <SaveBtn saving={saving} />
          <Toast {...toast} />
        </form>
      )}

      {/* ── 👥 HOSTS & CONTACT ── */}
      {tab === 'hosts' && (
        <form onSubmit={saveHome}>
          <div style={card}>
            <h2 style={sectionTitle}>Your Hosts</h2>
            <Field label="Hosts Name(s)" hint="Shown as the h2 heading in the Hosts tab, e.g. 'Emmanuel Mweu & Peter Chacha'">
              <input style={inp} value={(home.hosts_name as string) || ''} onChange={e => setH('hosts_name', e.target.value)} />
            </Field>
            <Field label="Hosts Bio" hint="Paragraph shown in the bio card">
              <textarea style={{ ...ta, minHeight: 160 }} value={(home.hosts_bio as string) || ''} onChange={e => setH('hosts_bio', e.target.value)} />
            </Field>
            <UploadField
              label="Hosts Photo"
              value={(home.hosts_photo_url as string) || ''}
              folder="hosts"
              onChange={url => setH('hosts_photo_url', url)}
              hint="Photo of the hosts — shown in the bio card circle"
            />
          </div>
          <div style={card}>
            <h2 style={sectionTitle}>Contact Information</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <Field label="Contact Email">
                <input style={inp} type="email" value={(home.contact_email as string) || ''} onChange={e => setH('contact_email', e.target.value)} />
              </Field>
              <Field label="Contact Phone">
                <input style={inp} value={(home.contact_phone as string) || ''} onChange={e => setH('contact_phone', e.target.value)} />
              </Field>
              <Field label="Departure Base (shown in contact cards)">
                <input style={inp} value={(home.contact_address as string) || ''} onChange={e => setH('contact_address', e.target.value)} />
              </Field>
              <Field label="Instagram URL">
                <input style={inp} value={(home.contact_ig as string) || ''} onChange={e => setH('contact_ig', e.target.value)} />
              </Field>
            </div>
            <Field label="Contact Section Reply Note" hint="Shown below the WhatsApp button in the Contact tab">
              <textarea style={ta} value={(home.contact_reply_note as string) || ''} onChange={e => setH('contact_reply_note', e.target.value)} />
            </Field>
          </div>
          <SaveBtn saving={saving} />
          <Toast {...toast} />
        </form>
      )}

      {/* ── 📋 BOOKING SIDEBAR ── */}
      {tab === 'sidebar' && (
        <form onSubmit={saveHome}>
          <div style={card}>
            <h2 style={sectionTitle}>Booking Sidebar Card</h2>
            <p style={{ fontSize: 12, color: '#777', marginBottom: 20 }}>
              The card shown on the right side of the homepage with the price, CTA buttons, and bullet list.
            </p>
            <Field label="Sidebar Intro Text" hint="Small text under the price (e.g. 'High season Jul, Aug, Nov, Dec up to €2,700')">
              <textarea style={ta} value={(home.sidebar_intro as string) || ''} onChange={e => setH('sidebar_intro', e.target.value)} />
            </Field>
            <Field label="Reserve Note" hint="Small text below CTA buttons (e.g. 'Reserve for €0 · €200 deposit on confirmation')">
              <textarea style={{ ...ta, minHeight: 60 }} value={(home.sidebar_reserve_note as string) || ''} onChange={e => setH('sidebar_reserve_note', e.target.value)} />
            </Field>
            <ListEditor
              label="Sidebar Bullets (✓ list)"
              items={Array.isArray(home.sidebar_bullets_json) ? (home.sidebar_bullets_json as string[]) : []}
              onChange={v => setH('sidebar_bullets_json', v)}
              hint="e.g. 'Two Friday departures every month', 'Private jeep & guide included'"
            />
          </div>
          <SaveBtn saving={saving} />
          <Toast {...toast} />
        </form>
      )}

      {/* ── 📅 ITINERARY OVERVIEW ── */}
      {tab === 'itinerary' && (
        <div style={card}>
          <h2 style={sectionTitle}>Itinerary Day Cards</h2>
          <p style={{ fontSize: 13, color: '#555', marginBottom: 20 }}>
            Each day card on the homepage Itinerary tab, and the full day detail pages, are managed in the <strong>Itinerary Days</strong> section. Click a day to edit it — you can change the location, title, story, hero image, gallery photos, included/not-included items and videos.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[1,2,3,4,5,6,7,8,9].map(d => (
              <Link key={d} href={`/admin/days/${d}`}
                style={{ display: 'block', padding: '16px 18px', background: '#f4f5f3', border: '1px solid #e2e6df', borderRadius: 5, textDecoration: 'none', color: '#0f2219', fontWeight: 700, fontSize: 13, transition: 'background 0.15s' }}>
                📅 Day {String(d).padStart(2, '0')} →
              </Link>
            ))}
          </div>
          <p style={{ fontSize: 11, color: '#888', marginTop: 16 }}>
            Or go to <Link href="/admin/days" style={{ color: '#0f2219' }}>Itinerary Days overview</Link> to see all 9 days.
          </p>
        </div>
      )}

    </div>
  )
}
