import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db";
import { users } from "@/db/schemas/user";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const PUT = async (req: Request) => {
  try {
    const { name, imageUrl } = await req.json();

    const { supabase, session } = await getServerSession();

    if (!session) {
      return NextResponse.json(
        { success: false, message: NOTIFY_MESSAGES.UNAUTHORIZED },
        { status: 401 }
      );
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        name,
        imageUrl,
      },
    });

    if (error) {
      return NextResponse.json(
        {
          success: false,
          message: error.message || NOTIFY_MESSAGES.PROFILE_UPDATE_FAILED,
        },
        { status: 400 }
      );
    }

    await db
      .update(users)
      .set({
        name,
        imageUrl,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      })
      .where(eq(users.id, session.user.id));

    return NextResponse.json({
      success: true,
      user: {
        name,
        imageUrl,
      },
      message: NOTIFY_MESSAGES.PROFILE_UPDATED_SUCCESS,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: NOTIFY_MESSAGES.SERVER_ERROR },
      { status: 500 }
    );
  }
};
