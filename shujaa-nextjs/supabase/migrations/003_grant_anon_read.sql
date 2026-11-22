-- Grant SELECT to anon role for public-facing tables (RLS policies alone are not enough)
GRANT SELECT ON public.site_settings TO anon;
GRANT SELECT ON public.home_content TO anon;
GRANT SELECT ON public.itinerary_days TO anon;
GRANT SELECT ON public.departures TO anon;

-- Grant full access to service_role for all tables
GRANT ALL ON public.site_settings TO service_role;
GRANT ALL ON public.home_content TO service_role;
GRANT ALL ON public.itinerary_days TO service_role;
GRANT ALL ON public.departures TO service_role;
GRANT ALL ON public.bookings TO service_role;
GRANT ALL ON public.admin_users TO service_role;
GRANT ALL ON public.shujaa_users TO service_role;
GRANT ALL ON public.sessions TO service_role;
GRANT ALL ON public.verification_challenges TO service_role;
GRANT ALL ON public.login_attempts TO service_role;

