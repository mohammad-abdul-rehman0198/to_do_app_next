import { API_METHODS } from "@/utils/enum/ApiMethods";
import { getCookies } from "@/utils/actions/GetCookies";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

interface ChatbotResponse {
  success: boolean;
  data?: string;
  message?: string;
}

export const getChatbotResponse = async (
  userId: string,
  message: string,
  match_count = 5
): Promise<ChatbotResponse> => {
  try {
    const res = await fetch(
      `https://dzglfsbrferahkkdswua.supabase.co/functions/v1/get-chatbot`,
      {
        method: API_METHODS.POST,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          Cookie: await getCookies(),
        },
        credentials: "include",
        body: JSON.stringify({ record: { userId, message, match_count } }),
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
