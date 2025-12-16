"use client";

import { useAtomValue } from "jotai";
import { useQuery } from "@tanstack/react-query";

import { userAtom } from "@/state/atoms/user";
import { User } from "@/utils/interfaces/User";
import { API_METHODS } from "@/utils/enum/ApiMethods";
import { QUERY_KEYS } from "@/utils/constants/QueryKeys";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

const useTodos = () => {
  const userData = useAtomValue<User | null>(userAtom);

  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.TODOS, userData?.id],
    queryFn: async () => {
      if (!userData) return [];

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.TODOS}?userId=${
          userData.id
        }`,
        {
          method: API_METHODS.GET,
          headers: HEADERS,
        }
      );

      return await res.json();
    },

    enabled: !!userData,
  });

  return { data, isLoading, error };
};

export default useTodos;
