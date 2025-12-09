import { API_METHODS } from "../enum/ApiMethods";
import { API_END_POINTS, HEADERS } from "../constants/apis/Index";

export const getUser = async () => {

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL + API_END_POINTS.USERS_USER}`,
    {
        method: API_METHODS.GET,
        headers: HEADERS,

    }
  );
  const data = await res.json();

  if (data.success) {
    return data.userData;
  } else {
    return data.message;
  }
};
