"use server";

import { User } from "@/utils/interfaces/User";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const resetPassword = async (resetPasswordData: User) => {
  try {
    if (
      !resetPasswordData.password ||
      !resetPasswordData.confirmPassword ||
      resetPasswordData.password.length < 6 ||
      resetPasswordData.password !== resetPasswordData.confirmPassword
    ) {
      return { success: false, message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED };
    }

    const { supabase } = await getServerSession();

    const { error } = await supabase.auth.updateUser({
      password: resetPasswordData.password,
    });

    if (error) {
      return {
        success: false,
        message: error.message || NOTIFY_MESSAGES.PASSWORD_RESET_FAILED,
      };
    }

    return { success: true, message: NOTIFY_MESSAGES.PASSWORD_RESET_SUCCESS };
  } catch {
    return { success: false, message: NOTIFY_MESSAGES.SERVER_ERROR };
  }
};
