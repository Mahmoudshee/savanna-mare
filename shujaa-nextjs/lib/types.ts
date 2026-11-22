export interface SiteSettings {
  key: string
  value: string
  updated_at: string
}

export interface HomeContent {
  id: string
  label: string
  title: string
  subtitle: string
  intro_quote: string
  intro_body: string
  facts_json: { label: string; value: string }[]
  gallery_images_json: { url: string; alt: string }[]
  big_five_json: { name: string; image: string; caption: string }[]
  inclusions_json: string[]
  not_included_text: string
  faq_text: string
  hosts_name: string
  hosts_bio: string
  hosts_photo_url: string
  video_youtube_id: string
  price_low: number
  price_high: number
  pricing_note: string
  departure_note: string
  // Contact
  contact_email: string
  contact_phone: string
  contact_address: string
  contact_ig: string
  contact_reply_note: string
  // Sidebar
  sidebar_intro: string
  sidebar_reserve_note: string
  sidebar_bullets_json: string[]
  updated_at: string
}

export interface ItineraryDay {
  id: string
  day_number: number
  location: string
  title: string
  subtitle: string
  story_heading: string
  story_body: string
  hero_image_url: string
  sub_images_json: { url: string; alt: string }[]
  videos_json: { type: 'youtube' | 'local'; src: string; poster?: string; caption: string }[]
  gallery_json: { url: string; alt: string; caption?: string }[]
  included_items: string[]
  not_included_items: string[]
  updated_at: string
}

export interface Departure {
  id: string
  arrival_date: string
  is_high_season: boolean
  price_low: number | null
  price_high: number | null
  is_active: boolean
  notes: string
  created_at: string
}

export interface Booking {
  id: string
  departure_id: string
  first_name: string
  surname: string
  email: string
  phone: string
  room_preference: 'shared' | 'own'
  promo_code: string
  billing_json: Record<string, string>
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

export interface AdminUser {
  id: string
  email: string
  display_name: string
  role: 'super_admin' | 'admin'
  created_by: string | null
  created_at: string
}
