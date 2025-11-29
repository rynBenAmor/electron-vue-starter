// preload.ts
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("ElectronAPI", {
  // usage in frontend: window.ElectronAPI.TestPreload()
  TestPreload: () => {
    console.log("preload.js and HMR works !");
    ipcRenderer.send(
      "log-message",
      "info",
      "Preload",
      "preload.js and HMR works !"
    );
  },
  sendLog: (level: string, label: string, ...args: any[]) => {
    ipcRenderer.send("log-message", level, label, ...args);
  },
});
