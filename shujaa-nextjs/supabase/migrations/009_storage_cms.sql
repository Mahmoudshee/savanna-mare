-- Storage bucket for site images
INSERT INTO storage.buckets (id, name, public)
VALUES ('site-images', 'site-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies
DROP POLICY IF EXISTS "Public read site-images" ON storage.objects;
CREATE POLICY "Public read site-images" ON storage.objects
  FOR SELECT USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Admin upload site-images" ON storage.objects;
CREATE POLICY "Admin upload site-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Admin update site-images" ON storage.objects;
CREATE POLICY "Admin update site-images" ON storage.objects
  FOR UPDATE TO authenticated USING (bucket_id = 'site-images');

DROP POLICY IF EXISTS "Admin delete site-images" ON storage.objects;
CREATE POLICY "Admin delete site-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'site-images');

-- Extra fields on home_content
ALTER TABLE home_content ADD COLUMN IF NOT EXISTS hosts_photo_url TEXT NOT NULL DEFAULT '';
ALTER TABLE home_content ADD COLUMN IF NOT EXISTS contact_email   TEXT NOT NULL DEFAULT '';
ALTER TABLE home_content ADD COLUMN IF NOT EXISTS contact_phone   TEXT NOT NULL DEFAULT '+254 115 119 090';
ALTER TABLE home_content ADD COLUMN IF NOT EXISTS contact_address TEXT NOT NULL DEFAULT 'Mombasa, Kenya';
ALTER TABLE home_content ADD COLUMN IF NOT EXISTS contact_ig      TEXT NOT NULL DEFAULT '';
ALTER TABLE home_content ADD COLUMN IF NOT EXISTS sidebar_bullets_json JSONB NOT NULL DEFAULT '[]';

-- Seed site_settings
INSERT INTO site_settings (key, value) VALUES
  ('site_name',         'SAVANNA & MARE ADVENTURES'),
  ('tagline_bar',       'Small groups · Local knowledge · Journeys made with care'),
  ('whatsapp_number',   '254115119090'),
  ('whatsapp_message',  'Hello Savanna & Mare Adventures, I''d like to ask about the Kenya trip.'),
  ('bar_text',          'Small groups · local knowledge · journeys made with care'),
  ('contact_email',     ''),
  ('contact_phone',     '+254 115 119 090'),
  ('contact_address',   'Mombasa, Kenya'),
  ('instagram_url',     ''),
  ('facebook_url',      ''),
  ('footer_description','Small-group safaris and coastal journeys rooted in local knowledge and genuine care. Founded by Emmanuel Mweu & Peter Chacha.')
ON CONFLICT (key) DO NOTHING;

-- Grant full service_role access on storage
GRANT ALL ON storage.objects TO service_role;
GRANT ALL ON storage.buckets TO service_role;

