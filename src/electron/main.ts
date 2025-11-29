//main.ts
import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { isDev, logger } from "./utils.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: true,
    },
  });

  if (isDev()) {
    logger.warn(
      "Main",
      "========================================================="
    );
    logger.warn(
      "Main",
      "Development mode detected, loading from local server 5123"
    );
    logger.warn(
      "Main",
      "========================================================="
    );
    mainWindow.loadURL("http://localhost:5123");
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(app.getAppPath(), "/dist-vue/index.html"));
    Menu.setApplicationMenu(null); // remove bar on prod
  }
}

app.whenReady().then(async () => {
  if (isDev()) {
    try {
      const { createRequire } = await import("module");
      const require = createRequire(import.meta.url); // since this is a Commonjs module, we need to use createRequire
      const installExtension =
        require("electron-devtools-installer").default ||
        require("electron-devtools-installer");
      //https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd
      const VUEJS3_DEVTOOLS_ID = "nhdogjmejiglipccpnnnanhbledajbpd";

      const extension = await installExtension(VUEJS3_DEVTOOLS_ID);
      logger.success("DevTools", "Added Extension:", extension.name);
    } catch (err) {
      logger.error("DevTools", "An error occurred: ", err);
    }
  }
  createWindow();
});

ipcMain.on(
  "log-message",
  (_event, level: string, label: string, ...args: any[]) => {
    const logLevel = level as keyof typeof logger;
    if (logger[logLevel]) {
      logger[logLevel](label, ...args);
    }
  }
);

app.on("window-all-closed", () => {
  app.quit();
});
