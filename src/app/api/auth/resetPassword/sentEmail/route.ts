import validator from "validator";
import { NextResponse } from "next/server";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const POST = async (req: Request) => {
  try {
    const { email } = await req.json();

    const { supabase } = await getServerSession();

    if (!email || !validator.isEmail(email)) {
      return NextResponse.json({
        success: false,
        message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
      });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.DOMAIN_URL}/auth/resetPassword`,
    });

    if (error) {
      return NextResponse.json({
        success: false,
        message: error.message || NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_NOT_SENT,
      });
    }

    return NextResponse.json({
      success: true,
      message: NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_SENT,
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: NOTIFY_MESSAGES.SERVER_ERROR,
    });
  }
};
