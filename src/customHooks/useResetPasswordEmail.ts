import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { User } from "@/utils/interfaces/User";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

export const useResetPasswordEmail = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (data: User) => {
      if (!data.email) return;

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL +
          API_END_POINTS.USERS_RESET_PASSWORD_EMAIL,
        {
          method: API_METHODS.POST,
          headers: HEADERS,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error(NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_NOT_SENT);
      }
      const result = await res.json();
      if(!result.success) {
        throw new Error(NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_NOT_SENT);
      }

      return result;
    },

    onSuccess: () => {
      toast.success(NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_SENT);
    },

    onError: () => {
      toast.error(NOTIFY_MESSAGES.PASSWORD_RESET_EMAIL_NOT_SENT);
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
