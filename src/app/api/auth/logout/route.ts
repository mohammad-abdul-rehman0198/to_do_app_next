import { NextResponse } from "next/server";

import { createSupabaseServer } from "@/db/supabase/server";

const logoutUser = async () => {
  try {
    const supabase = await createSupabaseServer();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({
        success: false,
        message: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: "Failed to logout",
    });
  }
}

export const POST = logoutUser;
