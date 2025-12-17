import { useMutation } from "@tanstack/react-query";

import { API_METHODS } from "@/utils/enum/ApiMethods";
import { userController } from "@/state/controller/user";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";


export const useDeleteTodo = () => {
  const { id: userId } = userController.useState(['id']);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (todoId: string) => {
      if (!userId) return;
      if (!todoId) return;

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.DELETE,
          headers: HEADERS,
          body: JSON.stringify({ id: todoId, userId: userId }),
        }
      );

      return await res.json();
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
