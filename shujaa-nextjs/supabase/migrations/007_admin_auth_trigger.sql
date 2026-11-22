-- Trigger to auto-insert into admin_users when a user signs up with is_admin metadata
-- and auto-confirm their email

-- Function: auto-confirm email for admin signup (SECURITY DEFINER runs as postgres)
CREATE OR REPLACE FUNCTION public.handle_admin_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Only process if user has is_admin metadata flag
  IF NEW.raw_user_meta_data->>'is_admin' = 'true' THEN
    -- Auto-confirm the email immediately
    UPDATE auth.users
    SET email_confirmed_at = COALESCE(email_confirmed_at, now()),
        confirmed_at        = COALESCE(confirmed_at, now())
    WHERE id = NEW.id;

    -- Insert into admin_users table
    INSERT INTO public.admin_users (id, email, display_name, role)
    VALUES (
      NEW.id,
      NEW.email,
      COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
      'super_admin'
    )
    ON CONFLICT (id) DO UPDATE
      SET email        = EXCLUDED.email,
          display_name = EXCLUDED.display_name,
          role         = EXCLUDED.role;
  END IF;
  RETURN NEW;
END;
$$;

-- Drop trigger if already exists, then recreate
DROP TRIGGER IF EXISTS on_admin_user_created ON auth.users;

CREATE TRIGGER on_admin_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_admin_user_created();

-- Also allow authenticated users to read their own admin_users row
DROP POLICY IF EXISTS "authenticated_read_own" ON admin_users;
CREATE POLICY "authenticated_read_own" ON admin_users
  AS PERMISSIVE FOR SELECT TO authenticated
  USING (auth.uid() = id);

-- Allow authenticated users to insert their own row (fallback if trigger doesn't fire)
DROP POLICY IF EXISTS "authenticated_insert_own" ON admin_users;
CREATE POLICY "authenticated_insert_own" ON admin_users
  AS PERMISSIVE FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = id);

