interface UpdateProgress {
  percent: number;
  transferred: number;
  total: number;
  bytesPerSecond: number;
}

// Electron preload köprüsünün (window.desktop) tip tanımı.
// Web (tarayıcı) ortamında window.desktop tanımsızdır.
export interface DesktopBridge {
  isElectron: true;
  getVersion: () => Promise<string>;
  checkForUpdates: () => Promise<string>;
  installUpdate: () => Promise<string>;
  onUpdateAvailable: (cb: (version?: string) => void) => () => void;
  onUpdateDownloading: (cb: (data?: UpdateProgress) => void) => () => void;
  onUpdateDownloaded: (cb: (version?: string) => void) => () => void;
  onUpdateError: (cb: (error?: string) => void) => () => void;
  onPreparingUpdate: (cb: () => void) => () => void;
}

declare global {
  interface Window {
    desktop?: DesktopBridge;
  }
}

export {};
