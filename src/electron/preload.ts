// preload.ts
import { contextBridge, ipcRenderer } from "electron";


contextBridge.exposeInMainWorld("ElectronAPI", {
  // usage in frontend: window.ElectronAPI.TestPreload()
  TestPreload: () => {
    console.log("preload js work !");
  },

});
