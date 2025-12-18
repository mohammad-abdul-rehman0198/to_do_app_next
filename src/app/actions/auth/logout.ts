"use server";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { getServerSession } from "@/utils/actions/GetServerSession";

export const logout = async () => {
  try {
    const { supabase } = await getServerSession();

    const { error } = await supabase.auth.signOut();

    if (error) {
      return { success: false, message: error.message };
    }

    return { success: true, message: NOTIFY_MESSAGES.LOGOUT_SUCCESS };
  } catch {
    
    return { success: false, message: NOTIFY_MESSAGES.LOGOUT_FAILED };
  }
}
