import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message: string, error?: string | object) {
    super(400, message, error);
  }
}
