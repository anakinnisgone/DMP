import type {
  AppData,
  PerformanceCriteria,
  Staff,
  Task,
  TaskStatus,
} from '../types';
import { CRITERIA_KEYS } from './constants';

// ---------------------------------------------------------------------------
// ID üretimi
// ---------------------------------------------------------------------------
export function uid(prefix = 'id'): string {
  const rnd = Math.random().toString(36).slice(2, 8);
  const time = Date.now().toString(36).slice(-4);
  return `${prefix}_${time}${rnd}`;
}

export const nowISO = (): string => new Date().toISOString();

// ---------------------------------------------------------------------------
// Tarih biçimlendirme (Türkçe)
// ---------------------------------------------------------------------------
const MONTHS_TR = [
  'Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz',
  'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara',
];

export function formatDate(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '—';
  return `${d.getDate()} ${MONTHS_TR[d.getMonth()]} ${d.getFullYear()}`;
}

/** "3 gün önce", "2 saat önce" gibi göreli zaman */
export function relativeTime(iso: string | null): string {
  if (!iso) return '—';
  const d = new Date(iso).getTime();
  if (isNaN(d)) return '—';
  const diff = Date.now() - d;
  const sec = Math.round(diff / 1000);
  const min = Math.round(sec / 60);
  const hr = Math.round(min / 60);
  const day = Math.round(hr / 24);

  if (sec < 60) return 'az önce';
  if (min < 60) return `${min} dk önce`;
  if (hr < 24) return `${hr} saat önce`;
  if (day < 30) return `${day} gün önce`;
  return formatDate(iso);
}

/** input[type=date] için YYYY-MM-DD */
export function toDateInput(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  return d.toISOString().slice(0, 10);
}

export function fromDateInput(value: string): string | null {
  if (!value) return null;
  return new Date(value + 'T12:00:00').toISOString();
}

// ---------------------------------------------------------------------------
// Görev yardımcıları
// ---------------------------------------------------------------------------
export type DueState = 'none' | 'overdue' | 'upcoming' | 'later' | 'done';

export function dueState(task: Task): DueState {
  if (task.status === 'completed') return 'done';
  if (!task.dueDate) return 'none';
  const due = new Date(task.dueDate).getTime();
  const now = Date.now();
  const dayMs = 86400000;
  if (due < now - dayMs) return 'overdue';
  if (due <= now + 3 * dayMs) return 'upcoming';
  return 'later';
}

export function isOverdue(task: Task): boolean {
  return dueState(task) === 'overdue';
}

export function isActive(task: Task): boolean {
  return task.status === 'in_progress' || task.status === 'reviewing';
}

export function isPending(task: Task): boolean {
  return task.status === 'pending';
}

export function isToday(iso: string | null): boolean {
  if (!iso) return false;
  const d = new Date(iso);
  const t = new Date();
  return (
    d.getFullYear() === t.getFullYear() &&
    d.getMonth() === t.getMonth() &&
    d.getDate() === t.getDate()
  );
}

export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// ---------------------------------------------------------------------------
// Performans hesaplama
// ---------------------------------------------------------------------------
export function performanceAverage(p: PerformanceCriteria): number {
  const sum = CRITERIA_KEYS.reduce((acc, k) => acc + (p[k] || 0), 0);
  return Math.round(sum / CRITERIA_KEYS.length);
}

// ---------------------------------------------------------------------------
// Personel bazlı görev sayaçları
// ---------------------------------------------------------------------------
export interface StaffTaskCounts {
  total: number;
  active: number;
  pending: number;
  completed: number;
  overdue: number;
}

export function staffTaskCounts(tasks: Task[], staffId: string): StaffTaskCounts {
  const list = tasks.filter((t) => t.staffId === staffId);
  return {
    total: list.length,
    active: list.filter(isActive).length,
    pending: list.filter(isPending).length,
    completed: list.filter((t) => t.status === 'completed').length,
    overdue: list.filter(isOverdue).length,
  };
}

export function staffProgress(tasks: Task[], staffId: string): number {
  const list = tasks.filter(
    (t) => t.staffId === staffId && t.status !== 'cancelled',
  );
  if (list.length === 0) return 0;
  const done = list.filter((t) => t.status === 'completed').length;
  return Math.round((done / list.length) * 100);
}

// ---------------------------------------------------------------------------
// Eğitim ilerlemesi
// ---------------------------------------------------------------------------
export function trainingProgress(staff: Staff): number {
  const recs = staff.trainingRecords;
  if (recs.length === 0) return 0;
  const done = recs.filter((r) => r.completed).length;
  return Math.round((done / recs.length) * 100);
}

// ---------------------------------------------------------------------------
// Genel panel istatistikleri
// ---------------------------------------------------------------------------
export interface DashboardStats {
  leaderCount: number;
  qaCount: number;
  prostaffCount: number;
  totalStaff: number;
  activeTasks: number;
  completedToday: number;
  pendingTasks: number;
  overdueTasks: number;
  criticalTasks: number;
  upcomingTasks: number;
  overallProgress: number;
}

export function computeDashboardStats(data: AppData): DashboardStats {
  const { staff, tasks } = data;
  const notCancelled = tasks.filter((t) => t.status !== 'cancelled');
  const completed = tasks.filter((t) => t.status === 'completed');

  return {
    leaderCount: staff.filter((s) => s.role === 'leader').length,
    qaCount: staff.filter((s) => s.role === 'qa').length,
    prostaffCount: staff.filter((s) => s.role === 'prostaff').length,
    totalStaff: staff.length,
    activeTasks: tasks.filter(isActive).length,
    completedToday: completed.filter((t) => isToday(t.completedAt)).length,
    pendingTasks: tasks.filter(isPending).length,
    overdueTasks: tasks.filter(isOverdue).length,
    criticalTasks: tasks.filter(
      (t) => t.priority === 'critical' && t.status !== 'completed' && t.status !== 'cancelled',
    ).length,
    upcomingTasks: tasks.filter((t) => dueState(t) === 'upcoming').length,
    overallProgress:
      notCancelled.length === 0
        ? 0
        : Math.round((completed.length / notCancelled.length) * 100),
  };
}

// ---------------------------------------------------------------------------
// Küçük yardımcılar
// ---------------------------------------------------------------------------
export function clamp(n: number, min = 0, max = 100): number {
  return Math.min(max, Math.max(min, n));
}

export function initials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/** İsimden tutarlı bir HSL renk (avatar arka planı için) */
export function nameColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 45% 42%)`;
}

export function sortByDate<T>(arr: T[], key: (x: T) => string, dir: 'asc' | 'desc' = 'desc'): T[] {
  return [...arr].sort((a, b) => {
    const av = new Date(key(a)).getTime();
    const bv = new Date(key(b)).getTime();
    return dir === 'desc' ? bv - av : av - bv;
  });
}

export function download(filename: string, content: string, type = 'application/json') {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Bayt sayısını okunabilir birime çevirir (B / KB / MB) */
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Görev ilerlemesi artık kullanıcı tarafından girilmez; her zaman durumdan türetilir.
 * Bekliyor %0 · Devam Ediyor %50 · İncelemede %90 · Tamamlandı %100 · İptal %0
 */
export function progressForStatus(status: TaskStatus): number {
  switch (status) {
    case 'in_progress':
      return 50;
    case 'reviewing':
      return 90;
    case 'completed':
      return 100;
    case 'pending':
    case 'cancelled':
    default:
      return 0;
  }
}

export const STATUS_ORDER: TaskStatus[] = [
  'pending',
  'in_progress',
  'reviewing',
  'completed',
  'cancelled',
];
