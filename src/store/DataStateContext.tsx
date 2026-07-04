import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from 'react';
import type { AppData } from '../types';
import { createSeedData } from '../data/seedData';
import { loadData, saveData } from '../utils/storage';

interface DataStateContextValue {
  data: AppData;
  setData: (updater: (prev: AppData) => AppData) => void;
}

const DataStateContext = createContext<DataStateContextValue | null>(null);

export function DataStateProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData());

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[DataStateContext] Syncing to localStorage', {
        staffCount: data.staff.length,
        taskCount: data.tasks.length,
      });
    }
    saveData(data);
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
