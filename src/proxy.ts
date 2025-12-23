import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getServerSession } from "@/utils/actions/GetServerSession";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const sb_access_token = req.cookies.get("sb-access-token")?.value;
  const sb_refresh_token = req.cookies.get("sb-refresh-token")?.value;

  const { supabase } = await getServerSession();

  const {
    data: { user },
  } = await supabase.auth.getUser(sb_access_token);

  if (
    (pathname === "/" || pathname === "/profile") &&
    !user &&
    !sb_access_token &&
    !sb_refresh_token
  ) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/resetPassword", "/profile"],
};
