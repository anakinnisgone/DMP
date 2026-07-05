import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Search, User, StickyNote, ClipboardList, CornerDownLeft } from 'lucide-react';
import { useData } from '../../store/DataContext';
import { ROLE_CONFIG } from '../../utils/constants';

interface ResultItem {
  key: string;
  type: 'staff' | 'note' | 'task';
  title: string;
  subtitle: string;
  to: string;
}

const TYPE_META = {
  staff: { icon: User, label: 'Personel' },
  note: { icon: StickyNote, label: 'Not' },
  task: { icon: ClipboardList, label: 'Görev' },
} as const;

/**
 * Uygulama geneli anlık arama (Ctrl+K).
 * Personel adı, Discord kullanıcı adı, rol, sicil (ID), not ve görev
 * başlıklarında arar; seçim ilgili sayfaya götürür.
 */
export function GlobalSearch() {
  const { data } = useData();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K ile aç, Escape ile kapat
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    const onOpenEvent = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('dmp:open-search', onOpenEvent);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('dmp:open-search', onOpenEvent);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActive(0);
      // Panel animasyonu başladıktan sonra odaklan
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  const results = useMemo<ResultItem[]>(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const out: ResultItem[] = [];

    for (const s of data.staff) {
      const role = ROLE_CONFIG[s.role].label;
      const haystack = `${s.name} ${s.discordUsername} ${role} ${s.id}`.toLowerCase();
      if (haystack.includes(q)) {
        out.push({
          key: `s-${s.id}`,
          type: 'staff',
          title: s.name,
          subtitle: `${role}${s.discordUsername ? ` · @${s.discordUsername}` : ''}`,
          to: `/personeller/${s.id}`,
        });
      }
      if (out.length >= 8) break;
    }

    for (const n of data.notes) {
      if (out.length >= 12) break;
      if (n.content.toLowerCase().includes(q)) {
        const staff = data.staff.find((s) => s.id === n.staffId);
        out.push({
          key: `n-${n.id}`,
          type: 'note',
          title: n.content.length > 64 ? `${n.content.slice(0, 64)}…` : n.content,
          subtitle: staff ? staff.name : 'Not',
          to: staff ? `/personeller/${staff.id}` : '/personeller',
        });
      }
    }

    for (const t of data.tasks) {
      if (out.length >= 16) break;
      if (t.title.toLowerCase().includes(q)) {
        out.push({
          key: `t-${t.id}`,
          type: 'task',
          title: t.title,
          subtitle: 'Görev',
          to: '/gorevler',
        });
      }
    }

    return out;
  }, [query, data]);

  const select = useCallback(
    (item: ResultItem) => {
      setOpen(false);
      navigate(item.to);
    },
    [navigate],
  );

  const onInputKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[active]) {
      select(results[active]);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
          <motion.div
            className="glass-strong relative z-10 w-full max-w-lg overflow-hidden rounded-2xl shadow-glass"
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ type: 'spring', stiffness: 360, damping: 30 }}
            role="dialog"
            aria-modal="true"
            aria-label="Global arama"
          >
            <div className="flex items-center gap-2.5 border-b border-discord-line px-4">
              <Search size={16} className="shrink-0 text-discord-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="Personel, rol, not veya görev ara..."
                className="h-12 w-full bg-transparent text-sm text-discord-text outline-none placeholder:text-discord-faint"
              />
              <kbd className="shrink-0 rounded-md border border-discord-border bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold text-discord-faint">
                ESC
              </kbd>
            </div>

            <div className="max-h-[46vh] overflow-y-auto p-2">
              {query.trim() === '' ? (
                <p className="px-3 py-6 text-center text-xs text-discord-faint">
                  Yazmaya başlayın — personel, Discord adı, rol, sicil, not ve görevlerde anlık arar.
                </p>
              ) : results.length === 0 ? (
                <p className="px-3 py-6 text-center text-xs text-discord-faint">
                  "{query}" için sonuç bulunamadı.
                </p>
              ) : (
                results.map((r, i) => {
                  const Icon = TYPE_META[r.type].icon;
                  return (
                    <button
                      key={r.key}
                      onClick={() => select(r)}
                      onMouseEnter={() => setActive(i)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                        i === active ? 'bg-discord-blurple/15' : 'hover:bg-white/[0.04]'
                      }`}
                    >
                      <span
                        className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg ${
                          i === active
                            ? 'bg-discord-blurple/20 text-discord-blurple'
                            : 'bg-white/5 text-discord-muted'
                        }`}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-discord-text">
                          {r.title}
                        </span>
                        <span className="block truncate text-[11px] text-discord-faint">
                          {TYPE_META[r.type].label} · {r.subtitle}
                        </span>
                      </span>
                      {i === active && (
                        <CornerDownLeft size={13} className="shrink-0 text-discord-faint" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
