import { NextResponse } from "next/server";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const POST = async (req: Request) => {
  try {
    const { password, confirmPassword } = await req.json();

    if (!password || !confirmPassword || password.length < 6 || password !== confirmPassword) {
      return NextResponse.json({
        success: false,
        message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
      });
    }

    const { supabase } = await getServerSession();
   
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      return NextResponse.json({
        success: false,
        message: error.message || NOTIFY_MESSAGES.PASSWORD_RESET_FAILED,
      });
    }

    return NextResponse.json({
      success: true,
      message: NOTIFY_MESSAGES.PASSWORD_RESET_SUCCESS,
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
