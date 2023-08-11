import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(message: string, error?: string | object) {
    super(403, message, error);
  }
}
