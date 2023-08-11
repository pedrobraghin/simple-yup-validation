import { CookieUtils } from "@/utils";
import { AuthService } from "./auth.service";
import { Request, Response } from "express";
import { LoginUserDTO } from "./dtos/login-user.dto";
import { UserEntity } from "@/modules/user/user.entity";
import { GetUserDTO } from "@/modules/user/dto/get-user.dto";
import { Controller } from "@/common/controller.decorator";

@Controller
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  async verifyUserEmail(req: Request, res: Response) {
    const token: string = req.query.token as string;
    const user: UserEntity = req.app.locals.user;

    const result: GetUserDTO = await this.authService.verifyEmail(
      user.id,
      token
    );

    return res.status(200).json({
      statusCode: 200,
      message: "Email successfully verified",
      data: result,
    });
  }

  async login(req: Request, res: Response) {
    const loginUserDto: LoginUserDTO = req.body;
    const token = await this.authService.login(loginUserDto);

    CookieUtils.sessionCookie(res, token);

    return res.status(200).json({
      statusCode: 200,
      message: "Successfully logged in.",
    });
  }

  async validateOTP(req: Request, res: Response) {}
}
