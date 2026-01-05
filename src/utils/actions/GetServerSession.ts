import { createSupabaseServer } from "@/db/supabase/server";

export async function getServerSession() {
  const supabase = await createSupabaseServer();
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return { supabase, session, error };
}
