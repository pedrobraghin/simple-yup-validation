import { CookieOptions, Response } from "express";

export class CookieUtils {
  static sessionCookie(res: Response, payload: string) {
    const expiresIn = Number(process.env.SESSION_COOKIE_EXPIRES_IN);
    const ONE_DAY = 1000 * 60 * 60 * 24;
    const maxAge = Date.now() + expiresIn * ONE_DAY;

    const cookieOptions: CookieOptions = {
      httpOnly: true,
      maxAge,
      sameSite: false,
    };

    if (process.env.NODE_ENV === "production") {
      cookieOptions.secure = true;
    }

    res.cookie("jwt", payload, cookieOptions);
  }

  static removeSessionCookie(res: Response) {
    res.clearCookie("jwt");
  }
}
