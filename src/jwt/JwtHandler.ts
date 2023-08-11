import { config } from "@/config";
import jwt, { JwtPayload } from "jsonwebtoken";

interface Payload extends JwtPayload {
  sub: string;
}

export class JwtHandler {
  static generateToken(id: string): string {
    const token = jwt.sign({ sub: id }, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
    return token;
  }

  static validateToken(token: string): Payload | null {
    try {
      const payload = jwt.verify(token, config.jwtSecret) as Payload;
      return payload;
    } catch (e) {
      return null;
    }
  }
}
