import { useState, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, ShieldCheck, X } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { UpdateBanner } from '../components/ui/UpdateBanner';
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
        <UpdateBanner />
        {/* Mobil üst bar */}
        <header className="flex items-center justify-between border-b border-discord-line bg-discord-surface/60 px-4 py-3 backdrop-blur-xl lg:hidden">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-discord-blurple text-white">
              <ShieldCheck size={18} />
            </span>
            <span className="font-display text-sm font-bold">{APP_NAME}</span>
            <span className="rounded-full bg-discord-blurple/15 px-1.5 py-0.5 text-[10px] font-semibold text-discord-blurple">
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
