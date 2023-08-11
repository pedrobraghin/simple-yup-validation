import { v4 as uuid } from "uuid";
import { Logger } from "@/providers";
import { PasswordUtils } from "@/utils";
import TemplateBuilder from "@/templates";
import { JwtHandler } from "@/jwt/JwtHandler";
import MailProvider from "@/providers/MailProvider";
import { LoginUserDTO } from "./dtos/login-user.dto";
import { NotFoundError } from "@/errors/NotFoundError";
import { GetUserDTO } from "./../user/dto/get-user.dto";
import { ForbiddenError } from "@/errors/ForbiddenError";
import { UnauthorizedError } from "@/errors/UnauthorizedError";
import { IUsersRepository } from "../user/interfaces/user.repository.interface";
import { EmailConfirmation } from "./interfaces/email-confirmation.interface";

export class AuthService {
  constructor(private readonly usersRepository: IUsersRepository) {}

  async verifyEmail(userId: string, token: string) {
    Logger.info("[Auth Service ] - verifyEmail - Start");
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      Logger.info(
        `[Auth Service ] - verifyEmail - Error - User not found ${userId}`
      );
      throw new NotFoundError("User not found");
    }

    const validToken = user.token === token;

    if (!validToken) {
      Logger.info(
        `[Auth Service ] - verifyEmail - Error - Invalid token: ${token}`
      );
      throw new ForbiddenError("Invalid activation token");
    }

    const tokenExpired = new Date() > user.tokenExpires;

    if (tokenExpired) {
      Logger.info(
        `[Auth Service ] - verifyEmail - Error - Token expired: ${token}`
      );
      throw new ForbiddenError("Invalid activation token");
    }

    const newTokenExpiresDate = new Date();

    newTokenExpiresDate.setMinutes(newTokenExpiresDate.getMinutes() - 60);

    await this.usersRepository.update(userId, {
      verified: true,
      tokenExpires: newTokenExpiresDate,
    });

    const response: GetUserDTO = {
      id: user.id,
      name: user.name,
    };

    Logger.info("[Auth Service ] - verifyEmail - Start");

    return response;
  }

  async sendConfirmationEmail({ email, userName, id }: EmailConfirmation) {
    Logger.info("[Auth Service ] - sendConfirmationEmail - Start");
    const token = uuid();
    const tokenExpires = new Date();
    tokenExpires.setMinutes(new Date().getMinutes() + 15);

    if (id) {
      await this.usersRepository.update(id, { token, tokenExpires });
    }

    await MailProvider.sendEmail({
      to: email,
      subject: "Confirme seu e-mail para ativar sua conta.",
      html: TemplateBuilder.welcomeTemplate({
        userName,
        url: `http://localhost:8081/auth/verify-email?token=${token}`,
      }),
    });

    Logger.info("[Auth Service ] - sendConfirmationEmail - End");

    return {
      token,
      tokenExpires,
    };
  }

  async sendConfirmationEmailById(userId: string) {
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    await this.sendConfirmationEmail({
      id: user.id,
      email: user.email,
      userName: user.name,
    });
  }

  async login({ email, password }: LoginUserDTO) {
    Logger.info("[Auth Service] - login - Start");
    const user = await this.usersRepository.find({ email });

    if (!user) {
      Logger.info("[Auth Service] - login - Error - Invalid email");
      throw new UnauthorizedError("Invalid email or password");
    }

    const isValidPass = await PasswordUtils.comparePass(
      password,
      user.passwordHash
    );

    if (!isValidPass) {
      Logger.info("[Auth Service] - login - Error - Invalid password");
      throw new UnauthorizedError("Invalid email or password");
    }

    if (!user.verified) {
      await this.sendConfirmationEmail({
        id: user.id,
        email: user.email,
        userName: user.name,
      });
    }

    const token = JwtHandler.generateToken(user.id);

    Logger.info("[Auth Service] - login - End");

    return token;
  }
}
