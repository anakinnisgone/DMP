// Discord Manager Panel - Electron ana süreç (CommonJS)
const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');

// electron-updater kurulu değilse (saf geliştirme) çökmesin
let updater = null;
try {
  updater = require('electron-updater');
} catch {
  updater = null;
}

const isDev = !app.isPackaged;
let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#0b0d12',
    autoHideMenuBar: true,
    show: false,
    icon: path.join(__dirname, '..', 'build', 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  // Uygulama menüsünü kaldır (tarayıcı hissi vermesin)
  Menu.setApplicationMenu(null);

  mainWindow.once('ready-to-show', () => mainWindow.show());

  // Dış bağlantılar sistem tarayıcısında açılsın, uygulama içinde değil
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http')) shell.openExternal(url);
    return { action: 'deny' };
  });

  if (isDev) {
    const devUrl = process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173';
    mainWindow.loadURL(devUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

// Tek örnek kilidi
const gotLock = app.requestSingleInstanceLock();
if (!gotLock) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });

  app.whenReady().then(() => {
    createWindow();
    setupAutoUpdate();
    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
  });

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
  });
}

// ---------------------------------------------------------------------------
// Otomatik güncelleme
// ---------------------------------------------------------------------------
function send(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function setupAutoUpdate() {
  if (isDev || !updater) return;
  const { autoUpdater } = updater;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on('update-available', (info) => {
    send('update:available', info && info.version);
  });
  autoUpdater.on('update-downloaded', (info) => {
    send('update:downloaded', info && info.version);
  });
  autoUpdater.on('error', (err) => {
    send('update:error', String(err));
  });

  // Yayın kaynağı tanımlıysa kontrol eder
  try {
    autoUpdater.checkForUpdatesAndNotify();
  } catch (err) {
    // publish ayarı yoksa sessizce geç
    if (process.env.DEBUG_UPDATES) {
      console.error('Update check error:', err);
    }
  }
}

// ---------------------------------------------------------------------------
// IPC köprüsü
// ---------------------------------------------------------------------------
ipcMain.handle('app:getVersion', () => app.getVersion());

ipcMain.handle('update:check', () => {
  if (updater && !isDev) {
    try {
      updater.autoUpdater.checkForUpdates();
    } catch {
      /* yoksay */
    }
  }
  return isDev ? 'dev' : 'ok';
});

ipcMain.handle('update:install', () => {
  if (updater && !isDev) {
    try {
      updater.autoUpdater.quitAndInstall();
    } catch {
      /* yoksay */
    }
  }
});
