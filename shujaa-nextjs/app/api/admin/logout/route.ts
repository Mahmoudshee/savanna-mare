import { NextResponse } from 'next/server'
import { clearAdminCookie } from '@/lib/admin-auth'

export async function POST(request: Request) {
  clearAdminCookie()
  // Build absolute URL from the incoming request's origin
  const origin = new URL(request.url).origin
  return NextResponse.redirect(`${origin}/admin/login`)
}
