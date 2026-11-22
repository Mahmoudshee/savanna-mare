-- ============================================================
-- 012: Seed full 9-day itinerary + tour-package home_content
-- ============================================================

-- ── Itinerary Days ──────────────────────────────────────────
DELETE FROM itinerary_days;

INSERT INTO itinerary_days
  (day_number, location, title, subtitle, story_heading, story_body, hero_image_url, sub_images_json, included_items, not_included_items, gallery_json)
VALUES

-- DAY 1
(1, 'Mombasa', 'Arrival & Meeting Your Crew',
 'Your Kenya adventure starts by the Indian Ocean shore.',
 'Welcome to Mombasa',
 'Arrive in Mombasa — the gateway to East Africa''s coast — and settle into City Blue Creekside Hotel, your group''s base for the first night. Flights are not included, so please arrange to land before 3 pm to join the group meet-up. Afternoon is free: explore Mombasa Old Town''s narrow Swahili lanes, glimpse Fort Jesus, and soak up the warm salt air. In the evening the whole group gathers for a welcome dinner on the hotel terrace, where Emmanuel and Peter walk you through every day of the adventure ahead.',
 'https://upload.wikimedia.org/wikipedia/commons/9/91/Mbaraki_road.JPG',
 '[{"url":"https://i0.wp.com/www.thehungrytravellers.blog/wp-content/uploads/2024/08/IMG_5244.jpeg?resize=768,1024","alt":"Sunlit alley in Mombasa Old Town"},{"url":"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f5/e3/68/fort-jesus.jpg?w=1200&h=-1&s=1","alt":"Fort Jesus at sunset"}]',
 ARRAY['Welcome dinner','Group briefing','Hotel check-in support'],
 ARRAY['Flights to Mombasa','Travel insurance'],
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/9/91/Mbaraki_road.JPG","alt":"Mombasa waterfront","caption":"Mombasa waterfront"},{"url":"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/f5/e3/68/fort-jesus.jpg?w=1200&h=-1&s=1","alt":"Fort Jesus","caption":"Fort Jesus"},{"url":"https://i0.wp.com/www.thehungrytravellers.blog/wp-content/uploads/2024/08/IMG_5244.jpeg?resize=768,1024","alt":"Old Town alley","caption":"Old Town alley"}]'
),

-- DAY 2
(2, 'Tsavo East', 'Into the Red Dust — Tsavo East Arrival',
 'Four hours north through Kenya''s arid heartland to the country''s largest national park.',
 'The Great Red Plains of Tsavo',
 'After an early breakfast we load the 4×4s and head north on the Mombasa–Nairobi highway, passing sisal estates and baobab-studded plains before the tarmac gives way to Tsavo''s famous red murram tracks. Tsavo East National Park covers over 13,747 km² — the largest in Kenya — and is known for its enormous elephant herds caked in the park''s distinctive rust-red dust. We check into our camp by midday, and after lunch the afternoon game drive begins. Keep cameras ready: lion, cheetah, leopard, buffalo, giraffe and hundreds of bird species are regularly spotted near the Galana River.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Elephant_Kruger_2.jpg/1280px-Elephant_Kruger_2.jpg',
 '[{"url":"https://live.staticflickr.com/7398/9557560895_ce37d1b89d_b.jpg","alt":"Red-dust elephants of Tsavo East"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Cheetah_Kruger.jpg/1280px-Cheetah_Kruger.jpg","alt":"Cheetah on the savanna"}]',
 ARRAY['Morning game drive','Lunch & dinner at camp','Accommodation at Tsavo camp','Park entry fees'],
 ARRAY['Alcoholic beverages','Personal tips'],
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Elephant_Kruger_2.jpg/1280px-Elephant_Kruger_2.jpg","alt":"Tsavo elephants","caption":"Tsavo elephants"},{"url":"https://live.staticflickr.com/7398/9557560895_ce37d1b89d_b.jpg","alt":"Red dust herd","caption":"Red dust herd"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Cheetah_Kruger.jpg/1280px-Cheetah_Kruger.jpg","alt":"Cheetah","caption":"Cheetah on the plains"}]'
),

-- DAY 3
(3, 'Tsavo East', 'Full Safari Day — Dawn to Dusk',
 'An unbroken day deep inside Kenya''s most iconic wilderness.',
 'First Light on the Galana',
 'Rise before the sun. The bush is at its most alive in the golden hour just after dawn — lions finish their night hunts, elephants drink at the river''s edge and oxpecker birds bustle over sleeping buffalo. We spend the entire day in the park: a long morning drive along the Galana River, a bush picnic lunch in the shade of an acacia, and a late afternoon drive through the savanna as the sky turns amber. Back at camp, stories and a star-lit dinner around the fire.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Lion_waiting_in_Namibia.jpg/1280px-Lion_waiting_in_Namibia.jpg',
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi.jpg/800px-Giraffe_Mikumi.jpg","alt":"Giraffe at sunrise"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/56/White_shark.jpg/1280px-White_shark.jpg","alt":"Buffalo herd by the river"}]',
 ARRAY['Full-day game drive','Bush picnic lunch','Sundowner drinks','All park entry fees'],
 ARRAY['Personal shopping','Tips'],
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/fb/Lion_waiting_in_Namibia.jpg/1280px-Lion_waiting_in_Namibia.jpg","alt":"Lion at rest","caption":"Lion at rest"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Giraffe_Mikumi.jpg/800px-Giraffe_Mikumi.jpg","alt":"Giraffe at sunrise","caption":"Giraffe at sunrise"}]'
),

-- DAY 4
(4, 'Tsavo East', 'Lugard Falls & Cultural Village',
 'Dramatic lava-carved rapids and a Kamba community lunch.',
 'Water, Rock & Community',
 'After a morning drive we visit Lugard Falls, where the Galana River thunders through narrow lava gorges carved over millennia — a geological marvel and one of Tsavo''s most dramatic sights. Watch hippos laze in the calm pools just below. In the afternoon we visit a local Kamba community homestead for a cultural exchange: storytelling, traditional music, and a shared meal prepared by community women using seasonal ingredients. This interaction is genuine and reciprocal — a portion of your tour fee goes directly to the community fund.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lugard_Falls_Tsavo_National_Park.jpg/1280px-Lugard_Falls_Tsavo_National_Park.jpg',
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lugard_Falls_Tsavo_National_Park.jpg/1280px-Lugard_Falls_Tsavo_National_Park.jpg","alt":"Lugard Falls"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Hippopotamus_in_Mikumi_National_Park.jpg/1280px-Hippopotamus_in_Mikumi_National_Park.jpg","alt":"Hippos below the falls"}]',
 ARRAY['Lugard Falls visit','Community lunch','Cultural exchange session','Game drive'],
 ARRAY['Souvenirs','Personal purchases'],
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Lugard_Falls_Tsavo_National_Park.jpg/1280px-Lugard_Falls_Tsavo_National_Park.jpg","alt":"Lugard Falls","caption":"Lugard Falls"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Hippopotamus_in_Mikumi_National_Park.jpg/1280px-Hippopotamus_in_Mikumi_National_Park.jpg","alt":"Hippos","caption":"Hippos below the gorge"}]'
),

-- DAY 5
(5, 'Marafa / Tsavo', 'Hell''s Kitchen & The Road to the Coast',
 'A surreal canyon of red and white sandstone, then the drive back toward the sea.',
 'Marafa Depression — Kenya''s Hidden Canyon',
 'Marafa Depression — locally called "Nyari" (the place broken by itself) — is a Cathedral of red, pink and white sandstone columns eroded over thousands of years into jagged spires and ravines. We arrive mid-morning when the light turns the rock faces copper and crimson, hike the ridge viewpoints and descend into the gorge floor. After lunch we begin the long drive toward the coast, passing cashew and coconut smallholdings and arriving at our Watamu guesthouse by early evening — just in time for a beach walk at sunset.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Marafa_Depression_1.jpg/1280px-Marafa_Depression_1.jpg',
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Marafa_Depression_1.jpg/1280px-Marafa_Depression_1.jpg","alt":"Marafa sandstone canyon"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Watamu_Beach.jpg/1280px-Watamu_Beach.jpg","alt":"Watamu beach at sunset"}]',
 ARRAY['Marafa canyon walk','Lunch','Drive to Watamu','Guesthouse accommodation'],
 ARRAY['Entrance fee at Marafa (small community fee)'],
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/51/Marafa_Depression_1.jpg/1280px-Marafa_Depression_1.jpg","alt":"Marafa canyon","caption":"Marafa canyon"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Watamu_Beach.jpg/1280px-Watamu_Beach.jpg","alt":"Watamu Beach","caption":"Watamu Beach"}]'
),

-- DAY 6
(6, 'Watamu', 'Watamu Marine National Park — Snorkelling the Reef',
 'Glass-clear water, coral gardens and sea turtles off Kenya''s most beautiful stretch of coast.',
 'Into the Indian Ocean',
 'Watamu Marine National Park is one of only six marine parks in Kenya and home to over 600 species of fish, rays, moray eels, hawksbill and green sea turtles, and pristine coral gardens. We spend the morning on a traditional dhow, dropping anchor over the reef to snorkel at two sites before anchoring at Sardegna Due islet for a fresh seafood lunch grilled on the beach. The afternoon is free for swimming, kayaking or simply doing nothing on a perfect white-sand beach. Equipment is provided; no experience needed.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/WatamuBeach_Kenya.jpg/1280px-WatamuBeach_Kenya.jpg',
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/WatamuBeach_Kenya.jpg/1280px-WatamuBeach_Kenya.jpg","alt":"Watamu Marine Park coral"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Hawksbill_sea_turtle_1.jpg/1280px-Hawksbill_sea_turtle_1.jpg","alt":"Hawksbill sea turtle"}]',
 ARRAY['Dhow boat trip','Snorkelling equipment','Marine park entry','Seafood beach lunch'],
 ARRAY['Alcohol','Optional water sports rental'],
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/WatamuBeach_Kenya.jpg/1280px-WatamuBeach_Kenya.jpg","alt":"Watamu coast","caption":"Watamu coast"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Hawksbill_sea_turtle_1.jpg/1280px-Hawksbill_sea_turtle_1.jpg","alt":"Sea turtle","caption":"Hawksbill sea turtle"}]'
),

-- DAY 7
(7, 'Watamu / Gede', 'Gede Ruins & Coastal Culture',
 'Swahili civilization in the forest and a free afternoon on the beach.',
 'The Lost City of Gede',
 'Gede Ruins is an ancient Swahili town abandoned in the 17th century for reasons still debated by historians — perhaps drought, plague, or the shifting fortunes of Indian Ocean trade. The site sits inside a living forest where colobus monkeys swing overhead and massive strangler figs have swallowed the coral-rag walls. A local guide leads us through the palace, the great mosque, and the merchant houses, bringing the town back to life through storytelling. After lunch back in Watamu, the afternoon is free — the perfect moment for a local market visit, massage on the beach, or one last swim.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Gede_Ruins_Kenya.jpg/1280px-Gede_Ruins_Kenya.jpg',
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Gede_Ruins_Kenya.jpg/1280px-Gede_Ruins_Kenya.jpg","alt":"Gede Ruins mosque"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Mantled_Colobus.jpg/1280px-Mantled_Colobus.jpg","alt":"Colobus monkey in Gede forest"}]',
 ARRAY['Guided Gede Ruins tour','Entry fees','Lunch','Free beach afternoon'],
 ARRAY['Souvenirs','Optional spa/massage'],
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Gede_Ruins_Kenya.jpg/1280px-Gede_Ruins_Kenya.jpg","alt":"Gede Ruins","caption":"Gede Ruins"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/Mantled_Colobus.jpg/1280px-Mantled_Colobus.jpg","alt":"Colobus monkey","caption":"Colobus monkey"}]'
),

-- DAY 8
(8, 'Watamu', 'Free Day & Farewell Dinner',
 'A day entirely your own — and a final evening to celebrate.',
 'Your Day, Your Way',
 'Today belongs to you. Sleep in, take a sunrise yoga session, rent a bicycle and explore the village, book a deep-sea fishing trip, or just sit under a palm tree with a good book. We reconvene in the evening for the farewell dinner — a full Swahili spread of coconut rice, biryani, grilled lobster and tropical fruit — where we share memories, exchange contacts and raise a glass to the journey. Emmanuel and Peter will be on hand to answer any questions about returning, extending your trip or what comes next.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Watamu_Beach.jpg/1280px-Watamu_Beach.jpg',
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/WatamuBeach_Kenya.jpg/1280px-WatamuBeach_Kenya.jpg","alt":"Watamu sunrise"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Coconut_tree.jpg/800px-Coconut_tree.jpg","alt":"Coconut palms on the beach"}]',
 ARRAY['Free day — all activities optional','Farewell dinner','Swahili feast'],
 ARRAY['Optional excursions (deep-sea fishing, kite surfing, massage)'],
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Watamu_Beach.jpg/1280px-Watamu_Beach.jpg","alt":"Free day beach","caption":"Free day on the beach"},{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/WatamuBeach_Kenya.jpg/1280px-WatamuBeach_Kenya.jpg","alt":"Watamu sunrise","caption":"Watamu sunrise"}]'
),

-- DAY 9
(9, 'Mombasa', 'Homeward Bound',
 'The last morning — a gentle drive back to Mombasa for your onward flight.',
 'Until Next Time',
 'After breakfast we pack up and make the leisurely three-hour drive back to Mombasa. We drop you at Moi International Airport or whichever point you need. If your flight is late, we can arrange a half-day city tour or a stop at the Haller Park wildlife sanctuary at an extra cost. All we ask is that you carry this journey forward — tell your friends, leave an honest review, and come back for the next adventure.',
 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mbaraki_road.JPG/1280px-Mbaraki_road.JPG',
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mbaraki_road.JPG/1280px-Mbaraki_road.JPG","alt":"Morning drive to Mombasa"}]',
 ARRAY['Breakfast','Transfer to Mombasa airport','Luggage assistance'],
 ARRAY['Flights home','Optional city extension'],
 '[{"url":"https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Mbaraki_road.JPG/1280px-Mbaraki_road.JPG","alt":"Final morning drive","caption":"Final morning drive"}]'
);

-- ── Home Content: Tour Package + Inclusions ──────────────────
UPDATE home_content SET
  price_low  = 2400,
  price_high = 2700,
  pricing_note = 'High season (July, August, November & December) up to €2,700 per person. All other months from €2,400. Prices include all accommodation, park fees, meals listed and ground transport — see full inclusions below.',
  departure_note = 'Trips confirm at a minimum of 6 travellers, maximum 15. Reserve for €0 to hold your place · €200 deposit once the trip is confirmed · interest-free instalments available until 31 days before departure. Cancellations more than 60 days before departure receive a full refund.',
  inclusions_json = '[
    "9 days / 8 nights accommodation (hotel + tented camp + guesthouse)",
    "All meals listed in the day-by-day programme",
    "Tsavo East National Park entry fees for all safari days",
    "Watamu Marine National Park entry fee",
    "Dhow boat hire & snorkelling equipment",
    "Shared 4×4 safari vehicle with experienced local driver-guide",
    "Lugard Falls & Marafa (Hell''s Kitchen) excursion",
    "Gede Ruins guided tour & entry fee",
    "Farewell Swahili dinner on the last evening",
    "Welcome dinner on arrival night",
    "Bush picnic lunch on full safari day",
    "Community cultural visit & lunch (Day 4)",
    "All ground transport within Kenya for the group",
    "24/7 support from Emmanuel & Peter throughout the trip"
  ]',
  not_included_text = 'Flights to and from Mombasa · Kenya e-visa (approx. USD 50 — apply online at evisa.go.ke) · Travel insurance (required) · Alcoholic beverages · Personal tips for porters and community hosts · Optional activities: deep-sea fishing, kite surfing, spa, Haller Park visit · Any meals not listed in the programme · Personal expenses and souvenirs',
  faq_text = 'Is this trip suitable for first-time safari-goers? Yes — the pacing is relaxed and both guides are patient, experienced and passionate about sharing Kenya.

What level of fitness is needed? Moderate. Some walking on uneven ground at Marafa, Gede and Lugard Falls. No strenuous hiking.

Is the accommodation comfortable? Yes. Nights 1 & 9 are in a city hotel; nights 2–5 in a comfortable tented camp with ensuite facilities; nights 6–8 in a coastal guesthouse.

Can I join as a solo traveller? Absolutely. Most of our guests book solo and meet their travel companions on arrival.

Is there a single-room supplement? A single supplement of €300 applies if you prefer a private room throughout.

What currency should I bring? Euros, USD or GBP are all accepted. Local shillings are useful for tips and market shopping.',
  sidebar_intro = 'High season (Jul, Aug, Nov, Dec) up to €2,700. All other months from €2,400.',
  sidebar_reserve_note = 'Reserve for €0 · €200 deposit on confirmation · instalments until 31 days before departure',
  sidebar_bullets_json = '["Small group: 6–15 travellers","9 days · 8 nights","All park fees included","Local guides Emmanuel & Peter","Flights not included"]'
WHERE id = (SELECT id FROM home_content LIMIT 1);

-- ── Social media defaults in site_settings ───────────────────
INSERT INTO site_settings (key, value) VALUES
  ('instagram_url',  'https://www.instagram.com/savannaandmareadventures'),
  ('facebook_url',   'https://www.facebook.com/savannaandmareadventures'),
  ('footer_description', 'Small-group safaris and coastal journeys rooted in local knowledge and genuine care. Founded by Emmanuel Mweu & Peter Chacha.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

