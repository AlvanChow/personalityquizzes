/*
  # Drop legacy list_crew()

  Applied after the Circles client deploy: every live bundle now calls
  list_circle(), so the pre-rename RPC can go.
*/

DROP FUNCTION IF EXISTS public.list_crew();
