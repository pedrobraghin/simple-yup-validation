import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import UsersRepository from "../user/user.repository";

class AuthFactory {
  static build() {
    return new AuthController(new AuthService(UsersRepository));
  }
}

export default AuthFactory.build();
