import { Router } from "express";
import authFactory from "./auth.factory";
import { auth } from "@/middlewares/auth.middleware";

const authRouter = Router();

authRouter.post("/login", authFactory.login);
authRouter.post("/otp/validate", auth(), authFactory.validateOTP);
authRouter.get(
  "/verify-email",
  auth({ emailVerified: false }),
  authFactory.verifyUserEmail
);

export { authRouter };
