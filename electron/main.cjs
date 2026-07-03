// Discord Manager Panel - Electron ana süreç (CommonJS)
const { app, BrowserWindow, ipcMain, shell, Menu } = require('electron');
const path = require('path');
const fs = require('fs');
const os = require('os');

// IMMEDIATE: Write to a file we control - use appData/DEBUG.log
const appDataDebugLog = path.join(process.env.APPDATA || os.homedir(), 'discord-yonetim-paneli', 'DEBUG.log');

function debugLog(...args) {
  const msg = args.map(a => typeof a === 'string' ? a : JSON.stringify(a)).join(' ');
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${msg}`;

  // Write to debug log
  try {
    fs.appendFileSync(appDataDebugLog, logLine + '\n');
  } catch (e) {
    // Fail silently
  }

  // Always log to console
  console.log(msg);
}

// Log startup IMMEDIATELY - this is the first line we can control
debugLog('='.repeat(80));
debugLog('MAIN.CJS LOADED - Electron Main Process Starting');
debugLog(`Debug Log File: ${appDataDebugLog}`);
debugLog('='.repeat(80));

// Try to use electron-log too
let log = null;
try {
  log = require('electron-log');
  log.transports.file.level = 'debug';
  log.transports.console.level = 'debug';
} catch (e) {
  debugLog('electron-log not available:', e.message);
}

// electron-updater kurulu değilse (saf geliştirme) çökmesin
let updater = null;
try {
  updater = require('electron-updater');
} catch {
  updater = null;
}

const isDev = !app.isPackaged;
let mainWindow = null;

// Early console log (before debug log is ready)
console.log('='.repeat(80));
console.log('Discord Manager Panel - Electron Main Process Starting');
console.log('='.repeat(80));

function getIconPath() {
  if (isDev) {
    return path.join(__dirname, '..', 'build', 'icon.ico');
  } else {
    return path.join(process.resourcesPath, 'build', 'icon.ico');
  }
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 960,
    minHeight: 600,
    backgroundColor: '#0b0d12',
    autoHideMenuBar: true,
    show: false,
    icon: getIconPath(),
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
    // Log after app is ready and debug log is initialized
    debugLog('');
    debugLog('='.repeat(80));
    debugLog('Discord Manager Panel - Electron Main Process Ready');
    debugLog('='.repeat(80));
    debugLog(`App Version: ${app.getVersion()}`);
    debugLog(`App Packaged (Production): ${app.isPackaged}`);
    debugLog(`isDev: ${isDev}`);
    debugLog(`Updater Available: ${updater ? 'YES' : 'NO'}`);
    debugLog(`App Path: ${app.getAppPath()}`);
    debugLog(`User Data Path: ${app.getPath('userData')}`);
    debugLog('='.repeat(80));

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
// Otomatik güncelleme - DEBUG MODE
// ---------------------------------------------------------------------------
function send(channel, payload) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send(channel, payload);
  }
}

function setupAutoUpdate() {
  debugLog('');
  debugLog('='.repeat(80));
  debugLog('SETUP AUTO UPDATE - INITIALIZATION');
  debugLog('='.repeat(80));

  debugLog(`isDev: ${isDev}`);
  debugLog(`updater: ${updater ? 'LOADED' : 'NOT LOADED'}`);

  if (isDev) {
    debugLog('⚠️  Development mode - Auto update DISABLED');
    return;
  }

  if (!updater) {
    debugLog('❌ electron-updater module NOT available');
    return;
  }

  const { autoUpdater } = updater;
  debugLog('✅ electron-updater loaded successfully');

  // DEBUG: Log configuration before setting options
  debugLog('');
  debugLog('--- Checking updater configuration ---');

  // Read build config & setup update provider
  try {
    const packageJson = require(path.join(app.getAppPath(), 'package.json'));
    debugLog(`Package name: ${packageJson.name}`);
    debugLog(`Package version: ${packageJson.version}`);

    let publishConfig = null;

    if (packageJson.build && packageJson.build.publish) {
      debugLog('Publish config found in package.json:');
      publishConfig = packageJson.build.publish;
      publishConfig.forEach((pub, idx) => {
        debugLog(`  [${idx}] Provider: ${pub.provider}`);
        if (pub.provider === 'github') {
          debugLog(`      Owner: ${pub.owner}`);
          debugLog(`      Repo: ${pub.repo}`);
          debugLog(`      Release Type: ${pub.releaseType}`);
        }
      });
    } else {
      debugLog('⚠️ No publish config in package.json - using hardcoded config');
      publishConfig = [{
        provider: 'github',
        owner: 'anakinnisgone',
        repo: 'DMP',
        releaseType: 'release'
      }];
      debugLog('Hardcoded config applied:');
      debugLog('  Provider: github');
      debugLog('  Owner: anakinnisgone');
      debugLog('  Repo: DMP');
      debugLog('  Release Type: release');
    }

    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'anakinnisgone',
      repo: 'DMP',
      releaseType: 'release'
    });

  } catch (err) {
    debugLog(`Error reading package.json: ${err.message}`);
    debugLog('Applying hardcoded GitHub config fallback');
    autoUpdater.setFeedURL({
      provider: 'github',
      owner: 'anakinnisgone',
      repo: 'DMP',
      releaseType: 'release'
    });
  }

  // DEBUG: Check autoUpdater properties
  debugLog('');
  debugLog('--- AutoUpdater current state ---');
  debugLog(`currentVersion: ${autoUpdater.currentVersion}`);
  debugLog(`allowDowngrade: ${autoUpdater.allowDowngrade}`);
  debugLog(`allowPrerelease: ${autoUpdater.allowPrerelease}`);

  // Set options
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;
  debugLog(`autoDownload: ${autoUpdater.autoDownload}`);
  debugLog(`autoInstallOnAppQuit: ${autoUpdater.autoInstallOnAppQuit}`);

  // Register all event listeners BEFORE checking
  debugLog('');
  debugLog('--- Registering event listeners ---');

  autoUpdater.on('checking-for-update', () => {
    debugLog('🔍 EVENT: checking-for-update');
  });

  autoUpdater.on('update-available', (info) => {
    debugLog('✅ EVENT: update-available');
    debugLog(`   Version: ${info.version}`);
    debugLog(`   Release Date: ${info.releaseDate}`);
    debugLog(`   Release Notes: ${info.releaseNotes ? info.releaseNotes.substring(0, 100) + '...' : 'N/A'}`);
    send('update:available', info && info.version);
  });

  autoUpdater.on('update-not-available', (info) => {
    debugLog('⚠️  EVENT: update-not-available');
    debugLog(`   Current version: ${info.version}`);
  });

  autoUpdater.on('download-progress', (progress) => {
    debugLog(`📥 EVENT: download-progress (${progress.percent.toFixed(1)}%)`);
    send('update:downloading', null);
  });

  autoUpdater.on('update-downloaded', (info) => {
    debugLog('✅ EVENT: update-downloaded');
    debugLog(`   Version: ${info.version}`);
    send('update:downloaded', info && info.version);
  });

  autoUpdater.on('error', (err) => {
    debugLog(`❌ EVENT: error`);
    debugLog(`   Message: ${err.message}`);
    debugLog(`   Stack: ${err.stack}`);
    send('update:error', String(err));
  });

  autoUpdater.on('before-quit-for-update', () => {
    debugLog('🛑 EVENT: before-quit-for-update');
  });

  // Now trigger check
  debugLog('');
  debugLog('='.repeat(80));
  debugLog('CALLING: autoUpdater.checkForUpdatesAndNotify()');
  debugLog('='.repeat(80));

  try {
    const checkPromise = autoUpdater.checkForUpdatesAndNotify();

    checkPromise
      .then(result => {
        debugLog('✅ checkForUpdatesAndNotify RESOLVED');
        if (result) {
          debugLog(`   Update found: ${result.updateInfo ? result.updateInfo.version : 'unknown'}`);
        } else {
          debugLog('   No update available');
        }
      })
      .catch(err => {
        debugLog('❌ checkForUpdatesAndNotify REJECTED');
        debugLog(`   Error: ${err.message}`);
        debugLog(`   Stack: ${err.stack}`);
      });

  } catch (err) {
    debugLog('❌ Exception in checkForUpdatesAndNotify:');
    debugLog(`   Message: ${err.message}`);
    debugLog(`   Stack: ${err.stack}`);
  }
}

// ---------------------------------------------------------------------------
// IPC köprüsü - DEBUG MODE
// ---------------------------------------------------------------------------
ipcMain.handle('app:getVersion', () => {
  const version = app.getVersion();
  debugLog(`IPC: app:getVersion → ${version}`);
  return version;
});

ipcMain.handle('update:check', () => {
  debugLog('');
  debugLog('='.repeat(80));
  debugLog('IPC HANDLER: update:check (Manual check triggered from UI)');
  debugLog('='.repeat(80));

  if (!updater) {
    debugLog('❌ updater not available');
    return 'no-updater';
  }

  if (isDev) {
    debugLog('⚠️  Development mode - skipping update check');
    return 'dev';
  }

  try {
    debugLog('Calling: autoUpdater.checkForUpdates()');
    const checkPromise = updater.autoUpdater.checkForUpdates();

    checkPromise
      .then(result => {
        debugLog('✅ checkForUpdates RESOLVED');
        if (result && result.updateInfo) {
          debugLog(`   Available version: ${result.updateInfo.version}`);
        }
      })
      .catch(err => {
        debugLog('❌ checkForUpdates REJECTED');
        debugLog(`   Error: ${err.message}`);
      });

    return 'checking';
  } catch (err) {
    debugLog('❌ Exception in update:check handler');
    debugLog(`   Error: ${err.message}`);
    return 'error';
  }
});

ipcMain.handle('update:install', async () => {
  debugLog('');
  debugLog('='.repeat(80));
  debugLog('IPC HANDLER: update:install');
  debugLog('='.repeat(80));

  if (!updater) {
    debugLog('❌ updater not available');
    return 'no-updater';
  }

  if (isDev) {
    debugLog('⚠️  Development mode - skipping install');
    return 'dev';
  }

  try {
    debugLog('Sending: app:preparing-update event to renderer');
    if (mainWindow && !mainWindow.isDestroyed()) {
      mainWindow.webContents.send('app:preparing-update');
    }

    debugLog('Calling: autoUpdater.quitAndInstall()');
    updater.autoUpdater.quitAndInstall();
    return 'installing';
  } catch (err) {
    debugLog('❌ Exception in update:install handler');
    debugLog(`   Error: ${err.message}`);
    debugLog(`   Stack: ${err.stack}`);
    return 'error';
  }
});
