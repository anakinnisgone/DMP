import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { ToastProvider } from './store/ToastContext';
import { DataStateProvider } from './store/DataStateContext';
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
  // Yalnızca giriş animasyonu (enter). Bilinçli olarak exit YOK: çıkış
  // animasyonu, sayfa geçişi sırasında eski sayfayı DOM'da tutar ve içeriği
  // o an değişirse (silme sonrası) geçişi kilitleyebilir. Enter-only ile eski
  // sayfa anında kalkar, yeni sayfa fade-in yapar — kilit imkânsız, zıplama yok.
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();
  // AnimatePresence bilinçli olarak KULLANILMIYOR. Sayfa geçiş animasyonu için
  // AnimatePresence'a gerek yok: <Routes>'a key={pathname} verildiğinde route
  // değişince React eski ağacı unmount edip yenisini mount eder ve her Page'in
  // motion.div'i initial→animate (fade-in) çalıştırır. AnimatePresence + exit
  // ise çıkan sayfayı DOM'da tutuyor; silme sırasında içerik değişince geçiş
  // kilitleniyor veya sayfalar üst üste birikiyordu. Enter-only + remount ile
  // her iki sorun da kökten ortadan kalkar.
  return (
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
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <ToastProvider>
          <DataStateProvider>
            <DataProvider>
              <Router>
                <MainLayout>
                  <AnimatedRoutes />
                </MainLayout>
              </Router>
            </DataProvider>
          </DataStateProvider>
        </ToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
