import { AnyObjectSchema, ValidationError } from "yup";

interface ValidateResponse<T> {
  data: T;
  error: boolean;
  errors: Array<string>;
}

export async function validate<T>(
  schema: AnyObjectSchema,
  data: T
): Promise<ValidateResponse<T>> {
  try {
    const parsedData = await schema.validate(data, {
      strict: false,
      stripUnknown: true,
      abortEarly: false,
    });

    return { data: parsedData, error: false, errors: [] };
  } catch (e) {
    let errors: string[] = [];

    if (e instanceof ValidationError) {
      errors = e.errors;
    }

    return { data, error: true, errors };
  }
}
