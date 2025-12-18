"use server";

import { User } from "@/utils/interfaces/User";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const login = async (loginData: User) => {
  const { supabase } = await getServerSession();

  if (!loginData.email || !loginData.password) {
    return {
      success: false,
      message: NOTIFY_MESSAGES.ALL_FIELDS_REQUIRED,
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: loginData.email,
    password: loginData.password,
  });

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    user: data.user,
    message: NOTIFY_MESSAGES.LOGIN_SUCCESS,
  };
}
