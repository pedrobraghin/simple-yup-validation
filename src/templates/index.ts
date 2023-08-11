import fs from "fs";
import { Logger } from "@/providers";
import { BaseTemplate, WelcomeTemplate, WelcomeTemplateLabels } from "./types";

class TemplateBuilder {
  private readonly baseUrl: string = "./src/templates";
  private templates: BaseTemplate = {};
  constructor() {
    this.loadTemplates();
  }

  async loadTemplates() {
    try {
      Logger.info("[TEMPLATE-BUILDER] - Loading templates");
      const files = fs.readdirSync(this.baseUrl, { encoding: "utf-8" });
      files.map((file) => {
        if (file.endsWith(".html")) {
          try {
            const template = fs.readFileSync(
              `${this.baseUrl}/${file}`,
              "utf-8"
            );
            this.templates[file.split(".")[0]] = template;
          } catch (e) {
            if (e instanceof Error) {
              Logger.error(
                `[TEMPLATE-BUILDER] - Error when loading ${file} template file - ${e.message}`
              );
            }
          }
        }
      });
    } catch (e) {
      if (e instanceof Error) {
        Logger.error(
          `[TEMPLATE-BUILDER] - Error when read templates folder - ${e.name} - ${e.message}`
        );
      }
    } finally {
      Logger.info("[TEMPLATE-BUILDER] - Templates loaded");
    }
  }

  welcomeTemplate(data: WelcomeTemplate): string {
    const filledTemplate = this.templates[WelcomeTemplateLabels.TEMPLATE_NAME]
      .replace(WelcomeTemplateLabels.USER_NAME, data.userName)
      .replace(WelcomeTemplateLabels.URL, data.url);

    return filledTemplate;
  }
}

export default new TemplateBuilder();
