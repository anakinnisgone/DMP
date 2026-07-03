# Discord Manager Panel — Masaüstü (Electron) Rehberi

Bu proje hem **web** hem de **Windows masaüstü** uygulaması olarak çalışır. Aynı React + Vite kod tabanı kullanılır.

## Gereksinimler
- Node.js 18+ ve npm
- İnternet (yalnızca ilk `npm install` ve `.exe` derlemesi için; uygulamanın kendisi çevrimdışı çalışır)

## 1) Kurulum
```bash
npm install
```

## 2) Web sürümü (tarayıcı)
```bash
npm run dev      # geliştirme (http://localhost:5173)
npm run build    # üretim derlemesi -> dist/
npm run preview  # üretim önizleme
```

## 3) Masaüstü — geliştirme
Vite dev sunucusunu ve Electron penceresini birlikte başlatır (tarayıcı açılmaz):
```bash
npm run electron:dev
```

## 4) Masaüstü — kurulabilir .exe üretmek
```bash
npm run electron:build
```
Çıktılar `release/` klasöründe oluşur:
- `Discord Manager Panel Setup <sürüm>.exe` — NSIS kurulum sihirbazı (asistanlı; kurulum dizini seçilebilir, masaüstü/başlat menüsü kısayolu ekler)
- `DiscordManagerPanel-<sürüm>-portable.exe` — kurulum gerektirmeyen taşınabilir sürüm

> Not: `.exe` derlemesi yalnızca **Windows** üzerinde (veya uygun çapraz derleme ortamında) çalıştırılmalıdır. `electron-builder` ilk çalıştırmada gerekli Windows araçlarını indirir (internet gerekir).

### Tema sistemi (v0.8.4+)
Uygulama içinde **Ayarlar > Görünüm** bölümünden 3 profesyonel tema arasında geçiş yapabilirsiniz:
- **🌞 Light:** Profesyonel beyaz arka plan, siyah yazı (gündüz kullanımı)
- **🌙 Dark:** Modern koyu gri arka plan, beyaz yazı (Discord stili)
- **🌌 Midnight:** Premium koyu lacivert arka plan, yüksek kontrast (varsayılan)

Seçilen tema otomatik olarak kaydedilir ve uygulama yeniden başlatıldığında geri yüklenir. Tema geçişi sayfayı yeniden yüklemeden anında (300ms) gerçekleşir.

### NSIS kurulum sihirbazı — kararlı yapılandırma (UAC sonrası boş pencere düzeltmesi)
**Belirti:** Portable `.exe` sorunsuz çalışırken, `Setup.exe` UAC onayından sonra hiçbir pencere göstermiyordu.

**Kök neden:** Önceki yapılandırma `perMachine: false` (per-user) + asistanlı kurulum + varsayılan `allowElevation: true` idi. Windows, "Setup" adlı kurucuyu otomatik yükseltmeye çalışıyor; per-user kurucu yükseltilmiş (elevated) bağlamda kendini yeniden başlatırken NSIS arayüzü başlatılamıyor ve pencere hiç görünmüyordu.

**Çözüm (uygulandı):** `package.json > build.nsis` kararlı, per-user ve elevation'sız ayarlara çevrildi:
```json
"nsis": {
  "oneClick": false,
  "perMachine": false,
  "allowElevation": false,
  "allowToChangeInstallationDirectory": true,
  "createDesktopShortcut": true,
  "createStartMenuShortcut": true,
  "runAfterFinish": true
}
```
Bu ayarla kurucu asInvoker (yükseltmesiz) çalışır: **UAC hiç çıkmaz**, sihirbaz anında açılır, uygulama kullanıcı profiline (`%LOCALAPPDATA%`) kurulur. Bu model otomatik güncelleme için de idealdir — güncellemeler yönetici izni gerektirmez.

**Derleme sonrası doğrulama:** Yeniden derledikten sonra `release/builder-effective-config.yaml` içinde şunları görmelisiniz:
```yaml
nsis:
  oneClick: false
  perMachine: false
  allowElevation: false
  allowToChangeInstallationDirectory: true
```
`release/builder-debug.yml` de nihai NSIS betiği için aynı değerleri yansıtır. Kurulumu Windows 10/11'de çalıştırdığınızda **UAC istemi gelmemeli** ve sihirbaz doğrudan açılmalıdır.

**Alternatif — tüm kullanıcılar için kurulum (Program Files):** Kurumsal/çok kullanıcılı senaryoda tüm makineye kurmak isterseniz aşağıdaki ayarı kullanın. Bu durumda tek bir UAC istemi çıkar (manifest tabanlı, deterministik elevation) ve sihirbaz yine düzgün açılır; ancak her güncelleme yönetici izni ister:
```json
"nsis": { "oneClick": false, "perMachine": true, "allowToChangeInstallationDirectory": true }
```


## 5) Uygulama ikonu
`build/icon.ico` içinde hazır gelir. Değiştirmek isterseniz aynı yola kendi `.ico` dosyanızı koyun (256×256 önerilir).

## 6) Otomatik güncelleme
`electron-updater` entegre edilmiştir. Uygulama açılışta yeni sürüm kontrolü yapar; yeni sürüm indirildiğinde arayüzde üstte **"Güncelle"** çubuğu belirir ve tek tıkla kurar.

Etkinleştirmek için `package.json > build.publish` alanını kendi yayın kaynağınıza yönlendirin. İki yaygın seçenek:

**A) GitHub Releases**
```json
"publish": [
  { "provider": "github", "owner": "KULLANICI_ADI", "repo": "DEPO_ADI" }
]
```
Ardından `electron-builder` ile derleyip release'e `.exe` + `latest.yml` dosyalarını yükleyin.

**B) Genel (kendi sunucunuz)**
```json
"publish": [
  { "provider": "generic", "url": "https://sunucunuz.com/updates/" }
]
```
`release/` klasöründeki `.exe` ve `latest.yml` dosyalarını bu adrese koyun. Yeni sürümde `package.json > version` değerini yükseltip yeniden derleyin; istemciler farkı otomatik algılar.

> Varsayılan `publish.url` bir yer tutucudur (example.com). Gerçek bir kaynak tanımlanana kadar güncelleme kontrolü sessizce başarısız olur ve uygulama normal çalışmaya devam eder.

## 7) Veri saklama
Veriler tarayıcı/Electron `localStorage` katmanında tutulur ve masaüstünde uygulamanın **userData** klasöründe kalıcı olarak saklanır (çevrimdışı çalışır, yeniden başlatmada kaybolmaz). Ek güvenlik için **Ayarlar > Verileri Dışa Aktar** ile JSON yedeği alabilir, **İçe Aktar** ile geri yükleyebilirsiniz.

## Sürüm yönetimi
Uygulama adı ve sürümü tek merkezden yönetilir: `src/utils/constants.ts` içindeki `APP_NAME` ve `APP_VERSION`. `.exe` sürüm etiketi ise `package.json > version` alanından gelir. Yeni sürümde ikisini de güncelleyin.
