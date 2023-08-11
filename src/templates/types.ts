export interface WelcomeTemplate {
  userName: string;
  url: string;
}

export enum WelcomeTemplateLabels {
  TEMPLATE_NAME = "welcome",
  USER_NAME = "[USER_NAME]",
  URL = "[URL]",
}

export interface BaseTemplate {
  [index: string]: string;
}
