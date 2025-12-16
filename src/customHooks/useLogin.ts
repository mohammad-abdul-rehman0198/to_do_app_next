import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { User } from "@/utils/interfaces/User";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

export const useLogin = () => {
  const router = useRouter();

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (data: User) => {
      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.USERS_LOGIN,
        {
          method: API_METHODS.POST,
          headers: HEADERS,
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        toast.error(NOTIFY_MESSAGES.LOGIN_FAILED);
        return;
      }

      const responseData = await response.json();
      if (responseData.success) {
        toast.success(responseData.message);
        router.push("/");
      } else {
        toast.error(responseData.message);
        return null;
      }
    },
    onError: () => {
      toast.error(NOTIFY_MESSAGES.LOGIN_FAILED);
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
