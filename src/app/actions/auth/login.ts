import { User } from "@/utils/interfaces/User";
import {API_METHODS} from "@/utils/enum/ApiMethods";
import { getCookies } from "@/utils/actions/GetCookies";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";


export const login = async (loginData: User) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_API_URL}/users/login`,
      {
        method: API_METHODS.POST,
        headers: {
          "Content-Type": "application/json",
          Cookie: await getCookies(),
        },
        credentials: "include",
        body: JSON.stringify({
          email: loginData.email,
          password: loginData.password,
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || NOTIFY_MESSAGES.LOGIN_FAILED,
      };
    }

    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch  {
    return {
      success: false,
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};
