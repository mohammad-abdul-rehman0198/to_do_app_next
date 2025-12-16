import * as yup from "yup";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const LoginSchema = yup.object({
  email: yup
    .string()
    .required(NOTIFY_MESSAGES.EMAIL_REQUIRED)
    .email(NOTIFY_MESSAGES.EMAIL_INVALID),
  password: yup.string().required(NOTIFY_MESSAGES.PASSWORD_REQUIRED),
});
