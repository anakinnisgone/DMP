# 🎮 Discord Yönetim Paneli

Discord sunucusu yönetim ekibini (staff) takip etmek için tasarlanmış, **tek kullanıcılı**, **girişsiz** ve **tamamen tarayıcı tabanlı** profesyonel bir yönetim panelidir. Tüm veriler tarayıcının `localStorage` alanında saklanır — sunucu, veritabanı veya kurulum gerektirmez.

![Teknoloji](https://img.shields.io/badge/React-18-61dafb) ![Vite](https://img.shields.io/badge/Vite-5-646cff) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6) ![Tailwind](https://img.shields.io/badge/Tailwind-3-38bdf8)

---

## ✨ Özellikler

- **📊 Kontrol Paneli** — Ekip geneli istatistikler, son aktiviteler, terfi adayları, yaklaşan teslimler ve son kayıtlar.
- **👥 Personel Yönetimi** — 3 rol (Leader Staff, Quality Assistant, ProStaff) ve ProStaff için iki gelişim yolu (Leader / QA adaylığı). Filtreleme, arama, kart görünümü.
- **📄 Personel Detayı** — Performans skorları, görev grupları, notlar, geri bildirimler, disiplin geçmişi ve eğitim ilerlemesi; tümü tek ekrandan düzenlenebilir.
- **✅ Görev Yönetimi** — Liste **ve** Kanban (sürükle-bırak) görünümü, 4 kolon (Bekliyor → Devam Ediyor → İnceleniyor → Tamamlandı), öncelik/durum/personel filtreleri, sabitleme.
- **🎓 Eğitim** — Personel bazlı eğitim modülleri ve tek tıkla tamamlama takibi.
- **📈 Performans** — Recharts grafikleri (performans skorları, kriter ortalamaları) ve üç sıralama panosu (En Başarılı / En Çok Tamamlayan / Gelişmesi Gerekenler).
- **🏆 Terfi & Disiplin** — Terfi adaylık panosu (Hazır / Yakından Takip / Hazır Değil) ve disiplin kayıt tablosu.
- **🗓️ Takvim** — Görev teslim tarihlerinin aylık görünümü, durum renk kodlaması.
- **⚙️ Ayarlar** — JSON dışa/içe aktarma, verileri sıfırlama, depolama bilgisi.

Ek olarak: akıcı **Framer Motion** animasyonları, toast bildirimleri, tamamen **Türkçe** arayüz ve koyu Discord temalı tasarım.

---

## 🚀 Kurulum ve Çalıştırma

Gereksinim: **Node.js 18+** ve npm.

```bash
# 1) Bağımlılıkları yükle
npm install

# 2) Geliştirme sunucusunu başlat (http://localhost:5173 otomatik açılır)
npm run dev

# 3) Üretim derlemesi
npm run build

# 4) Derlemeyi önizle
npm run preview
```

İlk açılışta panel, örnek bir ekip (12 personel, görevler, notlar, disiplin kayıtları vb.) ile otomatik doldurulur. Bu veriyi **Ayarlar → Tüm Verileri Sıfırla** ile istediğiniz zaman geri yükleyebilirsiniz.

---

## 🧱 Teknoloji Yığını

| Katman | Teknoloji |
|--------|-----------|
| Çatı | React 18 + TypeScript |
| Derleme | Vite 5 |
| Stil | TailwindCSS 3 (özel Discord paleti) |
| Animasyon | Framer Motion 11 |
| İkonlar | Lucide React |
| Grafikler | Recharts 2 |
| Yönlendirme | React Router 6 |
| Depolama | Tarayıcı `localStorage` |

---

## 📁 Proje Yapısı

```
src/
├── components/
│   ├── ui/         # Card, Button, Badge, Modal, Avatar, ProgressBar, StatCard ...
│   ├── staff/      # StaffCard, StaffFormModal
│   └── tasks/      # TaskCard, KanbanBoard, TaskListView, TaskFormModal
├── data/           # seedData (örnek başlangıç verisi)
├── hooks/          # yardımcı hook'lar
├── layouts/        # MainLayout, Sidebar
├── pages/          # 9 sayfa (Dashboard, Staff, Tasks, Training, Performance ...)
├── store/          # DataContext (CRUD), ToastContext
├── types/          # TypeScript tip tanımları
└── utils/          # constants, helpers, storage
```

---

## 🎨 Tasarım Kararı: Rol Renkleri

Kadro spesifikasyonunda hem **Leader Staff** hem de **Quality Assistant** kırmızı tonu olarak tanımlanmıştır. İki rolün panoda birbirinden **görsel olarak ayırt edilebilmesi** için:

- 👑 **Leader Staff** → `red` (kırmızı, `red-500`)
- ⭐ **Quality Assistant** → `rose` (gül kırmızısı, `rose-500`)
- 🌱 **ProStaff** → `blue` (mavi, `blue-500`)

Bu ince ton farkı yalnızca UX amaçlıdır; her iki rol de kırmızı ailesinde kalır.

---

## 💾 Veri ve Gizlilik

- Tüm veriler **yalnızca sizin tarayıcınızda** (`localStorage`, anahtar: `dsp.data.v1`) tutulur.
- Hiçbir veri sunucuya gönderilmez; internet bağlantısı gerekmez (fontlar hariç).
- **Ayarlar** sayfasından verilerinizi JSON olarak dışa aktarıp yedekleyebilir, başka bir tarayıcıda içe aktarabilirsiniz.
- Tarayıcı verilerini temizlerseniz panel verileri de silinir — düzenli yedek almanız önerilir.

---

## 📝 Notlar

- Bu bir **tek kullanıcılı** araçtır; kimlik doğrulama veya çok kullanıcılı senkronizasyon içermez.
- Görev teslim tarihi renkleri: 🔴 geciken · 🟠 yaklaşan · 🔵 ileri tarih · 🟢 tamamlandı.
- Kanban sürükle-bırak yerel HTML5 Drag & Drop ile uygulanmıştır (ek bağımlılık yoktur).

Keyifli kullanımlar! 🚀
