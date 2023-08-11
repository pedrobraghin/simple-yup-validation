export const config = {
  port: Number(process.env.PORT) || 3000,
  jwtSecret: String(process.env.JWT_SECRET),
  jwtExpiresIn: String(process.env.JWT_EXPIRES_IN),
  emailProvider: {
    host: String(process.env.EMAIL_PROVIDER_HOST),
    port: Number(process.env.EMAIL_PROVIDER_PORT),
    auth: {
      user: String(process.env.EMAIL_PROVIDER_USER),
      pass: String(process.env.EMAIL_PROVIDER_PASS),
    },
  },
  emailFrom: String(process.env.EMAIL_FROM),
};
