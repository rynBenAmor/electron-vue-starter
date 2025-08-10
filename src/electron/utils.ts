// utils.ts
// utils.ts
import { app } from 'electron'
import path from 'path';
import os from 'os';



export {
  isDev,
  getAssetPath,
  formatBytes,
  logDev,
  getPlatformInfo
}


function isDev(): boolean {
  //electron native check instead of process.env.NODE_ENV + cross-env
  return !app.isPackaged;
}


function getAssetPath(...paths: string[]): string {
  //example icon: getAssetPath('assets', 'icon.png')
  return path.join(app.isPackaged ? process.resourcesPath : process.cwd(), ...paths);
}


function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}


type LogLevel = 'info' | 'warn' | 'error' | 'success' | 'debug';

const colorMap: Record<LogLevel, string> = {
  info: '\x1b[36m',    // Cyan
  warn: '\x1b[33m',    // Yellow
  error: '\x1b[31m',   // Red
  success: '\x1b[32m', // Green
  debug: '\x1b[35m',   // Magenta
};

function logDev(level: LogLevel, label: string, ...args: any[]): void {
  //using //ANSI Escape Codes
  // example logDev('info', 'hello world')  

  if (isDev()) {
    const color = colorMap[level] || '\x1b[0m';
    const reset = '\x1b[0m';
    const tag = `${color}[${label.toUpperCase()}]${reset}`;
    console.log(tag, ...args);
  }
}



function getPlatformInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    memory: formatBytes(os.totalmem()),
    hostname: os.hostname(),
  };
}

