export class Logger {
  static warn(message: string) {
    console.log(Logger.formatLog(Logger.yellow("WRN"), Logger.yellow(message)));
  }

  static error(message: string) {
    console.log(Logger.formatLog(Logger.red("ERR"), Logger.red(message)));
  }

  static info(message: string) {
    console.log(Logger.formatLog(Logger.blue("INF"), message));
  }

  static yellow(message: string) {
    return `\x1b[33m${message}\x1b[0m`;
  }

  static red(message: string) {
    return `\x1b[31m${message}\x1b[0m`;
  }

  static blue(message: string) {
    return `\x1b[34m${message}\x1b[0m`;
  }

  static green(message: string) {
    return `\x1b[32m${message}\x1b[0m`;
  }

  static formatLog(prefix: string, message: string) {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "00");
    const hours = date.getHours().toString().padStart(2, "00");
    const minutes = date.getMinutes().toString().padStart(2, "00");
    const seconds = date.getSeconds().toString().padStart(2, "00");
    const time = `${hours}:${minutes}:${seconds}`;

    return `[${prefix}] [${Logger.green(time)}] ${message}`;
  }
}
