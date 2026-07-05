import type { AppData } from '../../types';
import { DATA_VERSION } from '../../utils/constants';
import { nowISO } from '../../utils/helpers';
import { createSeedData } from '../seedData';
import type { StorageAdapter } from '../storage/StorageAdapter';
import { normalize } from './normalize';

/**
 * Veri erişim servisi (Repository).
 *
 * UI/store katmanı ile depolama backend'i arasındaki tek kapıdır:
 *  - okunan her veri normalize'dan geçer (bozuk veri UI'a asla ulaşmaz),
 *  - kayıt yoksa tohum veriyle başlar,
 *  - her kayıtta meta (sürüm + zaman damgası) güncellenir,
 *  - depolama hataları yutulur ve loglanır; uygulama çalışmaya devam eder.
 *
 * Hangi backend'in kullanıldığını bilmez; kurucuya verilen StorageAdapter
 * ne ise onu kullanır. Backend seçimi src/data/index.ts'tedir.
 */
export class DataRepository {
  constructor(private readonly storage: StorageAdapter) {}

  /** Veriyi yükler; kayıt yoksa tohum veriyle başlatır, bozuksa tohuma döner. */
  async load(): Promise<AppData> {
    try {
      const raw = await this.storage.load();
      if (!raw) {
        const seed = createSeedData();
        await this.save(seed);
        return seed;
      }
      return normalize(raw);
    } catch (err) {
      console.error('Veri okunamadı, örnek veriye dönülüyor:', err);
      return createSeedData();
    }
  }

  /** Meta bilgisini damgalayıp veriyi kalıcı hale getirir. */
  async save(data: AppData): Promise<void> {
    try {
      await this.storage.save({
        ...data,
        meta: { version: DATA_VERSION, lastUpdated: nowISO() },
      });
    } catch (err) {
      console.error('Veri kaydedilemedi:', err);
    }
  }

  /** Kayıtlı verinin yaklaşık boyutu (bayt). */
  async getSizeBytes(): Promise<number> {
    try {
      return await this.storage.getSizeBytes();
    } catch {
      return 0;
    }
  }

  /** Tüm kalıcı veriyi siler (kurtarma/sıfırlama senaryoları için). */
  async clear(): Promise<void> {
    try {
      await this.storage.clear();
    } catch (err) {
      console.error('Veri silinemedi:', err);
    }
  }

  /** İçe aktarılan JSON'u doğrular ve temizler; geçersizse null döner. */
  validateImport(json: unknown): AppData | null {
    if (!json || typeof json !== 'object') return null;
    const obj = json as Partial<AppData>;
    // En azından personel ya da görev dizisi bulunmalı
    if (!Array.isArray(obj.staff) && !Array.isArray(obj.tasks)) return null;
    return normalize(obj);
  }
}
