-- Insert admin user into admin_users (links to Supabase Auth user created via API)
INSERT INTO admin_users (id, email, display_name, role)
VALUES (
  'e1497406-6f7f-4fb6-b1df-31acb46c5c94',
  'admin@savannamare.com',
  'Site Admin',
  'super_admin'
) ON CONFLICT (id) DO NOTHING;

