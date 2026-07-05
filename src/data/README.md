# Veri Katmanı Mimarisi

Veri katmanı, depolama teknolojisinden bağımsız (database-agnostic) olacak
şekilde Port & Adapter (Hexagonal) desenine göre düzenlenmiştir.

```
UI (pages/components)
  └─ DataContext          → domain aksiyonları (addStaff, addTask, ...)
      └─ DataStateContext → React state + debounce'lu kalıcılık
          └─ DataRepository (servis)     ← src/data/repository/
              ├─ normalize.ts            ← domain doğrulama (backend'den bağımsız)
              └─ StorageAdapter (port)   ← src/data/storage/StorageAdapter.ts
                  └─ LocalStorageAdapter ← MEVCUT backend
                      (gelecek: SqliteAdapter, PostgresAdapter, ...)
```

## Katman sorumlulukları

| Katman | Dosya | Sorumluluk |
|---|---|---|
| Port | `storage/StorageAdapter.ts` | Async depolama sözleşmesi: `load / save / getSizeBytes / clear` |
| Adapter | `storage/LocalStorageAdapter.ts` | localStorage'a JSON yazma/okuma (serileştirme detayı burada gizli) |
| Servis | `repository/DataRepository.ts` | Normalize, tohum veri, meta damgalama, hata toleransı, import doğrulama |
| Doğrulama | `repository/normalize.ts` | Ham veriyi geçerli `AppData`'ya dönüştürme (tüm backend'ler için ortak) |
| Kompozisyon | `index.ts` | Backend seçimi — **tek satır** |

Kurallar:

- UI/store katmanı **asla** `localStorage`'a veya adapter'lara doğrudan erişmez;
  yalnızca `dataRepository` kullanılır.
- Adapter'lar doğrulama yapmaz; ham kalıcılıktan sorumludur. Bozuk veri
  `normalize` tarafından temizlenir, bu yüzden her backend aynı güvenceyi alır.
- Sözleşme Promise tabanlıdır. localStorage senkron olsa da arayüz asenkrondur;
  böylece SQLite/PostgreSQL'e geçişte çağıran kod değişmez.

Not: `ThemeContext` içindeki `localStorage` kullanımı bilinçli olarak kapsam
dışıdır — tema bir UI tercihidir, domain verisi değildir.

## SQLite'a geçiş (Electron)

1. Main process'e `better-sqlite3` ekleyin, IPC handler'ları yazın
   (`data:load`, `data:save`, `data:size`, `data:clear`).
2. Renderer'da adapter'ı yazın:

```ts
// src/data/storage/SqliteAdapter.ts
import type { AppData } from '../../types';
import type { StorageAdapter } from './StorageAdapter';

export class SqliteAdapter implements StorageAdapter {
  load(): Promise<AppData | null> {
    return window.desktop!.dbLoad(); // IPC → main process → SQLite
  }
  save(data: AppData): Promise<void> {
    return window.desktop!.dbSave(data);
  }
  getSizeBytes(): Promise<number> {
    return window.desktop!.dbSize();
  }
  clear(): Promise<void> {
    return window.desktop!.dbClear();
  }
}
```

3. `src/data/index.ts` içinde tek satırı değiştirin:

```ts
export const dataRepository = new DataRepository(new SqliteAdapter());
```

Main process tarafında `save(data)` bir transaction içinde `staff`, `tasks`,
`notes`, `discipline_records`, `activities` tablolarına upsert yapar;
`load()` tabloları okuyup `AppData` şeklinde birleştirir. Normalize renderer'da
zaten çalıştığı için SQL tarafında ekstra doğrulama gerekmez.

## PostgreSQL'e geçiş

Aynı desen; adapter IPC yerine bir API istemcisi olur (Electron main process
üzerinden `pg` veya bir REST/tRPC arka ucu). `StorageAdapter` arayüzü
değişmediği sürece UI ve store katmanı hiçbir değişiklik görmez.

## İlk veri geçişi (migration)

Yeni adapter'a geçerken eski veriyi taşımak için `index.ts` içinde tek seferlik
köprü kurulabilir:

```ts
const legacy = new LocalStorageAdapter();
const next = new SqliteAdapter();
const old = await legacy.load();
if (old && !(await next.load())) await next.save(old);
```
