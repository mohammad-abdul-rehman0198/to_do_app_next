import { NextResponse } from "next/server";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";


export const GET = async () => {
  try {
    const { supabase } = await getServerSession();

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
        { success: false, message: NOTIFY_MESSAGES.NO_ACTIVE_SESSION },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, userData });
  } catch {
    return NextResponse.json(
      { success: false, message: NOTIFY_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
};
