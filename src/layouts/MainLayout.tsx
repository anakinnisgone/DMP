import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { UpdatePanel } from '../components/ui/UpdatePanel';
import { GlobalSearch } from '../components/ui/GlobalSearch';
import { DLogo } from '../components/ui/DLogo';
import { APP_NAME, APP_VERSION } from '../utils/constants';

export function MainLayout({ children }: { children: ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Masaüstü sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobil drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDrawerOpen(false)}
            />
            <motion.div
              className="absolute left-0 top-0 h-full"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            >
              <Sidebar onNavigate={() => setDrawerOpen(false)} />
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* İçerik */}
      <div className="flex min-w-0 flex-1 flex-col">
        <UpdatePanel />
        <GlobalSearch />
        {/* Mobil üst bar */}
        <header className="flex items-center justify-between border-b border-discord-line bg-discord-surface/60 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2.5">
            <DLogo size={30} className="shrink-0" />
            <span className="font-display text-sm font-bold">{APP_NAME}</span>
            <span className="rounded-md bg-gradient-to-r from-discord-blurple/25 to-purple-500/20 px-1.5 py-px text-[10px] font-bold text-discord-blurple ring-1 ring-inset ring-discord-blurple/30">
              v{APP_VERSION}
            </span>
          </div>
          <button
            onClick={() => setDrawerOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg text-discord-muted hover:bg-white/5 hover:text-discord-text"
            aria-label="Menü"
          >
            {drawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-7xl">{children}</div>
        </main>
      </div>
    </div>
  );
}
