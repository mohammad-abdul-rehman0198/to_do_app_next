import { API_METHODS } from "@/utils/enum/ApiMethods";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const sentEmail = async (email: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_API_URL}/users/send-reset-password-email`,
      {
        method: API_METHODS.POST,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_NOT_SENT,
      };
    }

    return {
      success: true,
      message: data.message,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};
