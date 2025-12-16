import { NextResponse } from "next/server";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const POST = async (req: Request) => {
  try {
    const { email, password } = await req.json();

    const { supabase } = await getServerSession();

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
      });
    }

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
      message: NOTIFY_MESSAGES.LOGIN_SUCCESS,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: String(error) });
  }
};
