import { User } from "@/utils/interfaces/User";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { getCookies } from "@/utils/actions/GetCookies";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const resetPassword = async (resetPasswordData: User) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_API_URL}/users/reset-password`,
      {
        method: API_METHODS.POST,
        headers: {
          "Content-Type": "application/json",
          Cookie: await getCookies(),
        },
        credentials: "include",
        body: JSON.stringify({
          password: resetPasswordData.password,
          confirmPassword: resetPasswordData.confirmPassword,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || NOTIFY_MESSAGES.PASSWORD_RESET_FAILED,
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
