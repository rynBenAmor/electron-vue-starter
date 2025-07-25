//main.ts
import { app, BrowserWindow } from "electron";
import path from "path";
import { isDev } from "./utils.js";

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev()) {
    console.warn('\x1b[33m%s\x1b[0m', 'WARNING: This is a development server'); //ANSI Escape Codes
    mainWindow.loadURL("http://localhost:5123");
    
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-vue/index.html"));
  }
}

app.whenReady().then(createWindow);
