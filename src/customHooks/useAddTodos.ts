"use client";

import { useMutation } from "@tanstack/react-query";

import type { Todo } from "@/utils/interfaces/Todo";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { userController } from "@/state/controller/user";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

export const useAddTodo = () => {
  const { user } = userController.useState(['user']);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (newTodo: Partial<Todo>) => {
      if (!user) return;
      if (!newTodo) return;

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.POST,
          headers: HEADERS,
          body: JSON.stringify({ ...newTodo, userId: user?.id }),
        }
      );

      return await res.json();
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
