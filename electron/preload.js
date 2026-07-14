const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  readCatalog: () => ipcRenderer.invoke('fs:readCatalog'),
});
