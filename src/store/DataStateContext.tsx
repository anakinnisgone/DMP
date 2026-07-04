import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  type ReactNode,
} from 'react';
import type { AppData } from '../types';
import { loadData, saveData } from '../utils/storage';

interface DataStateContextValue {
  data: AppData;
  setData: (updater: (prev: AppData) => AppData) => void;
}

const DataStateContext = createContext<DataStateContextValue | null>(null);

export function DataStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Debounce localStorage saves (500ms) to prevent excessive I/O during rapid updates
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveData(data);
      saveTimeoutRef.current = null;
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [data]);

  const value: DataStateContextValue = { data, setData };

  return (
    <DataStateContext.Provider value={value}>
      {children}
    </DataStateContext.Provider>
  );
}

export function useDataState(): DataStateContextValue {
  const ctx = useContext(DataStateContext);
  if (!ctx) throw new Error('useDataState must be used within DataStateProvider');
  return ctx;
}
