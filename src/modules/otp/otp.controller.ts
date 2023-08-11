import { NotFoundError } from "@/errors/NotFoundError";
import { Controller } from "@/common/controller.decorator";
import { IUsersRepository } from "../user/interfaces/user.repository.interface";
import { ForbiddenError } from "@/errors/ForbiddenError";

@Controller
export class OTPController {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async validate(userId: string, token: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const validToken = user.token === token;

    if (!validToken) {
      throw new ForbiddenError("Invalid activation token");
    }

    const tokenExpired = new Date() > user.tokenExpires;

    if (tokenExpired) {
      throw new ForbiddenError("Invalid activation token");
    }
    const newTokenExpiresDate = new Date();

    newTokenExpiresDate.setMinutes(newTokenExpiresDate.getMinutes() - 60);

    await this.usersRepository.update(userId, {
      verified: true,
      tokenExpires: newTokenExpiresDate,
    });

    return {
      id: user.id,
      name: user.name,
    };
  }
}
