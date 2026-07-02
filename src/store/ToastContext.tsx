import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, Info, AlertTriangle, XCircle, X } from 'lucide-react';

type ToastType = 'success' | 'info' | 'warning' | 'error';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
}

interface ToastContextValue {
  push: (type: ToastType, title: string, description?: string) => void;
  success: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastType, typeof Info> = {
  success: CheckCircle2,
  info: Info,
  warning: AlertTriangle,
  error: XCircle,
};

const ACCENT: Record<ToastType, string> = {
  success: 'text-green-400 bg-green-500/10',
  info: 'text-blue-400 bg-blue-500/10',
  warning: 'text-amber-400 bg-amber-500/10',
  error: 'text-red-400 bg-red-500/10',
};

const BAR: Record<ToastType, string> = {
  success: 'bg-green-500',
  info: 'bg-blue-500',
  warning: 'bg-amber-500',
  error: 'bg-red-500',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, number>>({});

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  }, []);

  const push = useCallback(
    (type: ToastType, title: string, description?: string) => {
      const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
      setToasts((prev) => [...prev.slice(-3), { id, type, title, description }]);
      timers.current[id] = window.setTimeout(() => dismiss(id), 4200);
    },
    [dismiss],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      push,
      success: (t, d) => push('success', t, d),
      info: (t, d) => push('info', t, d),
      warning: (t, d) => push('warning', t, d),
      error: (t, d) => push('error', t, d),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(92vw,22rem)] flex-col gap-2.5">
        <AnimatePresence initial={false}>
          {toasts.map((t) => {
            const Icon = ICONS[t.type];
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, x: 40, scale: 0.96 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 40, scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 360, damping: 30 }}
                className="glass-strong pointer-events-auto relative flex items-start gap-3 overflow-hidden rounded-xl px-3.5 py-3 shadow-glass"
              >
                <span className={`absolute inset-y-0 left-0 w-1 ${BAR[t.type]}`} />
                <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg ${ACCENT[t.type]}`}>
                  <Icon size={17} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-discord-text">{t.title}</p>
                  {t.description && (
                    <p className="mt-0.5 text-xs leading-relaxed text-discord-muted">
                      {t.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => dismiss(t.id)}
                  className="text-discord-faint transition hover:text-discord-text"
                  aria-label="Kapat"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast, ToastProvider içinde kullanılmalı');
  return ctx;
}
