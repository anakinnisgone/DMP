import type { AppData } from '../../types';
import { STORAGE_KEY } from '../../utils/constants';
import type { StorageAdapter } from './StorageAdapter';

/**
 * Mevcut backend: tarayıcı/Electron localStorage.
 *
 * Veriyi tek bir anahtar altında JSON olarak saklar. Serileştirme bu
 * adapter'ın iç detayıdır; dışarıya her zaman tipli AppData verilir.
 */
export class LocalStorageAdapter implements StorageAdapter {
  constructor(private readonly key: string = STORAGE_KEY) {}

  async load(): Promise<AppData | null> {
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as AppData) : null;
  }

  async save(data: AppData): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  async getSizeBytes(): Promise<number> {
    const raw = localStorage.getItem(this.key);
    return raw ? new Blob([raw]).size : 0;
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.key);
  }
}
