import { Router } from "express";
import { productRouter } from "../modules/product/product.routes";
import { usersRouter } from "@/modules/user/user.routes";
import { authRouter } from "@/modules/auth/auth.routes";

const router = Router();

router.use("/products", productRouter);
router.use("/users", usersRouter);
router.use("/auth", authRouter);

export default router;
