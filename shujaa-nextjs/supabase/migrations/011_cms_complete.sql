-- Migration 011: Ensure storage bucket allows service_role upsert
-- Service role bypasses RLS by default, but be explicit for clarity

DROP POLICY IF EXISTS "Service role upload site-images" ON storage.objects;
CREATE POLICY "Service role upload site-images" ON storage.objects
  FOR ALL TO service_role
  USING (bucket_id = 'site-images')
  WITH CHECK (bucket_id = 'site-images');

-- Ensure home_content has all extra CMS columns (idempotent)
ALTER TABLE home_content
  ADD COLUMN IF NOT EXISTS hosts_photo_url      TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_email        TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_phone        TEXT NOT NULL DEFAULT '+254 115 119 090',
  ADD COLUMN IF NOT EXISTS contact_address      TEXT NOT NULL DEFAULT 'Mombasa, Kenya',
  ADD COLUMN IF NOT EXISTS contact_ig           TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sidebar_bullets_json JSONB NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS sidebar_intro        TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS sidebar_reserve_note TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS pricing_note         TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS departure_note       TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS contact_reply_note   TEXT NOT NULL DEFAULT '';

-- Ensure site_settings has all needed keys
INSERT INTO site_settings (key, value) VALUES
  ('site_name',           'SAVANNA & MARE ADVENTURES'),
  ('bar_text',            'Small groups · local knowledge · journeys made with care'),
  ('whatsapp_number',     '254115119090'),
  ('whatsapp_message',    'Hello Savanna & Mare Adventures, I''d like to ask about the Kenya trip.'),
  ('contact_email',       ''),
  ('contact_phone',       '+254 115 119 090'),
  ('contact_address',     'Mombasa, Kenya'),
  ('instagram_url',       ''),
  ('facebook_url',        ''),
  ('footer_description',  'Small-group safaris and coastal journeys rooted in local knowledge and genuine care. Founded by Emmanuel Mweu & Peter Chacha.')
ON CONFLICT (key) DO NOTHING;

