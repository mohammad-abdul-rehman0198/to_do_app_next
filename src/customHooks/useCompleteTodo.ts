import { useAtomValue } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userAtom } from "@/state/atoms/user";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { QUERY_KEYS } from "@/utils/constants/QueryKeys";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();

  const userData = useAtomValue(userAtom);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (todoId: string) => {
      if (!userData?.id) return;
      if (!todoId) return;

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.PATCH,
          headers: HEADERS,
          body: JSON.stringify({ id: todoId, userId: userData?.id }),
        }
      );

      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TODOS, userData?.id],
      });
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
