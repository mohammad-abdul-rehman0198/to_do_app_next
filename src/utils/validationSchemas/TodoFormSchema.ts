import * as yup from "yup";

import { NOTIFY_MESSAGES } from "@/utils/constants/NotifyMessages";

export const FormSchema = yup.object().shape({
  taskName: yup.string().required(NOTIFY_MESSAGES.TASK_NAME_REQUIRED),
});
