import { SelectType } from "@/@types";
import { UserEntity } from "../user.entity";
import { UserQuery } from "./query-user.interface";
import { UpdateUserDTO } from "../dto/update-user.dto";

export interface IUsersRepository {
  create(dto: UserEntity): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  find(query: UserQuery): Promise<UserEntity | null>;
  list(): Promise<UserEntity[]>;
  update(
    id: string,
    dto: Partial<UserEntity>
  ): Promise<SelectType<UpdateUserDTO> | null>;
  updatePassword(id: string, passwordHash: string): Promise<UserEntity | null>;
  delete(id: string): Promise<UserEntity | null>;
}
