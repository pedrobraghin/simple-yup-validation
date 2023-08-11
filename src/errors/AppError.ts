export class AppError extends Error {
  public readonly statusCode: number;
  public readonly error: string | object | undefined;

  constructor(statusCode: number, message: string, error?: string | object) {
    super(message);
    this.statusCode = statusCode;
    this.error = error;
  }
}
