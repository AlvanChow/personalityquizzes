/*
  # Admin-only authenticated account email export

  Google OAuth stores a verified email in auth.users. Expose a minimal account
  list to approved admins without copying auth data into a public-schema table
  or treating account creation as marketing consent.
*/

CREATE OR REPLACE FUNCTION public.admin_list_auth_users()
RETURNS TABLE (
  user_id uuid,
  email text,
  created_at timestamptz,
  last_sign_in_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
STABLE
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1 FROM public.admins a WHERE a.user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION 'Admin access required' USING ERRCODE = 'insufficient_privilege';
  END IF;

  RETURN QUERY
  SELECT u.id, u.email::text, u.created_at, u.last_sign_in_at
  FROM auth.users u
  WHERE u.email IS NOT NULL
  ORDER BY u.created_at DESC
  LIMIT 10000;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.admin_list_auth_users() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.admin_list_auth_users() TO authenticated;
