import { database } from "@/database";
import { Logger } from "@/providers/logger";
import { UserEntity } from "./user.entity";
import { GetUserDTO } from "./dto/get-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { CreateUserDTO } from "./dto/create-user.dto";
import { NotFoundError } from "@/errors/NotFoundError";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { BadRequestError } from "@/errors/BadRequestError";
import { UpdatePasswordDTO } from "./dto/update-password.dto";
import { PasswordUtils, validate, isEmptyObject } from "@/utils";
import { IUsersRepository } from "./interfaces/user.repository.interface";

import {
  createUserSchema,
  updatePasswordSchema,
  updateUserSchema,
} from "./user.validator";
import { AuthService } from "../auth/auth.service";

export class UsersService {
  constructor(
    private usersRepository: IUsersRepository,
    private readonly authService: AuthService
  ) {}

  async create(dto: CreateUserDTO): Promise<GetUserDTO> {
    Logger.info("[Users Service] - create - Start");

    const validation = await validate<CreateUserDTO>(createUserSchema, dto);

    if (validation.error) {
      Logger.info("[Users Service] - create - Error - Invalid DTO");
      throw new BadRequestError("Validation error", validation.errors);
    }

    const userAlreadyExists = await this.usersRepository.find({
      email: dto.email,
    });

    if (userAlreadyExists) {
      Logger.info("[Users Service] - create - Error - Email already exists");
      throw new BadRequestError("Validation error", "Email already exists");
    }

    const passwordHash = await PasswordUtils.hashPass(dto.password);
    const { password, passwordConfirm, ...data } = validation.data;

    const { token, tokenExpires } =
      await this.authService.sendConfirmationEmail({
        email: data.email,
        userName: data.name,
      });

    const user: UserEntity = await this.usersRepository.create({
      ...data,
      passwordHash,
      token,
      tokenExpires,
    } as UserEntity);

    const publicUser: GetUserDTO = {
      id: user.id,
      name: user.name,
    };

    Logger.info("[Users Service] - create - End");
    return publicUser;
  }

  async update(user: UserEntity, dto: UpdateUserDTO): Promise<UpdateUserDTO> {
    Logger.info("[Users Service - update - Start]");

    const validation = await validate<UpdateUserDTO>(updateUserSchema, dto);

    if (validation.error) {
      Logger.info("[Users Service] - update - Error - Invalid DTO");
      throw new BadRequestError("Validation error", validation.errors);
    }

    const invalidDto = isEmptyObject(validation.data);

    if (invalidDto) {
      Logger.info("[Users Service] - update - Error - Empty Object");
      throw new BadRequestError(
        "Validation error",
        "At least one field required to update"
      );
    }

    const toUpdate: UpdateUserDTO & { verified?: boolean } = {
      ...validation.data,
    };

    if (validation.data.email) {
      const emailAlreadyExists = await this.usersRepository.find({
        email: validation.data.email,
      });

      if (emailAlreadyExists) {
        Logger.info("[Users Service] - update - Error - Email already exists");
        throw new BadRequestError("Validation error", {
          email: "Email already exists",
        });
      }

      toUpdate.verified = false;

      await this.authService.sendConfirmationEmail({
        email: validation.data.email,
        userName: user.name,
      });
    }

    const updatedUser = await this.usersRepository.update(user.id, toUpdate);

    if (!updatedUser) {
      Logger.info(
        `[Users Service] - update - Error - User not found: ${user.id}`
      );
      throw new NotFoundError("User not found");
    }

    Logger.info("[Users Service] - update - End");

    return updatedUser;
  }

  async updatePassword(
    id: string,
    { password, passwordConfirm, currentPassword }: UpdatePasswordDTO
  ): Promise<void> {
    Logger.info("[Users Service] - updatePassword - Start");

    const validation = await validate<UpdatePasswordDTO>(updatePasswordSchema, {
      password,
      passwordConfirm,
      currentPassword,
    });

    if (validation.error) {
      Logger.info("[Users Service] - updatePassword - Error - Invalid DTO");
      throw new BadRequestError("Validation error", validation.errors);
    }

    const user = await this.usersRepository.findById(id);

    if (!user) {
      Logger.info(
        `[Users Service] - updatePassword - Error - User not found: ${id}`
      );
      throw new NotFoundError("User not found");
    }

    const passwordsMatch = await PasswordUtils.comparePass(
      currentPassword,
      user.passwordHash
    );

    if (!passwordsMatch) {
      Logger.info(
        `[Users Service] - updatePassword - Error - Invalid password`
      );
      throw new ForbiddenError("Forbidden");
    }

    const passwordHash = await PasswordUtils.hashPass(validation.data.password);

    const updatedUser = await this.usersRepository.updatePassword(
      id,
      passwordHash
    );

    if (!updatedUser) {
      Logger.info(
        `[Users Service] - updatePassword - Error - User not found: ${id}`
      );
      throw new NotFoundError("User not found");
    }

    Logger.info("[Users Service] - updatePassword - End");
  }

  async getById(id: string): Promise<Omit<UserEntity, "passwordHash">> {
    Logger.info(`[Users Service] - getById - Start - ${id}`);

    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    Logger.info("[Users Service] - getById - End");

    const { passwordHash, ...rest } = user;

    return rest;
  }

  async list(): Promise<GetUserDTO[]> {
    Logger.info("[Users Service] - list - Start");
    const users = await database.user.findMany();

    const publicUsers = this.getUserPublicData(users);

    Logger.info("[Users Service] - list - End");

    return publicUsers;
  }

  async delete(id: string): Promise<GetUserDTO> {
    Logger.info(`[Users Service] - delete - Start - ${id}`);

    const deletedUser = await this.usersRepository.delete(id);

    if (!deletedUser) {
      Logger.info(`[Users Service] - delete - Error - User not found: ${id}`);
      throw new NotFoundError("User not found");
    }

    const publicUser = { ...deletedUser };

    Logger.info("[Users Service] - delete - End");

    return publicUser;
  }

  private getUserPublicData(data: UserEntity[]): GetUserDTO[] {
    return data.map((user) => {
      const publicUser: GetUserDTO = {
        id: user.id,
        name: user.name,
      };
      return publicUser;
    });
  }
}
