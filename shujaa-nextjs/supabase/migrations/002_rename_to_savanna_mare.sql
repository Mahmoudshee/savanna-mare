-- Rename brand: Shujaa Tours And Adventures → Savanna & Mare Adventures

-- Update WhatsApp message in site_settings
UPDATE site_settings
SET value = 'Hello Savanna & Mare Adventures, I''d like to ask about the Kenya trip.'
WHERE key = 'whatsapp_message';

-- Update hosts bio in home_content
UPDATE home_content
SET hosts_bio = 'Savanna & Mare Adventures was founded and is owned by directors Emmanuel Mweu and Peter Chacha. Their team brings local insight and personal care to every journey.';
