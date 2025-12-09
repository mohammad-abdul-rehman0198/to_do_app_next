import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/db/supabase/server";

export const GET = async () => {
  try {
    const supabase = await createSupabaseServer();

    const {
      data: { user: userData },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      );
    }

    if (!userData) {
      return NextResponse.json(
        { success: false, message: "No active session" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, userData });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to get session" },
      { status: 500 }
    );
  }
};
