import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getServerSession } from "@/utils/actions/GetServerSession";

export async function proxy(req: NextRequest) {
  const { pathname, searchParams } = req.nextUrl;

  const { supabase, session } = await getServerSession();

  if ((pathname === "/" || pathname === "/profile") && !session) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (pathname === "/auth/resetPassword") {
    const code = searchParams.get("code") || "";
    
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/resetPassword", "/profile"],
};
