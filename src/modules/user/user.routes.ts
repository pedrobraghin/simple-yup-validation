import { Router } from "express";
import userFactory from "./user.factory";
import { auth } from "@/middlewares/auth.middleware";

const usersRouter = Router();

usersRouter.post("/", userFactory.createUser);

usersRouter.use(auth());

usersRouter.get("/", userFactory.index);
usersRouter.get("/:id", userFactory.getUserById);
usersRouter.delete("/:id", userFactory.deleteUser);
usersRouter.patch("/:id", userFactory.updateUser);
usersRouter.patch("/:id/update-password", userFactory.updatePassword);

export { usersRouter };
