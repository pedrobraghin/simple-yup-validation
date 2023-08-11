import * as yup from "yup";

export const createUserSchema = yup.object().shape({
  name: yup
    .string()
    .min(3, "Name must have at least 3 characters")
    .required("A name must be provided"),
  email: yup
    .string()
    .email("A valid email must be provided")
    .required("A email must be provided"),
  password: yup
    .string()
    .min(8, "A password must contain at least 8 characters")
    .required("A password must be provided"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Password does not match")
    .required("Password confirm must be provided"),
});

export const updateUserSchema = yup.object().shape({
  name: yup.string().min(3, "Name must have at least 3 characters"),
  email: yup.string().email("A valid email must be provided"),
});

export const updatePasswordSchema = yup.object().shape({
  password: yup
    .string()
    .min(8, "A password must contain at least 8 characters")
    .required("A password must be provided"),
  passwordConfirm: yup
    .string()
    .oneOf([yup.ref("password")], "Password does not match")
    .required("Password confirm must be provided"),
  currentPassword: yup.string().required("Current password must be provided"),
});
