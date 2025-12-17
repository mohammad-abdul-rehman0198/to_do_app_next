"use client";

import { useQuery } from "@tanstack/react-query";

import { API_METHODS } from "@/utils/enum/ApiMethods";
import { userController } from "@/state/controller/user";
import { QUERY_KEYS } from "@/utils/constants/QueryKeys";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";


const useTodos = () => {
  const { id: userId } = userController.useState(["id"]);
  
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.TODOS, userId],
    queryFn: async () => {
      if (!userId) return [];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS}?userId=${
          userId
        }`,
        {
          method: API_METHODS.GET,
          headers: HEADERS,
        }
      );

      return await res.json();
    },

    enabled: !! userId,
  });

  return { data, isLoading, error };
};

export default useTodos;
