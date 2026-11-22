import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Public endpoint — no admin auth required.
// Saves enquiry submissions to the bookings table so they appear in the Admin CMS.
const anonClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Use service role to bypass RLS for the insert (anon RLS policy may not be set)
const serviceClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {
  try {
    const body = await req.json() as Record<string, string>

    const {
      'First Name': firstName = '',
      'Surname': surname = '',
      'email': email = '',
      'Phone / WhatsApp': phone = '',
      'Nationality': nationality = '',
      'Number of Travellers': travellers = '',
      'Room Preference': roomPreference = 'Shared',
      'message': message = '',
      departure_date = '',
      departure_window = '',
      departure_price = '',
    } = body

    // Pack extra fields into billing_json (the catch-all JSONB column)
    const billingJson = {
      nationality,
      travellers,
      departure_date,
      departure_window,
      departure_price,
      message,
    }

    const { error } = await serviceClient.from('bookings').insert({
      first_name: firstName || 'Unknown',
      surname: surname || '-',
      email: email || '',
      phone: phone || '',
      room_preference: roomPreference || 'shared',
      promo_code: '',
      billing_json: billingJson,
      status: 'pending',
    })

    if (error) {
      console.error('Enquiry DB save error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Enquiry save error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

