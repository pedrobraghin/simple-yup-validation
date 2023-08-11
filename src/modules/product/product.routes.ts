import { Router } from "express";
import ProductController from "./product.controller";
import { auth } from "@/middlewares/auth.middleware";

const productRouter = Router();

productRouter.use(auth());

productRouter.get("/", ProductController.index);
productRouter.post("/", ProductController.create);
productRouter.get("/:id", ProductController.getById);

export { productRouter };
