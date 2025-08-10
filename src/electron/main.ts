//main.ts
import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { isDev, logDev } from "./utils.js";



  
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  if (isDev()) {
    logDev('warn', '=========================================================');
    logDev('warn', 'Development mode detected, loading from local server 5123');
    logDev('warn', '=========================================================');
    mainWindow.loadURL("http://localhost:5123");

  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-vue/index.html"));
    Menu.setApplicationMenu(null); // remove bar on prod
  }
}

app.whenReady().then(createWindow);
