import { useAtomValue } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userAtom } from "@/state/atoms/user";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { QUERY_KEYS } from "@/utils/constants/QueryKeys";
import type { FormData } from "@/utils/interfaces/FormData";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

interface EditTodo {
  data: FormData;
  editTodoId: string;
}

export const useEditTodo = () => {
  const queryClient = useQueryClient();

  const userData = useAtomValue(userAtom);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async ({ data, editTodoId }: EditTodo) => {
      if (!userData) return;
      if (!editTodoId) return;

      const response = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.PUT,
          headers: HEADERS,
          body: JSON.stringify({
            id: editTodoId,
            userId: userData.id,
            taskName: data.taskName,
            description: data.description || "",
          }),
        }
      );

      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEYS.TODOS, userData?.id],
      });
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
