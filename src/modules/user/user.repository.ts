import { database } from "@/database";
import { SelectType } from "@/@types";
import { extractQuery } from "@/utils/";
import { UserEntity } from "./user.entity";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { UserQuery } from "./interfaces/query-user.interface";
import { IUsersRepository } from "./interfaces/user.repository.interface";

export class UsersRepository implements IUsersRepository {
  async create(dto: UserEntity): Promise<UserEntity> {
    const user = await database.user.create({
      data: dto,
    });
    return user;
  }

  async list(): Promise<UserEntity[]> {
    const users = await database.user.findMany();
    return users;
  }

  async findById(id: string): Promise<UserEntity | null> {
    const user = await database.user.findFirst({
      where: {
        id,
      },
    });

    return user;
  }

  async find(query: UserQuery): Promise<UserEntity | null> {
    const user = await database.user.findFirst({
      where: query,
    });

    return user;
  }

  async update(
    id: string,
    dto: UpdateUserDTO
  ): Promise<SelectType<UpdateUserDTO> | null> {
    const fields: SelectType<UpdateUserDTO> = extractQuery<UpdateUserDTO>(dto);

    const updatedUser = await database.user.update({
      where: {
        id,
      },
      data: dto,
      select: fields,
    });

    return updatedUser;
  }

  async updatePassword(
    id: string,
    passwordHash: string
  ): Promise<UserEntity | null> {
    const user = await database.user.update({
      where: {
        id,
      },
      data: {
        passwordHash,
      },
    });

    return user;
  }

  async delete(id: string): Promise<UserEntity | null> {
    const userExists = await database.user.findFirst({
      where: {
        id,
      },
    });

    if (!userExists) return null;

    const deletedUser = await database.user.delete({
      where: {
        id,
      },
    });

    return deletedUser;
  }
}

export default new UsersRepository();
