import { User } from "@/utils/interfaces/User";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const signup = async (signupData: User) => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL_API_URL}/users/signup`, {
      method: API_METHODS.POST,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        confirmPassword: signupData.confirmPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.message || NOTIFY_MESSAGES.SIGNUP_FAILED,
      };
    }

    return {
      success: true,
      user: data.user,
      message: data.message,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};
