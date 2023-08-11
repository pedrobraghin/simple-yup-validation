import { Request, Response } from "express";
import { UsersService } from "./user.service";
import { GetUserDTO } from "./dto/get-user.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { Controller } from "@/common/controller.decorator";
import { UpdatePasswordDTO } from "./dto/update-password.dto";
import { UserEntity } from "./user.entity";

@Controller
export class UsersController {
  constructor(private usersService: UsersService) {}

  async createUser(req: Request, res: Response) {
    const dto: CreateUserDTO = req.body;

    const user: GetUserDTO = await this.usersService.create(dto);

    return res.status(201).json({
      statusCode: 201,
      message: "User created successfully",
      data: user,
    });
  }

  async updateUser(req: Request, res: Response) {
    const dto: CreateUserDTO = req.body;
    const user: UserEntity = req.app.locals.user;

    const updatedUser: UpdateUserDTO = await this.usersService.update(
      user,
      dto
    );

    return res.status(200).json({
      statusCode: 200,
      message: "User updated successfully",
      data: updatedUser,
    });
  }

  async updatePassword(req: Request, res: Response) {
    const dto: UpdatePasswordDTO = req.body;
    const { id } = req.app.locals.user;

    await this.usersService.updatePassword(id, dto);

    return res.status(204).json({
      statusCode: 204,
      message: "Password updated successfully",
    });
  }

  async index(_req: Request, res: Response) {
    const users = await this.usersService.list();

    return res.status(200).json({
      statusCode: 200,
      results: users.length,
      data: users,
    });
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.app.locals.user;
    const user = await this.usersService.getById(id);

    return res.status(200).json({
      statusCode: 200,
      data: user,
    });
  }

  async deleteUser(req: Request, res: Response) {
    const { id } = req.app.locals.user;
    await this.usersService.delete(id);

    return res.status(204).json({
      statusCode: 204,
      message: "User deleted successfully",
    });
  }
}
