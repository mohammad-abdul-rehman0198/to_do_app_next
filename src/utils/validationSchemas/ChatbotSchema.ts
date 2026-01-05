import * as yup from "yup";

export const ChatbotSchema = yup.object({
    message: yup.string().trim().required("Message is required"),
  });