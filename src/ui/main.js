import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";

// Intercept renderer console calls to send to main process (so they print in terminal for a centralized logging)
if (window.ElectronAPI && window.ElectronAPI.sendLog) {
  const originalLog = console.log;
  const originalWarn = console.warn;
  const originalError = console.error;

  console.log = (...args) => {
    window.ElectronAPI.sendLog("info", "Renderer", ...args);
    originalLog(...args);
  };

  console.warn = (...args) => {
    window.ElectronAPI.sendLog("warn", "Renderer", ...args);
    originalWarn(...args);
  };

  console.error = (...args) => {
    window.ElectronAPI.sendLog("error", "Renderer", ...args);
    originalError(...args);
  };
}

createApp(App).mount("#app");
