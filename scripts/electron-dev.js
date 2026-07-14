const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const waitOn = require("wait-on");

const devServerUrl = "http://127.0.0.1:5173";
const electronDir = path.join(__dirname, "../electron");

let electronProcess = null;
let restartTimer = null;
let isRestarting = false;

function startElectron() {
  if (electronProcess) {
    isRestarting = true;
    electronProcess.removeAllListeners("close");
    electronProcess.kill();
    electronProcess = null;
  }

  electronProcess = spawn(require("electron"), ["."], {
    stdio: "inherit",
    env: {
      ...process.env,
      VITE_DEV_SERVER_URL: devServerUrl,
    },
  });

  electronProcess.on("close", (code) => {
    if (isRestarting) {
      isRestarting = false;
      return;
    }

    process.exit(code ?? 0);
  });
}

function scheduleRestart() {
  if (restartTimer) {
    clearTimeout(restartTimer);
  }

  restartTimer = setTimeout(() => {
    startElectron();
  }, 300);
}

function watchElectronSources() {
  fs.watch(electronDir, { recursive: true }, (_, filename) => {
    if (!filename || !filename.endsWith(".js")) {
      return;
    }

    scheduleRestart();
  });
}

function shutdown() {
  if (restartTimer) {
    clearTimeout(restartTimer);
  }

  if (electronProcess) {
    electronProcess.kill();
  }
}

process.on("SIGINT", () => {
  shutdown();
  process.exit(0);
});

process.on("SIGTERM", () => {
  shutdown();
  process.exit(0);
});

waitOn({
  resources: ["tcp:127.0.0.1:5173", devServerUrl],
  timeout: 30000,
  validateStatus: (status) => status >= 200 && status < 500,
})
  .then(() => {
    startElectron();
    watchElectronSources();
  })
  .catch((error) => {
    process.exit(1);
  });
