import * as yup from "yup";

export const FormSchema = yup.object().shape({
  taskName: yup.string().required("Task name is required."),
});
