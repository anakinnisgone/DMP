import type { AppData } from '../../types';

/**
 * Kalıcı depolama sözleşmesi (port).
 *
 * Uygulamanın geri kalanı depolama teknolojisini bilmez; yalnızca bu arayüzle
 * konuşur. Yeni bir backend (SQLite, PostgreSQL, dosya, REST API...) eklemek
 * için bu arayüzü uygulayan bir adapter yazmak ve src/data/index.ts içindeki
 * kurulum satırını değiştirmek yeterlidir. UI veya store katmanına dokunulmaz.
 *
 * Tüm metotlar Promise döner: localStorage senkron çalışsa da SQLite/PostgreSQL
 * gibi backend'ler asenkrondur; sözleşme en kısıtlayıcı duruma göre tanımlanır.
 *
 * Adapter'lar ham kalıcılıktan sorumludur; doğrulama, tohum veri ve meta
 * damgalama DataRepository'nin işidir. Bir SQL adapter'ı load/save içinde
 * AppData'yı tablolara eşler (ör. staff, tasks, notes tabloları).
 */
export interface StorageAdapter {
  /** Kayıtlı veriyi getirir; hiç kayıt yoksa null döner. */
  load(): Promise<AppData | null>;

  /** Verinin tamamını kalıcı olarak yazar (unit-of-work: tek atomik anlık görüntü). */
  save(data: AppData): Promise<void>;

  /** Kayıtlı verinin yaklaşık boyutu, bayt cinsinden. */
  getSizeBytes(): Promise<number>;

  /** Tüm kayıtlı veriyi siler. */
  clear(): Promise<void>;
}
