import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { NAV_ITEMS, APP_NAME, APP_VERSION } from '../utils/constants';
import { useData } from '../store/DataContext';
import { DLogo } from '../components/ui/DLogo';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { data } = useData();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-discord-line bg-discord-surface/60 backdrop-blur-xl">
      {/* Marka kartı */}
      <div className="px-3 pt-3">
        <div className="group flex items-center gap-3 rounded-2xl border border-white/5 bg-white/[0.03] p-3 shadow-lg shadow-black/20 transition-all duration-200 hover:border-discord-blurple/25 hover:bg-white/[0.05] hover:shadow-discord-blurple/10">
          <DLogo
            size={44}
            className="shrink-0 drop-shadow-[0_4px_12px_rgba(88,101,242,0.35)] transition-transform duration-200 group-hover:scale-105"
          />
          <div className="min-w-0 flex-1">
            <p className="font-display text-[13px] font-bold leading-snug text-discord-text">
              {APP_NAME}{' '}
              <span className="ml-0.5 inline-block -translate-y-px rounded-md bg-gradient-to-r from-discord-blurple/25 to-purple-500/20 px-1.5 py-px align-middle text-[9px] font-bold tracking-wide text-discord-blurple ring-1 ring-inset ring-discord-blurple/30">
                v{APP_VERSION}
              </span>
            </p>
            <p className="mt-0.5 text-[11px] leading-snug text-discord-muted">
              Yönetim ekibi kontrol paneli
            </p>
          </div>
        </div>
      </div>

      {/* Global arama tetikleyici */}
      <div className="px-3 pt-3">
        <button
          onClick={() => window.dispatchEvent(new Event('dmp:open-search'))}
          className="flex w-full items-center gap-2.5 rounded-xl border border-discord-border/60 bg-discord-surface/50 px-3 py-2 text-left text-sm text-discord-faint transition-colors hover:border-discord-blurple/30 hover:text-discord-muted"
          title="Global arama (Ctrl+K)"
        >
          <Search size={15} />
          <span className="flex-1">Ara...</span>
          <kbd className="rounded-md border border-discord-border bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold">
            Ctrl K
          </kbd>
        </button>
      </div>

      {/* Navigasyon */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-3">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                `group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-discord-blurple/12 text-discord-text'
                    : 'text-discord-muted hover:bg-white/5 hover:text-discord-text'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-discord-blurple"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <Icon
                    size={18}
                    className={isActive ? 'text-discord-blurple' : 'text-discord-faint group-hover:text-discord-muted'}
                  />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Alt bilgi */}
      <div className="border-t border-discord-line px-4 py-3">
        <div className="flex items-center justify-between text-[11px] text-discord-faint">
          <span>{data.staff.length} personel</span>
          <span>{data.tasks.length} görev</span>
        </div>
      </div>
    </aside>
  );
}
