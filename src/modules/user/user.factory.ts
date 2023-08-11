import { UsersService } from "./user.service";
import UsersRepository from "./user.repository";
import { AuthService } from "../auth/auth.service";
import { UsersController } from "./user.controller";

class UsersFactory {
  static build() {
    return new UsersController(
      new UsersService(UsersRepository, new AuthService(UsersRepository))
    );
  }
}

export default UsersFactory.build();
