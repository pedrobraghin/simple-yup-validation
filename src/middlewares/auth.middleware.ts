import { Logger } from "@/providers";
import { JwtHandler } from "@/jwt/JwtHandler";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { Request, Response, NextFunction } from "express";
import { UsersService } from "@/modules/user/user.service";
import userRepository from "@/modules/user/user.repository";
import { UnauthorizedError } from "@/errors/UnauthorizedError";

interface AuthOptions {
  emailVerified?: boolean;
}

export function auth(options?: AuthOptions) {
  return async function (req: Request, _res: Response, next: NextFunction) {
    try {
      const { emailVerified = true }: AuthOptions = options ? options : {};

      Logger.info("[Auth Middleware ] - Start");
      const token =
        req.headers.authorization?.split(" ")[1] || req.cookies["jwt"];

      if (!token) {
        Logger.info("[Auth Middleware ] - Error - Token is missing");
        return next(new UnauthorizedError("Invalid or expired token"));
      }

      const payload = JwtHandler.validateToken(token);

      if (!payload) {
        Logger.info("[Auth Middleware ] - Error - Invalid token");
        return next(new UnauthorizedError("Invalid or expired token"));
      }

      const usersService = new UsersService(userRepository);
      const user = await usersService.getById(payload.sub);

      if (emailVerified) {
        if (!user.verified) {
          Logger.info("[Auth Middleware ] - Error - Email not verified");
          return next(new ForbiddenError("Email address not verified"));
        }
      }

      req.app.locals.user = user;
      next();
    } catch (err) {
      if (err instanceof Error) {
        Logger.info(`[Auth Middleware ] - Error - ${err.message}`);
      }
      return next(new UnauthorizedError("Invalid or expired token"));
    }
  };
}
