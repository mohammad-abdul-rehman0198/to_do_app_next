import { API_METHODS } from "@/utils/enum/ApiMethods";
import { getCookies } from "@/utils/actions/GetCookies";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const getUser = async () => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_API_URL}/users/get-user`,
      {
        method: API_METHODS.GET,
        headers: {
          "Content-Type": "application/json",
          Cookie: await getCookies(),
        },
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success || !data.user) {
      return {
        success: false,
        message: NOTIFY_MESSAGES.UNAUTHORIZED,
      };
    }

    return {
      success: true,
      user: data.user,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};
