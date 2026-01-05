import * as yup from "yup";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const ResetPasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(6, NOTIFY_MESSAGES.PASSWORD_MIN_LENGTH)
    .required(NOTIFY_MESSAGES.PASSWORD_REQUIRED),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], NOTIFY_MESSAGES.PASSWORD_MATCH)
    .required(NOTIFY_MESSAGES.PASSWORD_CONFIRM_REQUIRED),
});
