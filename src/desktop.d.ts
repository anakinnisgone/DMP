// Electron preload köprüsünün (window.desktop) tip tanımı.
// Web (tarayıcı) ortamında window.desktop tanımsızdır.
export interface DesktopBridge {
  isElectron: true;
  getVersion: () => Promise<string>;
  checkForUpdates: () => Promise<string>;
  installUpdate: () => Promise<void>;
  onUpdateAvailable: (cb: (version?: string) => void) => () => void;
  onUpdateDownloaded: (cb: (version?: string) => void) => () => void;
  onUpdateError: (cb: (error?: string) => void) => () => void;
}

declare global {
  interface Window {
    desktop?: DesktopBridge;
  }
}

export {};
