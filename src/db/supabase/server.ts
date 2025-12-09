import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";


export const createSupabaseServer =  async () => {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesArray) => {
          cookiesArray.forEach((c) => {
            cookieStore.set(c);
          });
        },
      },
    }
  );
};
