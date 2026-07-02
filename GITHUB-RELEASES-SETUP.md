# GitHub Releases ile Otomatik Güncelleme Kurulumu

## 📋 Sistem Özeti

Bu proje artık **GitHub Releases** üzerinden otomatik güncelleme desteklemektedir:

- ✅ **Electron Updater** yapılandırması tamamlandı
- ✅ **Setup.exe** ve **Portable sürüm** başarılı şekilde build edilebiliyor
- ✅ **electron-builder.yml** GitHub entegrasyonu ayarlandı
- ✅ **UpdateBanner** komponenti kullanıcı arayüzünde yer aldı

## 🚀 Güncelleme Nasıl Çalışır?

1. **Uygulama açıldığında** arka planda GitHub Releases kontrol edilir
2. **Yeni sürüm varsa** kullanıcıya bildirim gösterilir
3. **Kullanıcı "Güncelle" butonuna tıklarsa** indirme başlar
4. **İndirme tamamlandıktan sonra** uygulama kapatılıp yeni sürümle açılır

## ⚙️ GitHub Releases Publish Ayarları

`package.json` ve `electron-builder.yml` dosyalarında GitHub kurulum tamamlanmıştır:

```yaml
publish:
  provider: github
  owner: anakinnisgone
  repo: DMP
  releaseType: release
```

## 🔑 Yayınlama (Publish) için Gerekli Adımlar

### 1. GitHub Personal Access Token Oluştur
- GitHub Settings → Developer settings → Personal access tokens
- **Token oluştur** (Classic seç)
- İzinler: `repo` (full control of repositories)
- Token'ı kopyala ve güvenli bir yere kaydet

### 2. Environment Variable Ayarla
Terminal'de yayınlamadan önce token'ı ortam değişkeni olarak set et:

**Windows (PowerShell):**
```powershell
$env:GH_TOKEN = "your_github_token_here"
npm run electron:build
```

**Windows (CMD):**
```cmd
set GH_TOKEN=your_github_token_here
npm run electron:build
```

**Linux/Mac:**
```bash
export GH_TOKEN=your_github_token_here
npm run electron:build
```

### 3. Sürüm Numarasını Güncelle
1. `package.json` içinde versiyon numarasını artır:
   ```json
   "version": "0.9.0"
   ```

2. Git commit ve push yap:
   ```bash
   git add package.json
   git commit -m "Release v0.9.0"
   git push origin main
   ```

3. GitHub'da Release oluştur:
   - Releases → Draft a new release
   - Tag: `v0.9.0` (sürüm numarası ile eşleş)
   - Title: `v0.9.0`
   - Release type: Release (Pre-release değil)
   - Publish

### 4. Build ve Publish Yap
```bash
npm run electron:build
```

Build işlemi bittiğinde electron-builder otomatik olarak:
- Release'deki dosyaları indirir
- Setup.exe ve Portable exe'yi yükler
- latest.yml dosyasını günceller

## 📝 Versiyon Numaralandırması

**Semantic Versioning** kullanıyoruz: `MAJOR.MINOR.PATCH`

- **MAJOR** (0.8 → 1.0): Büyük özellik değişiklikleri
- **MINOR** (0.8 → 0.9): Yeni özellikler
- **PATCH** (0.8.0 → 0.8.1): Bug fixleri

**Örnek sürüm geçişi:**
- v0.8.0 (stabil başlangıç)
- v0.8.1 (hata düzeltmesi)
- v0.9.0 (yeni özellik)
- v1.0.0 (ilk stabil sürüm)

## 🔍 Sorun Giderme

### Build başarısız oldu
- `rm -rf dist release` (build klasörlerini temizle)
- `npm install` (bağımlılıkları yeniden kur)
- `npm run electron:build` (tekrar dene)

### Güncelleme kontrol edilmiyor (Geliştirme modunda)
- Geliştirme sürümünde (`npm run electron:dev`) güncelleme kontrol edilmez
- Test için `npm run electron:preview` veya release build'i kur

### GitHub token hatası
```
Error: GITHUB_TOKEN is not set
```
Çözüm: GH_TOKEN ortam değişkenini kontrol et ve doğru token'ı kullan

## 📦 Build Yapısı

```
release/
├── Discord Manager Panel Setup 0.8.0.exe     (Setup installer)
├── DiscordManagerPanel-0.8.0-portable.exe    (Portable version)
├── latest.yml                                 (Update manifest)
└── win-unpacked/                             (Unpacked application)
```

## ✨ Kullanıcı Deneyimi

### Güncelleme Bildirimi
Uygulama açılınca üst kısımda şöyle bir bar görünür:

```
⟳ Yeni sürüm (v0.9.0) indiriliyor…
```

### İndirme Tamamlandı
İndirme bitince:

```
⬇ Yeni sürüm (v0.9.0) hazır.  [Güncelle] (mavi buton)
```

Kullanıcı "Güncelle" butonuna tıklarsa:
- Uygulama kapatılır
- Kurulum yapılır
- Yeni sürüm açılır

## 🔐 Güvenlik Notları

1. **Token'ı asla repoya commit etme**
   - `.env` dosyası `.gitignore`'da olmalı
   - Yalnızca CI/CD ortamında set et

2. **Release'leri verify et**
   - Publish etmeden her zaman teste tabi tut
   - GitHub'da manual test alanında release'i kontrol et

3. **Geri alma**
   - Hatalı release'i silmek için GitHub'da Delete seçeneğini kullan
   - Eski sürümler güncelleme kontrolünde görünmemeye başlayacak

## 🎯 Sonraki Adımlar

1. **CI/CD Kurulumu** (isteğe bağlı)
   - GitHub Actions ile otomatik build/publish

2. **Signed Release** (güvenlik için)
   - Code signing ile exe dosyalarını imzala

3. **Auto-Update Testi**
   - Release yayınladıktan sonra, kullanıcılar test sürümünü kur
   - Güncelleme kontrolünün çalışıp çalışmadığını doğrula

---

**Son güncelleme:** 02 Temmuz 2026
