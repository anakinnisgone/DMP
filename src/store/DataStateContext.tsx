import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import type { AppData } from '../types';
import { dataRepository } from '../data';

interface DataStateContextValue {
  data: AppData;
  setData: (updater: (prev: AppData) => AppData) => void;
}

const DataStateContext = createContext<DataStateContextValue | null>(null);

export function DataStateProvider({ children }: { children: ReactNode }) {
  // İlk yükleme asenkrondur (repository sözleşmesi Promise tabanlı);
  // data === null iken henüz yüklenmemiş demektir ve hiçbir şey kaydedilmez.
  const [data, setDataState] = useState<AppData | null>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    dataRepository.load().then((loaded) => {
      if (cancelled) return;
      loadedRef.current = true;
      setDataState(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    // İlk yükleme tamamlanmadan kaydetme: tohum/boş durum gerçek veriyi ezmesin
    if (!loadedRef.current || data === null) return;

    // Debounce persistence (500ms) to prevent excessive I/O during rapid updates
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      dataRepository.save(data);
      saveTimeoutRef.current = null;
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data]);

  const setData = useCallback((updater: (prev: AppData) => AppData) => {
    setDataState((prev) => (prev === null ? prev : updater(prev)));
  }, []);

  // Yükleme tamamlanana kadar içerik render edilmez; localStorage adapter'ında
  // bu tek bir mikro-görev sürer, veritabanı adapter'larında kısa bir beklemedir.
  if (data === null) return null;

  return (
    <DataStateContext.Provider value={{ data, setData }}>
      {children}
    </DataStateContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useDataState(): DataStateContextValue {
  const ctx = useContext(DataStateContext);
  if (!ctx) throw new Error('useDataState must be used within DataStateProvider');
  return ctx;
}
