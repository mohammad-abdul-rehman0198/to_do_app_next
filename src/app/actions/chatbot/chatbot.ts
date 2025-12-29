import { API_METHODS } from "@/utils/enum/ApiMethods";
import { getCookies } from "@/utils/actions/GetCookies";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const getChatbotResponse = async (message: string) => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_API_URL}/chatbot`,
      {
        method: API_METHODS.POST,
        headers: {
          "Content-Type": "application/json",
          Cookie: await getCookies(),
        },
        credentials: "include",
        body: JSON.stringify({ message }),
      }
    );

    const data = await res.json();

    if (!res.ok || !data.success) {
      return {
        success: false,
        message: data.message || NOTIFY_MESSAGES.CHATBOT_RESPONSE_FAILED,
      };
    }

    return {
      success: true,
      data: data.answer,
    };
  } catch {
    return {
      success: false,
      message: NOTIFY_MESSAGES.NETWORK_ERROR,
    };
  }
};
