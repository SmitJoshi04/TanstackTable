import * as yup from "yup";

export const formSchema = yup.object({
  name: yup.string().required("Name is required"),
  email: yup
    .string()
    .email("Must be a valid email")
    .required("Email is required"),
  count: yup
    .number()
    .transform((originalValue) => Number(originalValue))
    .min(1)
    .max(7)
    .required("Count is required"),
  items: yup.array().of(
    yup.object({
      butter: yup
        .number()
        .typeError("Butter must be a number")
        .required("Butter is required"),
      bread: yup
        .number()
        .typeError("Bread must be a number")
        .required("Bread is required"),
    })
  ),
  isMilkRequired: yup.boolean().when("count", ([count], schema) => {
    return count === 3 || count === 6
      ? schema.required("Milk selection is required")
      : schema.notRequired();
  }),
});
