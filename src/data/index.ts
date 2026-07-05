import { DataRepository } from './repository/DataRepository';
import { LocalStorageAdapter } from './storage/LocalStorageAdapter';

/**
 * Kompozisyon kökü: kullanılan depolama backend'i YALNIZCA burada seçilir.
 *
 * SQLite/PostgreSQL'e geçiş: StorageAdapter arayüzünü uygulayan yeni bir
 * adapter yazın (bkz. src/data/README.md) ve aşağıdaki satırda
 * LocalStorageAdapter yerine onu verin. Uygulamanın başka hiçbir yeri değişmez.
 */
export const dataRepository = new DataRepository(new LocalStorageAdapter());

export type { StorageAdapter } from './storage/StorageAdapter';
export { DataRepository } from './repository/DataRepository';
