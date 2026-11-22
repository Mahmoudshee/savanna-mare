-- Fix admin_users: disable RLS (service role handles security via app layer)
-- and ensure the admin row exists
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;

-- Drop the broken service_role RLS policy (no longer needed)
DROP POLICY IF EXISTS "Service role all admin_users" ON admin_users;

-- Grant full access to service_role and authenticated for admin_users
GRANT ALL ON public.admin_users TO service_role;
GRANT SELECT ON public.admin_users TO authenticated;

-- Insert admin user (or update if already there)
INSERT INTO admin_users (id, email, display_name, role)
VALUES (
  'e1497406-6f7f-4fb6-b1df-31acb46c5c94',
  'admin@savannamare.com',
  'Site Admin',
  'super_admin'
) ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email,
      display_name = EXCLUDED.display_name,
      role = EXCLUDED.role;

