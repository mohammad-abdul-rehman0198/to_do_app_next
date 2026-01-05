import * as yup from "yup";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const ProfileFormSchema = yup.object({
    name: yup
      .string()
      .required(NOTIFY_MESSAGES.NAME_REQUIRED)
  });