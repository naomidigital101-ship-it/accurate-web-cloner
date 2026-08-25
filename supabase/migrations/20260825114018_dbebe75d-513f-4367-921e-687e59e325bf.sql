-- 1) media table: respect is_public
DROP POLICY IF EXISTS media_public_read ON public.media;
CREATE POLICY media_public_read ON public.media
  FOR SELECT TO anon, authenticated
  USING (is_public = true);

-- 2) storage objects in 'media' bucket: only when the matching media row is public
DROP POLICY IF EXISTS media_public_read ON storage.objects;
CREATE POLICY media_public_read ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (
    bucket_id = 'media'
    AND (
      public.is_staff()
      OR EXISTS (
        SELECT 1 FROM public.media m
        WHERE m.is_public = true
          AND m.url LIKE '%/' || storage.objects.name
      )
    )
  );

-- 3) lock down SECURITY DEFINER / trigger functions
REVOKE ALL ON FUNCTION public.lead_stats(integer) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.lead_stats(integer) TO service_role;

REVOKE ALL ON FUNCTION public.grant_role_from_allowlist() FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.touch_updated_at() FROM PUBLIC, anon, authenticated;

REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

REVOKE ALL ON FUNCTION public.is_staff() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_staff() TO authenticated, service_role;

-- 4) fixed search_path
CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
begin new.updated_at = now(); return new; end $function$;