import { useEffect, useState } from 'react';
import { Download, RefreshCw, AlertCircle, X } from 'lucide-react';

type Status = 'idle' | 'available' | 'downloaded' | 'error';

/**
 * Electron otomatik güncelleme çubuğu.
 * Tarayıcı (web) ortamında window.desktop tanımsız olduğu için hiçbir şey render etmez.
 */
export function UpdateBanner() {
  const [status, setStatus] = useState<Status>('idle');
  const [version, setVersion] = useState<string | undefined>(undefined);
  const [error, setError] = useState<string | undefined>(undefined);

  useEffect(() => {
    const bridge = window.desktop;
    if (!bridge) return;

    const offA = bridge.onUpdateAvailable((v) => {
      setVersion(v);
      setStatus('available');
      setError(undefined);
    });
    const offD = bridge.onUpdateDownloaded((v) => {
      setVersion(v);
      setStatus('downloaded');
      setError(undefined);
    });
    const offE = bridge.onUpdateError?.((err) => {
      setError(err);
      setStatus('error');
    });

    return () => {
      offA?.();
      offD?.();
      offE?.();
    };
  }, []);

  if (status === 'idle') return null;

  const bgColor = status === 'error' ? 'bg-red-500/10' : 'bg-discord-blurple/10';
  const borderColor = status === 'error' ? 'border-red-500/30' : 'border-discord-line';
  const textColor = status === 'error' ? 'text-red-400' : 'text-discord-text';
  const iconColor = status === 'error' ? 'text-red-400' : 'text-discord-blurple';

  return (
    <div className={`flex items-center justify-between gap-3 border-b ${borderColor} ${bgColor} px-4 py-2 text-sm`}>
      <div className={`flex min-w-0 items-center gap-2 ${textColor}`}>
        {status === 'available' ? (
          <>
            <RefreshCw size={15} className={`shrink-0 animate-spin ${iconColor}`} />
            <span className="truncate">
              Yeni sürüm{version ? ` (v${version})` : ''} indiriliyor…
            </span>
          </>
        ) : status === 'downloaded' ? (
          <>
            <Download size={15} className={`shrink-0 ${iconColor}`} />
            <span className="truncate">
              Yeni sürüm{version ? ` (v${version})` : ''} hazır.
            </span>
          </>
        ) : (
          <>
            <AlertCircle size={15} className="shrink-0 text-red-400" />
            <span className="truncate">
              Güncelleme kontrol edilemedi{error ? `: ${error}` : '.'}
            </span>
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {status === 'downloaded' && (
          <button
            onClick={() => window.desktop?.installUpdate()}
            className="shrink-0 rounded-lg bg-discord-blurple px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-discord-blurple/90"
          >
            Güncelle
          </button>
        )}
        {status === 'error' && (
          <button
            onClick={() => setStatus('idle')}
            className="shrink-0 text-red-400 hover:text-red-300 transition-colors"
            title="Kapat"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
