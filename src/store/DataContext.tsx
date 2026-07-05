import {
  createContext,
  useCallback,
  useContext,
  type ReactNode,
} from 'react';
import type {
  Activity,
  ActivityType,
  AppData,
  DisciplineRecord,
  Feedback,
  Note,
  PerformanceCriteria,
  PromotionStatus,
  Staff,
  Task,
  TaskStatus,
} from '../types';
import { dataRepository } from '../data';
import { useDataState } from './DataStateContext';
import { download, nowISO, performanceAverage, progressForStatus, uid } from '../utils/helpers';
import { TRAINING_MODULES } from '../utils/constants';
import { useToast } from './ToastContext';
import { createSeedData } from '../data/seedData';

interface DataContextValue {
  data: AppData;

  // Seçiciler
  getStaff: (id: string) => Staff | undefined;
  staffTasks: (id: string) => Task[];
  staffNotes: (id: string) => Note[];
  staffDiscipline: (id: string) => DisciplineRecord[];

  // Personel
  addStaff: (input: Omit<Staff, 'id' | 'createdAt' | 'performanceScore' | 'trainingRecords' | 'lastTrainingDate' | 'feedback'> & { performanceScore?: number }) => Staff;
  updateStaff: (id: string, patch: Partial<Staff>) => void;
  deleteStaff: (id: string) => void;
  deleteStaffMany: (ids: string[]) => void;
  togglePinStaff: (id: string) => void;
  setPromotionStatus: (id: string, status: PromotionStatus) => void;
  togglePromotionCandidate: (id: string) => void;
  updatePerformance: (id: string, criteria: PerformanceCriteria) => void;
  addFeedback: (staffId: string, content: string, rating: number) => void;
  toggleTraining: (staffId: string, trainingId: string) => void;

  // Görev
  addTask: (input: Omit<Task, 'id' | 'createdAt' | 'completedAt'>) => Task;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  setTaskStatus: (id: string, status: TaskStatus) => void;
  togglePinTask: (id: string) => void;

  // Not
  addNote: (staffId: string, content: string, author?: string) => void;
  deleteNote: (id: string) => void;

  // Disiplin
  addDiscipline: (input: Omit<DisciplineRecord, 'id'>) => void;
  updateDiscipline: (id: string, patch: Partial<DisciplineRecord>) => void;
  deleteDiscipline: (id: string) => void;

  // Veri yönetimi
  exportData: () => void;
  importData: (json: unknown) => boolean;
  resetData: () => void;

  // Aktivite
  deleteActivity: (id: string) => void;
  deleteActivities: (ids: string[]) => void;
  clearActivities: () => void;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const toast = useToast();
  const { data, setData } = useDataState();

  const logActivity = (
    prev: AppData,
    type: ActivityType,
    message: string,
    staffId: string | null,
  ): Activity[] => {
    const activity: Activity = {
      id: uid('act'),
      type,
      message,
      staffId,
      createdAt: nowISO(),
    };
    return [activity, ...prev.activities].slice(0, 60);
  };

  // -------------------------------------------------------------------------
  // Seçiciler
  // -------------------------------------------------------------------------
  const getStaff = useCallback(
    (id: string) => data.staff.find((s) => s.id === id),
    [data.staff],
  );
  const staffTasks = useCallback(
    (id: string) => data.tasks.filter((t) => t.staffId === id),
    [data.tasks],
  );
  const staffNotes = useCallback(
    (id: string) => data.notes.filter((n) => n.staffId === id),
    [data.notes],
  );
  const staffDiscipline = useCallback(
    (id: string) => data.disciplineRecords.filter((d) => d.staffId === id),
    [data.disciplineRecords],
  );

  // -------------------------------------------------------------------------
  // Personel
  // -------------------------------------------------------------------------
  const addStaff: DataContextValue['addStaff'] = (input) => {
    const staff: Staff = {
      ...input,
      id: uid('stf'),
      performanceScore: performanceAverage(input.performance),
      trainingRecords: TRAINING_MODULES.map((name) => ({
        id: uid('trn'),
        name,
        completed: false,
        date: null,
      })),
      lastTrainingDate: null,
      feedback: [],
      createdAt: nowISO(),
    };
    setData((prev) => ({
      ...prev,
      staff: [...prev.staff, staff],
      activities: logActivity(prev, 'staff_added', `${staff.name} ekibe eklendi`, staff.id),
    }));
    toast.success('Personel eklendi', staff.name);
    return staff;
  };

  const updateStaff: DataContextValue['updateStaff'] = (id, patch) => {
    setData((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => (s.id === id ? { ...s, ...patch } : s)),
    }));
  };

  const deleteStaff: DataContextValue['deleteStaff'] = (id) => {
    setData((prev) => ({
      ...prev,
      staff: prev.staff.filter((s) => s.id !== id),
      tasks: prev.tasks.filter((t) => t.staffId !== id),
      notes: prev.notes.filter((n) => n.staffId !== id),
      disciplineRecords: prev.disciplineRecords.filter((d) => d.staffId !== id),
    }));
    toast.info('Personel silindi');
  };

  const deleteStaffMany: DataContextValue['deleteStaffMany'] = (ids) => {
    if (ids.length === 0) return;
    const set = new Set(ids);
    setData((prev) => ({
      ...prev,
      staff: prev.staff.filter((s) => !set.has(s.id)),
      tasks: prev.tasks.filter((t) => !set.has(t.staffId)),
      notes: prev.notes.filter((n) => !set.has(n.staffId)),
      disciplineRecords: prev.disciplineRecords.filter((d) => !set.has(d.staffId)),
    }));
    toast.info(`${ids.length} personel silindi`);
  };

  const togglePinStaff: DataContextValue['togglePinStaff'] = (id) => {
    setData((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => (s.id === id ? { ...s, pinned: !s.pinned } : s)),
    }));
  };

  const setPromotionStatus: DataContextValue['setPromotionStatus'] = (id, status) => {
    setData((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => (s.id === id ? { ...s, promotionStatus: status } : s)),
    }));
  };

  const togglePromotionCandidate: DataContextValue['togglePromotionCandidate'] = (id) => {
    setData((prev) => {
      const staff = prev.staff.find((s) => s.id === id);
      const next = !staff?.promotionCandidate;
      return {
        ...prev,
        staff: prev.staff.map((s) =>
          s.id === id
            ? {
                ...s,
                promotionCandidate: next,
                promotionStatus: next && s.promotionStatus === 'not_ready' ? 'ready' : s.promotionStatus,
              }
            : s,
        ),
        activities: next
          ? logActivity(prev, 'promotion_marked', `${staff?.name} terfi adayı olarak işaretlendi`, id)
          : prev.activities,
      };
    });
  };

  const updatePerformance: DataContextValue['updatePerformance'] = (id, criteria) => {
    setData((prev) => ({
      ...prev,
      staff: prev.staff.map((s) =>
        s.id === id
          ? { ...s, performance: criteria, performanceScore: performanceAverage(criteria) }
          : s,
      ),
      activities: logActivity(
        prev,
        'performance_updated',
        `${prev.staff.find((s) => s.id === id)?.name} performansı güncellendi`,
        id,
      ),
    }));
    toast.success('Performans güncellendi');
  };

  const addFeedback: DataContextValue['addFeedback'] = (staffId, content, rating) => {
    const fb: Feedback = { id: uid('fbk'), staffId, content, rating, author: 'Yönetici', createdAt: nowISO() };
    setData((prev) => ({
      ...prev,
      staff: prev.staff.map((s) =>
        s.id === staffId ? { ...s, feedback: [fb, ...s.feedback] } : s,
      ),
    }));
    toast.success('Geri bildirim eklendi');
  };

  const toggleTraining: DataContextValue['toggleTraining'] = (staffId, trainingId) => {
    setData((prev) => ({
      ...prev,
      staff: prev.staff.map((s) => {
        if (s.id !== staffId) return s;
        const records = s.trainingRecords.map((r) =>
          r.id === trainingId
            ? { ...r, completed: !r.completed, date: !r.completed ? nowISO() : null }
            : r,
        );
        const lastDone =
          records
            .filter((r) => r.completed && r.date)
            .map((r) => r.date as string)
            .sort()
            .at(-1) ?? null;
        return { ...s, trainingRecords: records, lastTrainingDate: lastDone };
      }),
    }));
  };

  // -------------------------------------------------------------------------
  // Görev
  // -------------------------------------------------------------------------
  const addTask: DataContextValue['addTask'] = (input) => {
    const task: Task = {
      ...input,
      id: uid('tsk'),
      progress: progressForStatus(input.status),
      createdAt: nowISO(),
      completedAt: input.status === 'completed' ? nowISO() : null,
    };
    setData((prev) => ({
      ...prev,
      tasks: [task, ...prev.tasks],
      activities: logActivity(
        prev,
        'task_created',
        `Yeni görev: "${task.title}"`,
        task.staffId,
      ),
    }));
    toast.success('Görev oluşturuldu', task.title);
    return task;
  };

  const updateTask: DataContextValue['updateTask'] = (id, patch) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => {
        if (t.id !== id) return t;
        const next = { ...t, ...patch };
        // İlerleme her zaman durumdan türetilir
        if (patch.status) {
          next.progress = progressForStatus(patch.status);
          next.completedAt =
            patch.status === 'completed' ? t.completedAt ?? nowISO() : null;
        }
        return next;
      }),
    }));
  };

  const deleteTask: DataContextValue['deleteTask'] = (id) => {
    setData((prev) => ({ ...prev, tasks: prev.tasks.filter((t) => t.id !== id) }));
    toast.info('Görev silindi');
  };

  const setTaskStatus: DataContextValue['setTaskStatus'] = (id, status) => {
    setData((prev) => {
      const task = prev.tasks.find((t) => t.id === id);
      const activities =
        status === 'completed' && task?.status !== 'completed'
          ? logActivity(prev, 'task_completed', `Görev tamamlandı: "${task?.title}"`, task?.staffId ?? null)
          : prev.activities;
      return {
        ...prev,
        tasks: prev.tasks.map((t) => {
          if (t.id !== id) return t;
          return {
            ...t,
            status,
            progress: progressForStatus(status),
            completedAt: status === 'completed' ? nowISO() : null,
          };
        }),
        activities,
      };
    });
  };

  const togglePinTask: DataContextValue['togglePinTask'] = (id) => {
    setData((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)),
    }));
  };

  // -------------------------------------------------------------------------
  // Not
  // -------------------------------------------------------------------------
  const addNote: DataContextValue['addNote'] = (staffId, content, author = 'Yönetici') => {
    const note: Note = { id: uid('not'), staffId, content, author, createdAt: nowISO() };
    setData((prev) => ({
      ...prev,
      notes: [note, ...prev.notes],
      activities: logActivity(
        prev,
        'note_added',
        `${prev.staff.find((s) => s.id === staffId)?.name} için not eklendi`,
        staffId,
      ),
    }));
    toast.success('Not eklendi');
  };

  const deleteNote: DataContextValue['deleteNote'] = (id) => {
    setData((prev) => ({ ...prev, notes: prev.notes.filter((n) => n.id !== id) }));
  };

  // -------------------------------------------------------------------------
  // Disiplin
  // -------------------------------------------------------------------------
  const addDiscipline: DataContextValue['addDiscipline'] = (input) => {
    const record: DisciplineRecord = { ...input, id: uid('dsp') };
    setData((prev) => ({
      ...prev,
      disciplineRecords: [record, ...prev.disciplineRecords],
      activities: logActivity(
        prev,
        'discipline_added',
        `${prev.staff.find((s) => s.id === input.staffId)?.name} için disiplin kaydı`,
        input.staffId,
      ),
    }));
    toast.warning('Disiplin kaydı eklendi');
  };

  const updateDiscipline: DataContextValue['updateDiscipline'] = (id, patch) => {
    setData((prev) => ({
      ...prev,
      disciplineRecords: prev.disciplineRecords.map((d) =>
        d.id === id ? { ...d, ...patch } : d,
      ),
    }));
  };

  const deleteDiscipline: DataContextValue['deleteDiscipline'] = (id) => {
    setData((prev) => ({
      ...prev,
      disciplineRecords: prev.disciplineRecords.filter((d) => d.id !== id),
    }));
  };

  // -------------------------------------------------------------------------
  // Veri yönetimi
  // -------------------------------------------------------------------------
  const exportData: DataContextValue['exportData'] = () => {
    const json = JSON.stringify(data, null, 2);
    const stamp = new Date().toISOString().slice(0, 10);
    download(`discord-panel-${stamp}.json`, json);
    toast.success('Veriler dışa aktarıldı');
  };

  const importData: DataContextValue['importData'] = (json) => {
    const valid = dataRepository.validateImport(json);
    if (!valid) {
      toast.error('İçe aktarma başarısız', 'Geçersiz dosya biçimi');
      return false;
    }
    setData(() => valid);
    toast.success('Veriler içe aktarıldı');
    return true;
  };

  const resetData: DataContextValue['resetData'] = () => {
    const seed = createSeedData();
    setData(() => seed);
    toast.info('Tüm veriler sıfırlandı');
  };

  // -------------------------------------------------------------------------
  // Aktivite
  // -------------------------------------------------------------------------
  const deleteActivity: DataContextValue['deleteActivity'] = (id) => {
    setData((prev) => ({ ...prev, activities: prev.activities.filter((a) => a.id !== id) }));
    toast.info('Aktivite silindi');
  };

  const deleteActivities: DataContextValue['deleteActivities'] = (ids) => {
    if (ids.length === 0) return;
    const set = new Set(ids);
    setData((prev) => ({ ...prev, activities: prev.activities.filter((a) => !set.has(a.id)) }));
    toast.info(`${ids.length} aktivite silindi`);
  };

  const clearActivities: DataContextValue['clearActivities'] = () => {
    setData((prev) => ({ ...prev, activities: [] }));
    toast.info('Aktivite akışı temizlendi');
  };

  const value: DataContextValue = {
    data,
    getStaff,
    staffTasks,
    staffNotes,
    staffDiscipline,
    addStaff,
    updateStaff,
    deleteStaff,
    deleteStaffMany,
    togglePinStaff,
    setPromotionStatus,
    togglePromotionCandidate,
    updatePerformance,
    addFeedback,
    toggleTraining,
    addTask,
    updateTask,
    deleteTask,
    setTaskStatus,
    togglePinTask,
    addNote,
    deleteNote,
    addDiscipline,
    updateDiscipline,
    deleteDiscipline,
    exportData,
    importData,
    resetData,
    deleteActivity,
    deleteActivities,
    clearActivities,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData, DataProvider içinde kullanılmalı');
  return ctx;
}
