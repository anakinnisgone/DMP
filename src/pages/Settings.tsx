import { useMemo, useRef, useState, type ChangeEvent } from 'react';
import {
  Settings as SettingsIcon,
  Download,
  Upload,
  RotateCcw,
  Database,
  Info,
  Palette,
} from 'lucide-react';
import { useData } from '../store/DataContext';
import { getRawSize } from '../utils/storage';
import { formatBytes } from '../utils/helpers';
import { STORAGE_KEY, DATA_VERSION, APP_NAME, APP_VERSION } from '../utils/constants';
import { PageHeader, SectionTitle } from '../components/ui/Common';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { CrestLogo } from '../components/ui/CrestLogo';
import { ThemeSelector } from '../components/ThemeSelector';
import { useToast } from '../store/ToastContext';

export function Settings() {
  const { data, exportData, importData, resetData } = useData();
  const toast = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const storage = useMemo(() => {
    const raw = getRawSize();
    return { size: formatBytes(raw), bytes: raw };
  }, []);

  const counts = {
    staff: data.staff.length,
    tasks: data.tasks.length,
    notes: data.notes.length,
    discipline: data.disciplineRecords.length,
    activities: data.activities.length,
  };

  const handleImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        importData(parsed);
      } catch {
        toast.error('İçe aktarma başarısız', 'Dosya okunamadı veya bozuk.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div>
      <PageHeader title="Ayarlar" subtitle="Veri yönetimi ve uygulama bilgisi" icon={SettingsIcon} />

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        {/* Appearance / Theme */}
        <Card padding="lg">
          <SectionTitle icon={Palette}>Görünüm</SectionTitle>
          <ThemeSelector />
        </Card>

        {/* Veri yönetimi */}
        <Card padding="lg">
          <SectionTitle icon={Database}>Veri Yönetimi</SectionTitle>
          <p className="mb-4 text-sm text-discord-muted">
            Tüm veriler tarayıcınızın LocalStorage alanında saklanır. Yedeklemek için dışa aktarın,
            geri yüklemek için içe aktarın.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" icon={Download} onClick={exportData}>
              JSON Dışa Aktar
            </Button>
            <Button variant="secondary" icon={Upload} onClick={() => fileRef.current?.click()}>
              JSON İçe Aktar
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={handleImport}
              className="hidden"
            />
          </div>

          <div className="mt-5 border-t border-discord-line pt-4">
            <p className="mb-1 text-sm font-semibold text-red-300">Tehlikeli Bölge</p>
            <p className="mb-3 text-xs text-discord-muted">
              Tüm verileri sıfırlar ve varsayılan örnek veriyi yükler. Bu işlem geri alınamaz.
            </p>
            <Button variant="danger" icon={RotateCcw} onClick={() => setConfirmReset(true)}>
              Tüm Verileri Sıfırla
            </Button>
          </div>
        </Card>

        {/* Depolama & bilgi */}
        <div className="space-y-5">
          <Card padding="lg">
            <SectionTitle icon={Database}>Depolama</SectionTitle>
            <div className="space-y-2.5">
              <Row label="Kullanılan Alan" value={storage.size} />
              <Row label="Depolama Anahtarı" value={STORAGE_KEY} mono />
              <Row label="Veri Sürümü" value={`v${DATA_VERSION}`} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2 border-t border-discord-line pt-4 text-center">
              <Metric label="Personel" value={counts.staff} />
              <Metric label="Görev" value={counts.tasks} />
              <Metric label="Not" value={counts.notes} />
              <Metric label="Disiplin" value={counts.discipline} />
              <Metric label="Aktivite" value={counts.activities} />
            </div>
          </Card>

          <Card padding="lg">
            <SectionTitle icon={Info}>Hakkında</SectionTitle>
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-discord-blurple text-white">
                <CrestLogo size={20} />
              </span>
              <div className="text-sm text-discord-muted">
                <p className="font-semibold text-discord-text">{APP_NAME} <span className="text-discord-faint">v{APP_VERSION}</span></p>
                <p className="mt-0.5">
                  Tek kullanıcılı, girişsiz, tamamen tarayıcı tabanlı bir yönetim ekibi takip
                  panelidir. React, Vite, TypeScript, TailwindCSS, Framer Motion ve Recharts ile
                  geliştirilmiştir.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <ConfirmDialog
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        onConfirm={resetData}
        title="Tüm veriler sıfırlansın mı?"
        description="Mevcut tüm veriler silinip varsayılan örnek veri yüklenecek. Bu işlem geri alınamaz."
        confirmLabel="Sıfırla"
        danger
      />
    </div>
  );
}

function Row({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-discord-muted">{label}</span>
      <span className={`text-discord-text ${mono ? 'font-mono text-xs' : 'font-medium'}`}>{value}</span>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/[0.02] py-2">
      <p className="font-display text-lg font-bold tabular-nums text-discord-text">{value}</p>
      <p className="text-[11px] text-discord-faint">{label}</p>
    </div>
  );
}
