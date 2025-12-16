import { useMutation } from "@tanstack/react-query";

import { API_METHODS } from "@/utils/enum/ApiMethods";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

export const useLogout = () => {
  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.USERS_LOGOUT}`,
        {
          method: API_METHODS.POST,
          headers: HEADERS,
        }
      );
      
      return await res.json();
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
