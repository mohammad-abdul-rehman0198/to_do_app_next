"use client";

import { useAtomValue } from "jotai";
import { useMutation } from "@tanstack/react-query";

import { userAtom } from "@/state/atoms/user";
import type { Todo } from "@/utils/interfaces/Todo";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

export const useAddTodo = () => {
  const userData = useAtomValue(userAtom);

  const { mutate, isPending, isError, isSuccess } = useMutation({
    mutationFn: async (newTodo: Todo) => {
      if (!userData) return;
      if (!newTodo) return;

      const res = await fetch(
        process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS,
        {
          method: API_METHODS.POST,
          headers: HEADERS,
          body: JSON.stringify({ ...newTodo, userId: userData.id }),
        }
      );

      return await res.json();
    },
  });

  return { mutate, isPending, isError, isSuccess };
};
