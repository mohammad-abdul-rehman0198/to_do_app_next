import * as yup from "yup";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const ResetPasswordEmailSchema = yup.object().shape({
  email: yup
    .string()
    .email(NOTIFY_MESSAGES.EMAIL_INVALID)
    .required(NOTIFY_MESSAGES.EMAIL_REQUIRED),
});
