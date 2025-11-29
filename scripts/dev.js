import { spawn } from "child_process";
import electron from "electron";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.join(__dirname, "..");

/** @type {import('child_process').ChildProcess} */
let electronProcess = null;

async function startVite() {
  const server = await createServer({
    configFile: path.join(root, "vite.config.js"),
    mode: "development",
  });
  await server.listen();
  console.log("Vite server started");
  return server;
}

function startTSC() {
  console.log("Starting TSC...");
  const tsc = spawn("npm", ["run", "transpile:electron", "--", "--watch"], {
    cwd: root,
    shell: true,
    stdio: "inherit",
  });
  return tsc;
}

function startElectron() {
  if (electronProcess) {
    console.log("Restarting Electron...");
    electronProcess.kill();
    electronProcess = null;
  } else {
    console.log("Starting Electron...");
  }

  electronProcess = spawn(electron, ["."], {
    cwd: root,
    stdio: "inherit",
  });

  electronProcess.on("close", (code) => {
    if (code === 0) {
      // Clean exit, likely from the user closing the app
      process.exit(0);
    }
  });
}

async function start() {
  const viteServer = await startVite();
  const tscProcess = startTSC();

  // Watch for changes in dist-electron to restart Electron
  // We use Vite's watcher for convenience, but point it to dist-electron
  const { watch } = await import("chokidar");
  const watcher = watch(path.join(root, "dist-electron"), {
    ignoreInitial: true,
  });

  watcher.on("add", () => startElectron());
  watcher.on("change", () => startElectron());

  // Handle process exit
  process.on("SIGINT", () => {
    viteServer.close();
    tscProcess.kill();
    if (electronProcess) electronProcess.kill();
    process.exit();
  });

  process.on("exit", () => {
    viteServer.close();
    tscProcess.kill();
    if (electronProcess) electronProcess.kill();
  });
}

start();
