-- Fix: remove the UPDATE auth.users from the trigger (causes GoTrue 500 error)
-- The trigger only needs to insert into admin_users

CREATE OR REPLACE FUNCTION public.handle_admin_user_created()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.raw_user_meta_data->>'is_admin' = 'true' THEN
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

