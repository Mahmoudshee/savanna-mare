import { requireAdminSession } from '@/lib/admin-auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const session = await requireAdminSession()
  if (!session) redirect('/admin/login')

  // Fetch stats from Supabase — gracefully handles network errors
  let bookingCount = 0
  let departureCount = 0
  let recentBookings: Array<{ id: string; first_name: string; surname: string; email: string; status: string; created_at: string }> = []

  try {
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!
    const headers = { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }

    const [bcRes, dcRes, rbRes] = await Promise.all([
      fetch(`${SUPABASE_URL}/rest/v1/bookings?select=count`, { headers, next: { revalidate: 0 } }),
      fetch(`${SUPABASE_URL}/rest/v1/departures?select=count&is_active=eq.true`, { headers, next: { revalidate: 0 } }),
      fetch(`${SUPABASE_URL}/rest/v1/bookings?select=id,first_name,surname,email,status,created_at&order=created_at.desc&limit=5`, { headers, next: { revalidate: 0 } }),
    ])
    if (bcRes.ok) { const d = await bcRes.json(); bookingCount = Array.isArray(d) ? d.length : 0 }
    if (dcRes.ok) { const d = await dcRes.json(); departureCount = Array.isArray(d) ? d.length : 0 }
    if (rbRes.ok) { recentBookings = await rbRes.json() }
  } catch {
    // Network unavailable — show zeros, that's fine
  }

  return (
    <div>
      <h1 style={{ font: '500 32px var(--font-playfair,Playfair Display),serif', margin: '0 0 8px' }}>
        Welcome back{session.displayName ? `, ${session.displayName}` : ''}
      </h1>
      <p style={{ color: 'var(--muted)', fontSize: 13, margin: '0 0 32px' }}>Savanna & Mare Adventures · Admin panel</p>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,minmax(0,1fr))', gap: 20, marginBottom: 36 }}>
        {[
          { label: 'Total enquiries', value: bookingCount, color: 'var(--coral)' },
          { label: 'Active departures', value: departureCount, color: 'var(--green)' },
          { label: 'Admin role', value: session.role === 'super_admin' ? 'Super admin' : 'Admin', color: 'var(--moss)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#fff', border: '1px solid var(--line)', padding: 24, borderRadius: 4 }}>
            <div style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 700 }}>{label}</div>
            <div style={{ font: '500 36px var(--font-playfair,Playfair Display),serif', color, margin: '8px 0 0' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div style={{ background: '#fff', border: '1px solid var(--line)', borderRadius: 4, overflow: 'hidden' }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ font: '500 20px var(--font-playfair,Playfair Display),serif', margin: 0 }}>Recent enquiries</h2>
          <a href="/admin/bookings" style={{ fontSize: 11, color: 'var(--coral)', fontWeight: 700 }}>View all →</a>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr style={{ background: '#f9f8f5' }}>
              {['Name', 'Email', 'Status', 'Date'].map(h => (
                <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted)', borderBottom: '1px solid var(--line)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentBookings.map((b) => (
              <tr key={b.id} style={{ borderBottom: '1px solid #f0ede7' }}>
                <td style={{ padding: '12px 16px' }}>{b.first_name} {b.surname}</td>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>{b.email}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ display: 'inline-block', padding: '3px 8px', borderRadius: 3, fontSize: 10, fontWeight: 700, background: b.status === 'confirmed' ? '#e8f7ec' : b.status === 'cancelled' ? '#fef2f2' : '#f1eee5', color: b.status === 'confirmed' ? '#245a38' : b.status === 'cancelled' ? '#a43d2c' : '#78542a' }}>
                    {b.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--muted)', fontSize: 11 }}>
                  {new Date(b.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                </td>
              </tr>
            ))}
            {recentBookings.length === 0 && (
              <tr><td colSpan={4} style={{ padding: '24px 16px', textAlign: 'center', color: 'var(--muted)', fontSize: 12 }}>No enquiries yet — bookings made via the site will appear here.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
