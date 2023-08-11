import * as yup from "yup";

export const productSchema = yup.object({
  name: yup
    .string()
    .min(3, "Product name must have at least 3 characters")
    .required("Product name bust be provided"),
  price: yup
    .number()
    .min(0, "Product price must be greater than or equal 0")
    .required("A product must have a price"),
  category: yup
    .string()
    .min(3, "Product category must have at least 3 characters")
    .required("Product category bust be provided"),
  barCode: yup
    .string()
    .min(12, "Product bar code must have exact 12 characters")
    .max(12, "Product bar code must have exact 12 characters"),
});
