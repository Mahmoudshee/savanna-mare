'use client'
import { useState } from 'react'

// ── Shared styles ──────────────────────────────────────────────────────────
const inp: React.CSSProperties = {
  width: '100%', height: 44, border: '1px solid #d9ddd5', borderRadius: 3,
  padding: '0 12px', fontSize: 13, fontFamily: 'DM Sans,sans-serif',
  background: '#fff', boxSizing: 'border-box', outline: 'none',
}
const lbl: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, letterSpacing: '0.07em',
  textTransform: 'uppercase' as const, color: '#444', display: 'block', marginBottom: 6,
}
const card: React.CSSProperties = {
  background: '#fff', border: '1px solid #e2e6df', borderRadius: 6,
  padding: '28px 28px', marginBottom: 24,
}
const sectionTitle: React.CSSProperties = {
  font: '500 20px Georgia,serif', margin: '0 0 6px',
}

function Toast({ msg, ok }: { msg: string; ok: boolean }) {
  if (!msg) return null
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 4, fontSize: 12, marginTop: 12,
      background: ok ? '#ecfdf5' : '#fef2f2',
      color: ok ? '#065f46' : '#b91c1c',
      border: `1px solid ${ok ? '#6ee7b7' : '#fca5a5'}`,
    }}>
      {ok ? '✅' : '❌'} {msg}
    </div>
  )
}

function SaveBtn({ saving, label = 'Save' }: { saving: boolean; label?: string }) {
  return (
    <button type="submit" disabled={saving} style={{
      background: '#0f2219', color: '#fff', border: 'none', borderRadius: 3,
      padding: '11px 24px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em',
      cursor: saving ? 'wait' : 'pointer', opacity: saving ? 0.7 : 1,
    }}>
      {saving ? 'Saving…' : label}
    </button>
  )
}

// ── Change Password Panel ──────────────────────────────────────────────────
function ChangePasswordPanel() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirm: '' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', ok: true })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.newPassword !== form.confirm) {
      setToast({ msg: 'New passwords do not match', ok: false }); return
    }
    if (form.newPassword.length < 8) {
      setToast({ msg: 'Password must be at least 8 characters', ok: false }); return
    }
    setSaving(true)
    setToast({ msg: '', ok: true })
    const res = await fetch('/api/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setToast({ msg: 'Password updated successfully!', ok: true })
      setForm({ currentPassword: '', newPassword: '', confirm: '' })
    } else {
      setToast({ msg: data.error || 'Failed to update password', ok: false })
    }
  }

  return (
    <div style={card}>
      <h2 style={sectionTitle}>Change Your Password</h2>
      <p style={{ fontSize: 12, color: '#777', margin: '0 0 20px' }}>
        Update the password used to sign in to this admin panel.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 440 }}>
        <div>
          <label style={lbl}>Current Password</label>
          <input type="password" required value={form.currentPassword} style={inp}
            onChange={e => setForm(f => ({ ...f, currentPassword: e.target.value }))}
            placeholder="Your current password" />
        </div>
        <div>
          <label style={lbl}>New Password</label>
          <input type="password" required value={form.newPassword} style={inp}
            onChange={e => setForm(f => ({ ...f, newPassword: e.target.value }))}
            placeholder="Min 8 characters" />
        </div>
        <div>
          <label style={lbl}>Confirm New Password</label>
          <input type="password" required value={form.confirm} style={inp}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            placeholder="Repeat new password" />
        </div>
        <div>
          <SaveBtn saving={saving} label="Update Password" />
        </div>
        <Toast msg={toast.msg} ok={toast.ok} />
      </form>
    </div>
  )
}

// ── Create Admin User Panel ────────────────────────────────────────────────
function CreateAdminPanel() {
  const [form, setForm] = useState({ displayName: '', email: '', password: '', confirm: '', role: 'admin' })
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState({ msg: '', ok: true })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (form.password !== form.confirm) {
      setToast({ msg: 'Passwords do not match', ok: false }); return
    }
    if (form.password.length < 8) {
      setToast({ msg: 'Password must be at least 8 characters', ok: false }); return
    }
    setSaving(true)
    setToast({ msg: '', ok: true })
    const res = await fetch('/api/admin/add-admin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email.trim().toLowerCase(),
        password: form.password,
        displayName: form.displayName.trim(),
        role: form.role,
      }),
    })
    const data = await res.json()
    setSaving(false)
    if (res.ok) {
      setToast({ msg: `Admin account created for ${form.email}`, ok: true })
      setForm({ displayName: '', email: '', password: '', confirm: '', role: 'admin' })
    } else {
      setToast({ msg: data.error || 'Failed to create admin', ok: false })
    }
  }

  return (
    <div style={card}>
      <h2 style={sectionTitle}>Create New Admin User</h2>
      <p style={{ fontSize: 12, color: '#777', margin: '0 0 20px' }}>
        Add another person who can access and manage this CMS dashboard.
      </p>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 440 }}>
        <div>
          <label style={lbl}>Full Name</label>
          <input type="text" required value={form.displayName} style={inp}
            onChange={e => setForm(f => ({ ...f, displayName: e.target.value }))}
            placeholder="e.g. Peter Chacha" />
        </div>
        <div>
          <label style={lbl}>Email Address</label>
          <input type="email" required value={form.email} style={inp}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="newadmin@savannamare.com" />
        </div>
        <div>
          <label style={lbl}>Password</label>
          <input type="password" required value={form.password} style={inp}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Min 8 characters" />
        </div>
        <div>
          <label style={lbl}>Confirm Password</label>
          <input type="password" required value={form.confirm} style={inp}
            onChange={e => setForm(f => ({ ...f, confirm: e.target.value }))}
            placeholder="Repeat password" />
        </div>
        <div>
          <label style={lbl}>Role</label>
          <select value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
            style={{ ...inp, height: 44, cursor: 'pointer' }}>
            <option value="admin">Admin</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>
        <div>
          <SaveBtn saving={saving} label="Create Admin Account" />
        </div>
        <Toast msg={toast.msg} ok={toast.ok} />
      </form>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function AdminAccountPage() {
  return (
    <div>
      <h1 style={{ font: '500 32px Georgia,serif', margin: '0 0 6px' }}>Account & Users</h1>
      <p style={{ fontSize: 13, color: '#777', margin: '0 0 32px' }}>
        Manage admin access — change your password or add a new admin user.
      </p>

      <ChangePasswordPanel />
      <CreateAdminPanel />
    </div>
  )
}

