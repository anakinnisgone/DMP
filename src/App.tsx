import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ToastProvider } from './store/ToastContext';
import { DataProvider } from './store/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { Staff } from './pages/Staff';
import { StaffDetail } from './pages/StaffDetail';
import { Tasks } from './pages/Tasks';
import { Performance } from './pages/Performance';
import { Calendar } from './pages/Calendar';
import { Settings } from './pages/Settings';

// Electron (file://) ortamında HashRouter, tarayıcıda BrowserRouter kullanılır.
const isDesktop =
  typeof navigator !== 'undefined' && navigator.userAgent.toLowerCase().includes('electron');
const Router = isDesktop ? HashRouter : BrowserRouter;

function Page({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Page><Dashboard /></Page>} />
        <Route path="/personeller" element={<Page><Staff /></Page>} />
        <Route path="/personeller/:id" element={<Page><StaffDetail /></Page>} />
        <Route path="/gorevler" element={<Page><Tasks /></Page>} />
        <Route path="/performans" element={<Page><Performance /></Page>} />
        <Route path="/takvim" element={<Page><Calendar /></Page>} />
        <Route path="/ayarlar" element={<Page><Settings /></Page>} />
        <Route path="*" element={<Page><Dashboard /></Page>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <DataProvider>
            <Router>
              <MainLayout>
                <AnimatedRoutes />
              </MainLayout>
            </Router>
          </DataProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
