const API_END_POINTS = {
  TODOS: "/todos",
  TODOS_COUNT: "/todos/count",
  USERS_SIGNUP: "/auth/signup",
  USERS_LOGIN: "/auth/login",
  USERS_LOGOUT: "/auth/logout",
  USERS_USER: "/auth/user",
  USERS_RESET_PASSWORD_EMAIL: "/auth/resetPassword/sentEmail",
  USERS_RESET_PASSWORD: "/auth/resetPassword",
  USERS_PROFILE: "/profile",
};

const HEADERS = {
  "Content-Type": "application/json",
};

export { API_END_POINTS, HEADERS };
