// Discord Manager Panel - güvenli preload köprüsü (contextIsolation açık)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  isElectron: true,
  getVersion: () => ipcRenderer.invoke('app:getVersion'),
  checkForUpdates: () => ipcRenderer.invoke('update:check'),
  installUpdate: () => ipcRenderer.invoke('update:install'),
  onUpdateAvailable: (cb) => {
    const listener = (_e, version) => cb(version);
    ipcRenderer.on('update:available', listener);
    return () => ipcRenderer.removeListener('update:available', listener);
  },
  onUpdateDownloading: (cb) => {
    const listener = (_e, version) => cb(version);
    ipcRenderer.on('update:downloading', listener);
    return () => ipcRenderer.removeListener('update:downloading', listener);
  },
  onUpdateDownloaded: (cb) => {
    const listener = (_e, version) => cb(version);
    ipcRenderer.on('update:downloaded', listener);
    return () => ipcRenderer.removeListener('update:downloaded', listener);
  },
  onUpdateError: (cb) => {
    const listener = (_e, error) => cb(error);
    ipcRenderer.on('update:error', listener);
    return () => ipcRenderer.removeListener('update:error', listener);
  },
  onPreparingUpdate: (cb) => {
    const listener = () => cb();
    ipcRenderer.on('app:preparing-update', listener);
    return () => ipcRenderer.removeListener('app:preparing-update', listener);
  },
});
