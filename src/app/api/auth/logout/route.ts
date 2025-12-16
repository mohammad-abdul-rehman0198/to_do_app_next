import { NextResponse } from "next/server";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const POST = async () => {
  try {
    const { supabase } = await getServerSession();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return NextResponse.json({
        success: false,
        message: error.message,
      });
    }

    return NextResponse.json({
      success: true,
      message: NOTIFY_MESSAGES.LOGOUT_SUCCESS,
    });
  } catch {
    return NextResponse.json({
      success: false,
      message: NOTIFY_MESSAGES.LOGOUT_FAILED,
    });
  }
};
