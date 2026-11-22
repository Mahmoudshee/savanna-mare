-- Completely open admin_users to service_role via permissive policies
-- Drop existing restrictive policies first
DROP POLICY IF EXISTS "Service role all admin_users" ON admin_users;

-- Re-enable RLS (required for policies to take effect in PostgREST)
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access via JWT claim check
CREATE POLICY "service_role_all" ON admin_users
  AS PERMISSIVE
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Allow authenticated users to read their own record
CREATE POLICY "authenticated_read_own" ON admin_users
  AS PERMISSIVE
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Ensure the admin user row exists
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

