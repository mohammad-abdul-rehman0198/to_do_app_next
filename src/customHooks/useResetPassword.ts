import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";

import { User } from "@/utils/interfaces/User";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

export const useResetPassword = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (data: User) => {
      if (!data.password || !data.confirmPassword) return;

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.USERS_RESET_PASSWORD,
        {
          method: API_METHODS.POST,
          headers: HEADERS,
          body: JSON.stringify(data),
        }
      );

      if (!res.ok) {
        throw new Error(NOTIFY_MESSAGES.PASSWORD_RESET_FAILED);
      }

      const result = await res.json();

      if (!result.success) {
        throw new Error(NOTIFY_MESSAGES.PASSWORD_RESET_FAILED);
      }

      return result;
    },

    onSuccess: () => {
      toast.success(NOTIFY_MESSAGES.PASSWORD_RESET_SUCCESS);
    },

    onError: () => {
      toast.error(NOTIFY_MESSAGES.PASSWORD_RESET_FAILED);
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
