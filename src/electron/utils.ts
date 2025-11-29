// utils.ts
// use netstat -ano | findstr :5123 to find process id
import { app } from "electron";
import path from "path";

export { isDev, getAssetPath, logDev, logger };

function isDev(): boolean {
  return !app.isPackaged;
}

function getAssetPath(...paths: string[]): string {
  return path.join(
    app.isPackaged ? process.resourcesPath : process.cwd(),
    ...paths
  );
}

type LogLevel = "info" | "warn" | "error" | "success" | "debug";

const ANSI_CODES = {
  reset: "\x1b[0m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  magenta: "\x1b[35m",
};

const logger = {
  info: (label: string, ...args: any[]) => {
    console.log(
      `${ANSI_CODES.cyan}[${label.toUpperCase()}]${ANSI_CODES.reset}`,
      ...args
    );
  },
  warn: (label: string, ...args: any[]) => {
    console.log(
      `${ANSI_CODES.yellow}[${label.toUpperCase()}]${ANSI_CODES.reset}`,
      ...args
    );
  },
  error: (label: string, ...args: any[]) => {
    console.log(
      `${ANSI_CODES.red}[${label.toUpperCase()}]${ANSI_CODES.reset}`,
      ...args
    );
  },
  success: (label: string, ...args: any[]) => {
    console.log(
      `${ANSI_CODES.green}[${label.toUpperCase()}]${ANSI_CODES.reset}`,
      ...args
    );
  },
  debug: (label: string, ...args: any[]) => {
    if (isDev()) {
      console.log(
        `${ANSI_CODES.magenta}[${label.toUpperCase()}]${ANSI_CODES.reset}`,
        ...args
      );
    }
  },
};

function logDev(level: LogLevel, label: string, ...args: any[]): void {
  if (isDev()) {
    logger[level](label, ...args);
  }
}
