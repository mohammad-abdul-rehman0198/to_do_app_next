"use server";

import validator from "validator";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";



export const sentEmail = async (email: string) => {
  try {
    const { supabase } = await getServerSession();

    if (!email || !validator.isEmail(email)) {
      return { success: false, message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED };
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.DOMAIN_URL}/auth/resetPassword`,
    });

    if (error) {
      return {
        success: false,
        message: error.message || NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_NOT_SENT,
      };
    }

    return { success: true, message: NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_SENT };
  } catch {
    return { success: false, message: NOTIFY_MESSAGES.SERVER_ERROR };
  }
}
