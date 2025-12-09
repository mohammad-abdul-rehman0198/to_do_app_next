import { NextResponse } from "next/server";

import { createSupabaseServer } from "@/db/supabase/server";

const signupUser = async (req: Request) => {
  try {
    const { email, password, name, confirmPassword } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({
        success: false,
        message: "All fields are required.",
      });
    }

    if (password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: "Passwords do not match.",
      });
    }

    const supabase = await createSupabaseServer();
    const { data, error } = await supabase.auth.admin.createUser({
      id: crypto.randomUUID(),
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });

    if (error)
      return NextResponse.json({ success: false, message: error.message });

    return NextResponse.json({
      success: true,
      user: data,
      message: "Signed up successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error });
  }
};

export const POST = signupUser;
