import * as yup from "yup";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const SignupSchema = yup.object({
  name: yup.string().required(NOTIFY_MESSAGES.NAME_REQUIRED),
  email: yup
    .string()
    .required(NOTIFY_MESSAGES.EMAIL_REQUIRED)
    .email(NOTIFY_MESSAGES.EMAIL_INVALID),
  password: yup
    .string()
    .required(NOTIFY_MESSAGES.PASSWORD_REQUIRED)
    .min(6, NOTIFY_MESSAGES.PASSWORD_MIN_LENGTH),
  confirmPassword: yup
    .string()
    .required(NOTIFY_MESSAGES.PASSWORD_CONFIRM_REQUIRED)
    .oneOf([yup.ref("password")], NOTIFY_MESSAGES.PASSWORD_MATCH),
});
