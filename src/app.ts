import { AppError } from "./errors/AppError";
import express, { Request, Response, NextFunction } from "express";
import router from "./routes";
import { Logger } from "./providers/logger";

const app = express();

app.use(express.json());

app.use(router);

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    Logger.info(`[APP-ERROR] - ${error.name} - ${error.message}`);
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      message: error.message,
      errors: error.error,
    });
  }
  Logger.error(`[UNEXPECTED-ERROR] - ${error.name} - ${error.message}`);
  return res.status(500).json({
    statusCode: 500,
    message: "Internal server error",
  });
});

app.all("*", (req: Request, res: Response) => {
  Logger.info(`[NOT-FOUND-ROUTE] - ${req.url}`);
  return res.status(404).json({
    statusCode: 404,
    message: "Route not found",
  });
});

export { app };
