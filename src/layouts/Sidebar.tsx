import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { NAV_ITEMS, APP_NAME, APP_VERSION } from '../utils/constants';
import { useData } from '../store/DataContext';
import { CompactLogo } from '../components/ui/CompactLogo';

interface SidebarProps {
  onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
  const { data } = useData();

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-discord-line bg-discord-surface/60 backdrop-blur-xl">
      {/* Marka */}
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-discord-blurple text-white shadow-lg shadow-discord-blurple/30">
          <CompactLogo size={22} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="truncate font-display text-sm font-bold leading-tight text-discord-text">
              {APP_NAME}
            </p>
            <span className="shrink-0 rounded-full bg-discord-blurple/15 px-1.5 py-0.5 text-[10px] font-semibold text-discord-blurple">
              v{APP_VERSION}
            </span>
          </div>
          <p className="truncate text-[11px] text-discord-faint">Yönetim ekibi kontrol paneli</p>
        </div>
      </div>

      {/* Navigasyon */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
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
