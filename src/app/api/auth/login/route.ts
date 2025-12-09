import { NextResponse } from "next/server";
import { createSupabaseServer } from "@/db/supabase/server";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "All fields are required.",
      });
    }

    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ success: false, message: error.message });
    }


    return NextResponse.json({
      success: true,
      user: data.user,
      message: "Logged in successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) });
  }
};
