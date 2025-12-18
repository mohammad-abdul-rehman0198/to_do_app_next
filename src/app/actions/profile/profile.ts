"use server";

import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schemas/user";
import { User } from "@/utils/interfaces/User";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const updateProfile = async (updateProfileData: User) => {
  try {
    const { supabase, session } = await getServerSession();

    if (!session) {
      return { success: false, message: NOTIFY_MESSAGES.UNAUTHORIZED };
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        name: updateProfileData.name,
        imageUrl: updateProfileData.imageUrl,
      },
    });

    if (error) {
      return {
        success: false,
        message: error.message || NOTIFY_MESSAGES.PROFILE_UPDATE_FAILED,
      };
    }

    await db
      .update(users)
      .set({
        name: updateProfileData.name,
        imageUrl: updateProfileData.imageUrl,
        updatedAt: new Date(),
        updatedBy: session.user.id,
      })
      .where(eq(users.id, session.user.id));

    return {
      success: true,
      user: {
        name: updateProfileData.name,
        imageUrl: updateProfileData.imageUrl,
      },
      message: NOTIFY_MESSAGES.PROFILE_UPDATED_SUCCESS,
    };
  } catch {
    return { success: false, message: NOTIFY_MESSAGES.SERVER_ERROR };
  }
};
