import { useMutation, useQueryClient } from "@tanstack/react-query";

import { API_METHODS } from "@/utils/enum/ApiMethods";
import { QUERY_KEYS } from "@/utils/constants/QueryKeys";
import { userController } from "@/state/controller/user";
import type { FormData } from "@/utils/interfaces/FormData";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";
interface EditTodo {
  data: FormData;
  editTodoId: string;
}

export const useEditTodo = () => {
  const queryClient = useQueryClient();

  const { user } = userController.useState(["user"]);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async ({ data, editTodoId }: EditTodo) => {
      if (!user) return;
      if (!editTodoId) return;

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.PUT,
          headers: HEADERS,
          body: JSON.stringify({
            id: editTodoId,
            userId: user?.id,
            taskName: data.taskName,
            description: data.description || "",
          }),
        }
      );

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TODOS, user?.id],
      });
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
