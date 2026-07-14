const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs/promises');
const { AppPaths } = require('./paths');

let mainWindow;

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: AppPaths.preloadPath,
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    await mainWindow.loadURL(devServerUrl);

    const openDevTools =
      process.env.ELECTRON_OPEN_DEVTOOLS === '1'
      || process.env.ELECTRON_OPEN_DEVTOOLS === 'true';

    if (openDevTools) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  } else {
    await mainWindow.loadFile(AppPaths.rendererIndexPath);
  }
}

ipcMain.handle('fs:readCatalog', async () => {
  try {
    const rawData = await fs.readFile(AppPaths.catalogPath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    throw new Error('Не удалось загрузить базу данных каталога');
  }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
