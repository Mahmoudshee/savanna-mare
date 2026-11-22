-- Site settings
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Home page content
CREATE TABLE IF NOT EXISTS home_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL DEFAULT 'Kenya · Small group safari & coast',
  title TEXT NOT NULL DEFAULT 'Tsavo Safari & Watamu Coast',
  subtitle TEXT NOT NULL DEFAULT 'A nine-day coast-and-safari journey from Mombasa to Tsavo East and Watamu.',
  intro_quote TEXT NOT NULL DEFAULT 'Arrive curious. Leave with stories you''ll tell for years.',
  intro_body TEXT NOT NULL DEFAULT 'Begin in Mombasa, head inland for guided wildlife viewing in Tsavo East, then return to the coast. Discover the Marafa canyon, enjoy Watamu beaches and islands, and share the journey with experienced local guides.',
  facts_json JSONB NOT NULL DEFAULT '[]',
  gallery_images_json JSONB NOT NULL DEFAULT '[]',
  big_five_json JSONB NOT NULL DEFAULT '[]',
  inclusions_json JSONB NOT NULL DEFAULT '[]',
  not_included_text TEXT NOT NULL DEFAULT '',
  faq_text TEXT NOT NULL DEFAULT '',
  hosts_name TEXT NOT NULL DEFAULT 'Emmanuel Mweu & Peter Chacha',
  hosts_bio TEXT NOT NULL DEFAULT 'Shujaa Tours And Adventures was founded and is owned by directors Emmanuel Mweu and Peter Chacha. Their team brings local insight and personal care to every journey.',
  video_youtube_id TEXT NOT NULL DEFAULT 'e3O9ZXS-9fI',
  price_low INTEGER NOT NULL DEFAULT 2400,
  price_high INTEGER NOT NULL DEFAULT 2700,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Itinerary days
CREATE TABLE IF NOT EXISTS itinerary_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_number INTEGER UNIQUE NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  subtitle TEXT NOT NULL DEFAULT '',
  story_heading TEXT NOT NULL DEFAULT '',
  story_body TEXT NOT NULL DEFAULT '',
  hero_image_url TEXT NOT NULL DEFAULT '',
  sub_images_json JSONB NOT NULL DEFAULT '[]',
  videos_json JSONB NOT NULL DEFAULT '[]',
  gallery_json JSONB NOT NULL DEFAULT '[]',
  included_items TEXT[] NOT NULL DEFAULT '{}',
  not_included_items TEXT[] NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departures
CREATE TABLE IF NOT EXISTS departures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  arrival_date DATE UNIQUE NOT NULL,
  is_high_season BOOLEAN NOT NULL DEFAULT FALSE,
  price_low INTEGER,
  price_high INTEGER,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  notes TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  departure_id UUID REFERENCES departures(id),
  first_name TEXT NOT NULL,
  surname TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  room_preference TEXT NOT NULL DEFAULT 'shared',
  promo_code TEXT NOT NULL DEFAULT '',
  billing_json JSONB NOT NULL DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admin users (links to Supabase Auth)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin')),
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client users (from original worker.js schema)
CREATE TABLE IF NOT EXISTS shujaa_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  middle_name TEXT NOT NULL DEFAULT '',
  surname TEXT NOT NULL,
  gender TEXT NOT NULL,
  date_of_birth TEXT NOT NULL,
  nationality TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  contact_method TEXT NOT NULL DEFAULT '',
  verified_channel TEXT NOT NULL DEFAULT 'email',
  password_hash TEXT NOT NULL,
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES shujaa_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS verification_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  destination TEXT NOT NULL,
  channel TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  salt TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at BIGINT NOT NULL,
  data_json TEXT NOT NULL DEFAULT '{}',
  client_ip TEXT NOT NULL DEFAULT '',
  created_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier TEXT NOT NULL,
  client_ip TEXT NOT NULL,
  attempted_at BIGINT NOT NULL
);

-- Seed site settings
INSERT INTO site_settings (key, value) VALUES
  ('bar_text', 'Small groups · local knowledge · journeys made with care'),
  ('whatsapp_number', '254115119090'),
  ('whatsapp_message', 'Hello Shujaa Tours and Adventures, I''d like to ask about the Kenya trip.')
ON CONFLICT (key) DO NOTHING;

-- Seed home content
INSERT INTO home_content (
  label, title, subtitle, intro_quote, intro_body,
  facts_json, gallery_images_json, big_five_json, inclusions_json,
  not_included_text, faq_text, hosts_name, hosts_bio,
  video_youtube_id, price_low, price_high
) VALUES (
  'Kenya · Small group safari & coast',
  'Tsavo Safari & Watamu Coast',
  'A nine-day coast-and-safari journey from Mombasa to Tsavo East and Watamu.',
  'Arrive curious. Leave with stories you''ll tell for years.',
  'Begin in Mombasa, head inland for guided wildlife viewing in Tsavo East, then return to the coast. Discover the Marafa canyon, enjoy Watamu beaches and islands, and share the journey with experienced local guides.',
  '[{"label":"Duration","value":"9 days · 8 nights"},{"label":"Group size","value":"6–15 travellers"},{"label":"Travel style","value":"Safari & soft adventure"},{"label":"Start / finish","value":"Mombasa, Kenya"}]',
  '[{"url":"https://jemuexpeditions.com/assest/images/tsavo-east-national-park-banner.webp","alt":"Red elephants in Tsavo East National Park"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Red_elephant_in_dirt.jpg/1280px-Red_elephant_in_dirt.jpg","alt":"Red elephant on the Tsavo plains"},{"url":"https://www.edenhousecottages.com/assets/img/activities/hell-kitchen.jpg","alt":"Marafa Hell''s Kitchen canyon formations"},{"url":"https://multimedia.alpitour.it/images/225865/P_504631.webp","alt":"Aerial view of Watamu beach"},{"url":"https://upload.wikimedia.org/wikipedia/commons/9/91/Mbaraki_road.JPG","alt":"Mombasa Old Town architecture"}]',
  '[{"name":"Lion","image":"/assets/big-five/tsavo-east-lionesses.jpeg","caption":"Tsavo East National Park · photo supplied by Shujaa"},{"name":"Leopard","image":"https://commons.wikimedia.org/wiki/Special:FilePath/Leopard_on_mount_in_Tsavo_East_National_Park.jpg?width=900","caption":"Tsavo East National Park"},{"name":"Elephant","image":"/assets/big-five/kenya-safari-elephant.jpeg","caption":"Kenya safari · photo supplied by Shujaa"},{"name":"Rhino","image":"https://commons.wikimedia.org/wiki/Special:FilePath/Black_rhino_at_Nairobi_National_Park.jpg?width=900","caption":"Nairobi National Park, Kenya"},{"name":"Buffalo","image":"https://commons.wikimedia.org/wiki/Special:FilePath/African_buffalo_kenya.jpg?width=900","caption":"Kenya"}]',
  '["Tsavo East safari from Days 2–5, with a professional guide and private jeep","Three nights at a 3- or 4-star savannah resort, full board, overlooking a wildlife watering spring","Four nights in Watamu at a private villa or 4-star hotel/resort with a pool","One night in a beachfront Mombasa hotel with a pool","Private jeep, professional guide and driver from Days 2–6","Park fees and tickets, including Marafa Hell''s Kitchen entrance","Full board on Tsavo East safari stay days, plus the included savannah aperitif and Marafa sunset aperitif","Full-time coordinator assistance; free trip changes up to 31 days before departure"]',
  'International return flights, meals and drinks where not specifically listed, extra drinks, the optional night safari, optional activities and personal purchases. A shared activity fund of approximately €150 is planned for group-chosen extras; confirm the contribution details with the coordinator.',
  'International flights are not included. The recommended airport is Moi International Airport (MBA), Mombasa. Ask our team about dates, room options, entry requirements and what to pack.',
  'Emmanuel Mweu & Peter Chacha',
  'Shujaa Tours And Adventures was founded and is owned by directors Emmanuel Mweu and Peter Chacha. Their team brings local insight and personal care to every journey.',
  'e3O9ZXS-9fI',
  2400,
  2700
) ON CONFLICT DO NOTHING;

-- Seed all 9 itinerary days
INSERT INTO itinerary_days (day_number, location, title, subtitle, story_heading, story_body, hero_image_url, sub_images_json, videos_json, included_items, not_included_items) VALUES
(1, 'Mombasa', 'Check in & meet', 'Your Kenya adventure begins by the Indian Ocean.', 'Mombasa',
 'Arrive in Mombasa on Friday and meet your fellow travellers at City Blue Creekside Hotel, the group''s check-in and meeting point. Flights are not included, so please arrange to arrive in time for the group meet-up. After check-in, spend the afternoon getting to know one another, stroll through Mombasa Old Town or take a dip in the sea, depending on what everyone feels like.',
 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mbaraki_road.JPG',
 '[{"url":"https://i0.wp.com/www.thehungrytravellers.blog/wp-content/uploads/2024/08/IMG_5244.jpeg?resize=768,1024","alt":"A sunlit alley in Mombasa Old Town"},{"url":"https://multimedia.alpitour.it/images/225865/P_504631.webp","alt":"Watamu coast and clear Indian Ocean"}]',
 '[{"type":"youtube","src":"0jqUrrY_lws","caption":"Watch: Mombasa Old Town walking tour"},{"type":"local","src":"/assets/day-01/mombasa-arrival.mp4","caption":"Watch: Mombasa with Shujaa Tours · Guest footage"}]',
 ARRAY['Friday arrival, group meet-up and one night at City Blue Creekside Hotel in Mombasa', 'Afternoon to explore together at the group''s pace'],
 ARRAY['Meals and drinks on Day 1', 'International flights']),

(2, 'Tsavo East', 'First game drive', 'Meet your guide and head inland into safari country.', 'Tsavo East',
 'Meet your professional safari guide, load your bags into the private jeeps and travel from Mombasa to Tsavo East. After the drive, settle into your lodge with an en-suite bathroom, then head out for your first chance to spot wildlife and the Big Five.',
 'https://jemuexpeditions.com/assest/images/tsavo-east-national-park-banner.webp',
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Red_elephant_in_dirt.jpg/1280px-Red_elephant_in_dirt.jpg","alt":"A red-dusted elephant in Tsavo East"},{"url":"/assets/day-02/safari-binoculars.jpeg","alt":"Safari binoculars ready for a Tsavo East game drive"}]',
 '[{"type":"youtube","src":"M91rRUhdKAQ","caption":"Watch: Tsavo East: Theatre of the Wild"},{"type":"local","src":"/assets/day-02/tsavo-first-game-drive.mp4","caption":"Watch: First game drive in Tsavo East · Shujaa footage"},{"type":"local","src":"/assets/day-02/tsavo-safari-footage.mp4","caption":"Watch: Tsavo East safari moments · Shujaa footage"}]',
 ARRAY['Professional safari guide and private jeep', 'Full-board service at the Tsavo East lodge', 'Three nights at a 3- or 4-star savannah resort'],
 ARRAY['Extra drinks']),

(3, 'Tsavo East', 'A day in the savannah', 'Early wildlife viewing, a lodge pool break and a bush aperitif.', 'Tsavo East',
 'Spend a full day in Tsavo East with your guide. Early morning and late afternoon are the best times to spot wildlife, so the day follows the rhythm of the bush. Cool off at the lodge pool in the midday heat, and end the day with an included bush aperitif overlooking the wildlife watering spring.',
 'https://jemuexpeditions.com/assest/images/tsavo-east-national-park-banner.webp',
 '[{"url":"/assets/day-03/tsavo-game-drive-vehicle.jpeg","alt":"Safari vehicle on a game drive in Tsavo East"},{"url":"/assets/day-03/tsavo-zebras.jpeg","alt":"Zebras on the Tsavo plains"}]',
 '[]',
 ARRAY['Full day with private jeep and professional guide', 'Full-board accommodation', 'Bush aperitif at the watering spring'],
 ARRAY['Extra drinks', 'Optional night safari']),

(4, 'Tsavo East', 'Searching for the Big Five', 'Spend another full day exploring the park with your guide.', 'Tsavo East',
 'Another full day in Tsavo East, with the focus on wildlife. Your guide knows the park well and will navigate the best routes to find lions, elephants and more. This is a day for patience and reward.',
 '/assets/day-04/tsavo-lion-in-savannah.jpeg',
 '[{"url":"/assets/day-04/tsavo-lions-resting.jpeg","alt":"Lions resting in the shade in Tsavo East"}]',
 '[]',
 ARRAY['Full day game drive with private jeep and professional guide', 'Full-board accommodation'],
 ARRAY['Extra drinks', 'Optional night safari']),

(5, 'Tsavo to the coast', 'One last safari', 'One final drive, then onward to new adventures.', 'Tsavo to the coast',
 'Before leaving Tsavo East, take one last jeep drive through the park and make time for final wildlife photographs. Then get back on the road and continue toward the coast. Your private jeep, guide and park entrance are included for this day.',
 'https://images.musement.com/cover/0163/05/thumb_16204085_cover_header.jpg?fit=crop&h=630&q=95&w=1200',
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Red_elephant_in_dirt.jpg/1280px-Red_elephant_in_dirt.jpg","alt":"Elephant on the Tsavo plains"},{"url":"https://multimedia.alpitour.it/images/225865/P_504631.webp","alt":"Watamu coast and clear Indian Ocean"}]',
 '[{"type":"youtube","src":"e3O9ZXS-9fI","caption":"Watch: Tsavo East: Theatre of the Wild"}]',
 ARRAY['Private jeep and guide', 'Park entrance'],
 ARRAY['Meals and drinks']),

(6, 'Gede · Local village · Marafa', 'Village, ruins & sunset', 'Discover coastal village life and Swahili history before a sunset visit to Marafa Hell''s Kitchen.', 'Village, Gede Ruins & Marafa',
 'Spend the day discovering the coast''s local life and history. Visit a nearby village, explore the ancient Swahili settlement at Gede Ruins, and browse the tourist market for souvenirs. Later, travel to Marafa Hell''s Kitchen to take in the dramatic sandstone landscape at sunset and enjoy an aperitif.',
 'https://commons.wikimedia.org/wiki/Special:FilePath/Forest_pathway_along_ancient_coral_walls_at_Gedi_Ruins.jpg?width=1400',
 '[{"url":"/assets/day-06/souvenir-market-visitors.jpeg","alt":"Visitors browse locally made souvenirs in a Kenyan craft market"},{"url":"/assets/day-06/marafa-monkey.jpeg","alt":"A monkey at Marafa Hell''s Kitchen, with the canyon at sunset"}]',
 '[{"type":"local","src":"/assets/day-06/marafa-hells-kitchen.mp4","poster":"/assets/day-06/marafa-monkey.jpeg","caption":"Watch: Marafa Hell''s Kitchen · Shujaa footage"},{"type":"local","src":"/assets/day-06/marafa-sunset.mp4","poster":"/assets/day-06/marafa-sunset-wide.jpeg","caption":"Watch: Marafa sunset · Shujaa footage"}]',
 ARRAY['Visit to a local village', 'Gede Ruins and the tourist market for souvenirs', 'Marafa Hell''s Kitchen visit for sunset and aperitif'],
 ARRAY['Souvenir purchases and any meals or drinks not specified in your booking']),

(7, 'Watamu Blue Safari', 'Blue Safari by boat', 'Look for dolphins in season, snorkel the marine park, cruise mangroves and enjoy a fresh seafood lunch.', 'Watamu Blue Safari',
 'Spend the day on the water. The Blue Safari takes you out to look for dolphins in season, snorkel the Watamu Marine National Park, cruise the mangrove channels and enjoy a fresh seafood lunch on a sandbank or at a local restaurant.',
 'https://www.watamu.net/wp-content/uploads/2019/09/watamu-marine-park.jpg',
 '[]',
 '[]',
 ARRAY['Full-day boat safari', 'Marine park entry', 'Seafood lunch'],
 ARRAY['Drinks', 'Tips']),

(8, 'Watamu', 'Beach & island day', 'Slow down by the sea around Sardegna Due Island.', 'Watamu',
 'A slower day on the coast. Take a boat out to Sardegna Due Island and spend the day swimming, relaxing and exploring the sandbanks. Dinner at Lichthaus with the group.',
 '/assets/day-08/lichthaus-creekside.jpeg',
 '[{"url":"/assets/day-08/lichthaus-dining-1.jpeg","alt":"Group dining at Lichthaus restaurant"},{"url":"/assets/day-08/lichthaus-sunset-group.jpeg","alt":"Group at sunset at Lichthaus"}]',
 '[{"type":"local","src":"/assets/day-08/sardegna-due-island.mp4","caption":"Watch: Sardegna Due Island · Shujaa footage"},{"type":"local","src":"/assets/day-08/sardegna-due-moments.mp4","caption":"Watch: Island moments · Shujaa footage"}]',
 ARRAY['Boat to Sardegna Due Island', 'Group dinner at Lichthaus'],
 ARRAY['Drinks', 'Tips']),

(9, 'Mombasa', 'Kwahaeri, Kenya', 'Return to Mombasa for your onward journey.', 'Farewell',
 'The final day brings the group together for a farewell breakfast before departing for the airport. It''s been a journey of red dust, turquoise water and new friendships.',
 '/assets/day-09/airport-farewell-group.jpeg',
 '[{"url":"/assets/day-09/last-group-selfie.jpeg","alt":"Last group selfie before departing"},{"url":"/assets/day-09/farewell-group-by-van.jpeg","alt":"Group farewell by the van"}]',
 '[]',
 ARRAY['Transfer to Mombasa airport'],
 ARRAY['International flights', 'Meals on departure day'])

ON CONFLICT (day_number) DO NOTHING;

-- Enable Row Level Security (RLS) - public read for site content
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE home_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE itinerary_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE departures ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE shujaa_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE verification_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Public read policies for site content
CREATE POLICY "Public read site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public read home_content" ON home_content FOR SELECT USING (true);
CREATE POLICY "Public read itinerary_days" ON itinerary_days FOR SELECT USING (true);
CREATE POLICY "Public read active departures" ON departures FOR SELECT USING (is_active = true);

-- Service role can do everything
CREATE POLICY "Service role all site_settings" ON site_settings USING (auth.role() = 'service_role');
CREATE POLICY "Service role all home_content" ON home_content USING (auth.role() = 'service_role');
CREATE POLICY "Service role all itinerary_days" ON itinerary_days USING (auth.role() = 'service_role');
CREATE POLICY "Service role all departures" ON departures USING (auth.role() = 'service_role');
CREATE POLICY "Service role all bookings" ON bookings USING (auth.role() = 'service_role');
CREATE POLICY "Service role all admin_users" ON admin_users USING (auth.role() = 'service_role');
CREATE POLICY "Service role all shujaa_users" ON shujaa_users USING (auth.role() = 'service_role');
CREATE POLICY "Service role all sessions" ON sessions USING (auth.role() = 'service_role');
CREATE POLICY "Service role all verification_challenges" ON verification_challenges USING (auth.role() = 'service_role');
CREATE POLICY "Service role all login_attempts" ON login_attempts USING (auth.role() = 'service_role');

