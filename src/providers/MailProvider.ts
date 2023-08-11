import { config } from "@/config";
import nodemailer, { Transporter, SendMailOptions } from "nodemailer";

class MailTrapBuilder {
  static build(): Transporter {
    return nodemailer.createTransport(config.mailtrap);
  }
}

class MailProvider {
  constructor(private transporter: Transporter) {}

  async sendEmail(options: SendMailOptions) {
    await this.transporter.sendMail({
      ...options,
      from: options.from || config.emailFrom,
    });
  }
}

export default new MailProvider(MailTrapBuilder.build());
