import { NextResponse } from 'next/server'
import { guardAdmin, SUPABASE_URL, SERVICE_KEY } from '@/lib/admin-db'

// POST /api/admin/upload
// FormData: file (File), path (string, e.g. "gallery/day-1/image.jpg")
export async function POST(req: Request) {
  if (!await guardAdmin()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  const pathInput = (formData.get('path') as string) || ''

  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const ext = file.name.split('.').pop() || 'jpg'
  const safePath = pathInput || `uploads/${Date.now()}.${ext}`

  const bytes = await file.arrayBuffer()

  const uploadRes = await fetch(`${SUPABASE_URL()}/storage/v1/object/site-images/${safePath}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${SERVICE_KEY()}`,
      'Content-Type': file.type || 'image/jpeg',
      'x-upsert': 'true',
    },
    body: bytes,
  })

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}))
    return NextResponse.json({ error: err.message || 'Upload failed' }, { status: 500 })
  }

  const publicUrl = `${SUPABASE_URL()}/storage/v1/object/public/site-images/${safePath}`
  return NextResponse.json({ url: publicUrl, path: safePath })
}

