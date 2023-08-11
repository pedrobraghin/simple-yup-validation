export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: String(process.env.JWT_SECRET),
  jwtExpiresIn: String(process.env.JWT_EXPIRES_IN),
  mailtrap: {
    host: String(process.env.MAILTRAP_HOST),
    port: Number(process.env.MAILTRAP_PORT),
    auth: {
      user: String(process.env.MAILTRAP_USER),
      pass: String(process.env.MAILTRAP_PASS),
    },
  },
  emailFrom: String(process.env.EMAIL_FROM),
};
