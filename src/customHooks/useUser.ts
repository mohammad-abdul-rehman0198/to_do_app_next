import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { API_METHODS } from "@/utils/enum/ApiMethods";
import { QUERY_KEYS } from "@/utils/constants/QueryKeys";
import { API_END_POINTS, HEADERS } from "@/utils/constants/apis/Index";

const fetchUser = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.USERS_USER}`,
    {
      method: API_METHODS.GET,
      headers: HEADERS,
    }
  );

  const data = await res.json();

  if (!data.success) {
    return null;
  }

  return data.userData;
};

export const useUser = () => {
  const pathname = usePathname();

  const shouldFetch = pathname === "/" || pathname === "/profile";

  return useQuery({
    queryKey: [QUERY_KEYS.USER],
    queryFn: fetchUser,
    refetchOnWindowFocus: false,
    enabled: shouldFetch,
  });
};
