import * as bcrypt from "bcrypt";

export class PasswordUtils {
  static async hashPass(password: string): Promise<string> {
    const hash = await bcrypt.hash(password, 12);
    return hash;
  }

  static async comparePass(
    password: string,
    encrypted: string
  ): Promise<boolean> {
    return await bcrypt.compare(password, encrypted);
  }
}
