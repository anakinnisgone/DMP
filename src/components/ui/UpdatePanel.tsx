import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RefreshCw, CheckCircle2, Download, AlertCircle, X, Zap } from 'lucide-react';

type UpdateStatus = 'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error';

interface UpdateState {
  status: UpdateStatus;
  version?: string;
  error?: string;
  progress?: number;
  transferred?: number;
  total?: number;
  speed?: number;
}

/**
 * Modern Update Panel für Discord Manager Panel
 * Crest-Logo und Mor-Schwarz (#5865f2) Markenidentität
 * Vier Zustände: Kontrol → Verfügbar → Herunterladen → Heruntergeladen
 */
export function UpdatePanel() {
  const [state, setState] = useState<UpdateState>({ status: 'idle' });
  const [isVisible, setIsVisible] = useState(false);
  const [dismissTime, setDismissTime] = useState<number | null>(null);

  useEffect(() => {
    const bridge = window.desktop;
    if (!bridge) return;

    // Auto-dismiss errors after 8 seconds
    if (state.status === 'error' && !dismissTime) {
      setDismissTime(Date.now());
      const timer = setTimeout(() => {
        setIsVisible(false);
        setState({ status: 'idle' });
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [state.status, dismissTime]);

  useEffect(() => {
    const bridge = window.desktop;
    if (!bridge) return;

    // Do not show checking state on first load - only when explicitly checking
    // setIsVisible(false);
    // setState({ status: 'idle' });

    const offAvailable = bridge.onUpdateAvailable((v) => {
      setState({ status: 'available', version: v });
      setIsVisible(true);
    });

    const offDownloading = bridge.onUpdateDownloading?.((data) => {
      setState({
        status: 'downloading',
        progress: data?.percent ?? 0,
        transferred: data?.transferred,
        total: data?.total,
        speed: data?.bytesPerSecond,
      });
      setIsVisible(true);
    });

    const offDownloaded = bridge.onUpdateDownloaded((v) => {
      setState({ status: 'downloaded', version: v });
      setIsVisible(true);
    });

    const offError = bridge.onUpdateError?.((err) => {
      setState({ status: 'error', error: err });
      setIsVisible(true);
    });

    const offPreparing = bridge.onPreparingUpdate?.(() => {
      // Uygulama kapanmak üzere - kurulum başlayacak
      if (process.env.NODE_ENV === 'development') {
        console.log('[UpdatePanel] App preparing to install update and restart');
      }
    });

    return () => {
      offAvailable?.();
      offDownloading?.();
      offDownloaded?.();
      offError?.();
      offPreparing?.();
    };
  }, []);

  if (state.status === 'idle') return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 pointer-events-none flex flex-col items-center justify-start pt-4 px-4"
        >
          {/* Panel Container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
            className="w-full max-w-md pointer-events-auto"
          >
            {/* Modern Windows 11 style card */}
            <div className="overflow-hidden rounded-2xl backdrop-blur-xl bg-discord-surface/80 border border-white/10 shadow-2xl">
              {/* Header with Crest Logo */}
              <div className="flex items-start gap-4 p-5">
                {/* Logo & Icon Container */}
                <div className="flex-shrink-0">
                  <motion.div
                    key={state.status}
                    initial={{ scale: 0, rotate: -180, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 180, opacity: 0 }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 300 }}
                    className="relative w-10 h-10"
                  >
                    {/* Background circle */}
                    <div className="absolute inset-0 rounded-full bg-discord-blurple/10 border border-discord-blurple/30" />

                    {/* Icon with animation */}
                    <div className="absolute inset-0 flex items-center justify-center text-discord-blurple">
                      {state.status === 'checking' && (
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
                          <RefreshCw size={20} />
                        </motion.div>
                      )}
                      {state.status === 'available' && (
                        <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                          <Zap size={20} className="text-amber-500" />
                        </motion.div>
                      )}
                      {state.status === 'downloading' && (
                        <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                          <Download size={20} className="text-sky-500" />
                        </motion.div>
                      )}
                      {state.status === 'downloaded' && (
                        <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                          <CheckCircle2 size={20} className="text-emerald-500" />
                        </motion.div>
                      )}
                      {state.status === 'error' && (
                        <AlertCircle size={20} className="text-red-500" />
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Text Content */}
                <motion.div
                  key={`content-${state.status}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="flex-1"
                >
                  <h3 className="text-sm font-bold text-discord-text tracking-tight">
                    {state.status === 'checking' && 'Kontrol ediliyor…'}
                    {state.status === 'available' && 'Yeni sürüm bulundu'}
                    {state.status === 'downloading' && 'İndiriliyor'}
                    {state.status === 'downloaded' && 'İndirildi'}
                    {state.status === 'error' && 'Hata oluştu'}
                  </h3>

                  <p className="mt-1.5 text-xs text-discord-muted/80 leading-relaxed">
                    {state.status === 'checking' && 'En son sürüm kontrol ediliyor…'}
                    {state.status === 'available' && (
                      <>
                        Discord Manager Panel <span className="font-semibold text-discord-blurple">v{state.version}</span> yayımlandı
                      </>
                    )}
                    {state.status === 'downloading' && (
                      <div className="space-y-2">
                        <div className="flex items-baseline gap-2">
                          <span>Sürüm indiriliyor</span>
                          <span className="font-semibold text-sky-500">{state.progress ?? 0}%</span>
                        </div>
                        {state.transferred && state.total && (
                          <div className="text-[11px] text-discord-muted space-y-0.5">
                            <div>{(state.transferred / 1024 / 1024).toFixed(1)} MB / {(state.total / 1024 / 1024).toFixed(1)} MB</div>
                            {state.speed && <div>Hız: {(state.speed / 1024 / 1024).toFixed(1)} MB/s</div>}
                            {state.speed && state.transferred && state.total && (
                              <div>
                                Kalan: ~{Math.ceil((state.total - state.transferred) / state.speed)}s
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                    {state.status === 'downloaded' && (
                      <>
                        Sürüm <span className="font-semibold text-emerald-500">v{state.version}</span> hazır. Yeniden başlat?
                      </>
                    )}
                    {state.status === 'error' && (
                      <>
                        {state.error || 'Güncelleme kontrol edilemedi'}
                      </>
                    )}
                  </p>

                  {/* Progress Bar */}
                  {state.status === 'downloading' && state.progress !== undefined && (
                    <motion.div
                      className="mt-3 h-1 rounded-full bg-discord-line/40 overflow-hidden"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 4 }}
                      transition={{ duration: 0.3 }}
                    >
                      <motion.div
                        className="h-full bg-gradient-to-r from-sky-500 to-discord-blurple rounded-full shadow-lg shadow-sky-500/50"
                        initial={{ width: '0%' }}
                        animate={{ width: `${Math.min(state.progress, 99)}%` }}
                        transition={{ duration: 0.4 }}
                      />
                    </motion.div>
                  )}
                </motion.div>

                {/* Close Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.1)' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsVisible(false)}
                  className="flex-shrink-0 p-1.5 text-discord-muted/60 hover:text-discord-text rounded-lg transition-colors"
                  title="Kapat"
                >
                  <X size={16} />
                </motion.button>
              </div>

              {/* Action Bar */}
              {state.status === 'downloaded' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-white/5 px-5 py-3 bg-discord-darker/50 flex gap-3"
                >
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.desktop?.installUpdate()}
                    className="flex-1 px-3 py-2 rounded-lg bg-gradient-to-r from-discord-blurple to-purple-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-discord-blurple/40 transition-all duration-200 tracking-wide"
                  >
                    ⚡ Şimdi Güncelle
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsVisible(false)}
                    className="px-3 py-2 rounded-lg bg-white/5 text-discord-text text-xs font-medium hover:bg-white/10 transition-colors"
                  >
                    Daha Sonra
                  </motion.button>
                </motion.div>
              )}

              {/* Bottom accent line */}
              <motion.div
                className="h-0.5 bg-gradient-to-r from-discord-blurple via-purple-600 to-transparent"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ originX: 0 }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
