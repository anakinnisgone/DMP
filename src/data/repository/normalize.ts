import type {
  Activity,
  ActivityType,
  AppData,
  DisciplineRecord,
  DisciplineStatus,
  Feedback,
  Note,
  PerformanceCriteria,
  ProStaffTrack,
  PromotionStatus,
  Role,
  Staff,
  Task,
  TaskFrequency,
  TaskPriority,
  TaskStatus,
  TrainingRecord,
} from '../../types';
import { DATA_VERSION, OWNER_NAME, TRAINING_MODULES } from '../../utils/constants';
import { nowISO, performanceAverage, uid } from '../../utils/helpers';
import { createSeedData } from '../seedData';

// ---------------------------------------------------------------------------
// Domain doğrulama katmanı.
// Depolama teknolojisinden tamamen bağımsızdır: hangi backend'den gelirse
// gelsin (localStorage, SQLite, PostgreSQL, içe aktarılan JSON) ham veri
// buradan geçerek geçerli bir AppData'ya dönüştürülür.
// ---------------------------------------------------------------------------

// Geçerli enum kümeleri
const ROLES: Role[] = ['leader', 'qa', 'prostaff'];
const TRACKS: ProStaffTrack[] = ['leader_candidate', 'qa_candidate'];
const PRIORITIES: TaskPriority[] = ['critical', 'high', 'medium', 'low'];
const STATUSES: TaskStatus[] = ['pending', 'in_progress', 'reviewing', 'completed', 'cancelled'];
const FREQUENCIES: TaskFrequency[] = ['daily', 'weekly', 'once'];
const PROMOTIONS: PromotionStatus[] = ['ready', 'watching', 'not_ready'];
const SEVERITIES: DisciplineRecord['severity'][] = ['low', 'medium', 'high'];
const DISC_STATUSES: DisciplineStatus[] = ['active', 'resolved'];
const ACTIVITY_TYPES: ActivityType[] = [
  'task_created',
  'task_completed',
  'task_updated',
  'note_added',
  'discipline_added',
  'promotion_marked',
  'staff_added',
  'performance_updated',
];
const PERF_KEYS: (keyof PerformanceCriteria)[] = [
  'activity',
  'taskCompletion',
  'responsibility',
  'communication',
  'teamwork',
  'discipline',
  'quality',
  'training',
];

// İlkel değer yardımcıları
type Dict = Record<string, unknown>;
const asObj = (v: unknown): Dict => (v && typeof v === 'object' ? (v as Dict) : {});
const str = (v: unknown, d = ''): string => (typeof v === 'string' ? v : d);
const nstr = (v: unknown): string | null => (typeof v === 'string' ? v : null);
const bool = (v: unknown): boolean => v === true;
const strArr = (v: unknown): string[] =>
  Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
const oneOf = <T extends string>(v: unknown, allowed: readonly T[], d: T): T =>
  typeof v === 'string' && (allowed as readonly string[]).includes(v) ? (v as T) : d;
const numClamp = (v: unknown, min: number, max: number, d: number): number => {
  const n = typeof v === 'number' && isFinite(v) ? v : d;
  return Math.min(max, Math.max(min, Math.round(n)));
};

// Alt yapı temizleyicileri
function sanitizePerformance(v: unknown): PerformanceCriteria {
  const o = asObj(v);
  const out = {} as PerformanceCriteria;
  for (const k of PERF_KEYS) out[k] = numClamp(o[k], 0, 100, 70);
  return out;
}

function sanitizeTraining(v: unknown): TrainingRecord[] {
  if (!Array.isArray(v)) {
    return TRAINING_MODULES.map((name) => ({ id: uid('trn'), name, completed: false, date: null }));
  }
  return v.map((r) => {
    const o = asObj(r);
    return {
      id: str(o.id) || uid('trn'),
      name: str(o.name, 'Modül'),
      completed: bool(o.completed),
      date: nstr(o.date),
    };
  });
}

function sanitizeFeedback(v: unknown, staffId: string): Feedback[] {
  if (!Array.isArray(v)) return [];
  return v.map((f) => {
    const o = asObj(f);
    return {
      id: str(o.id) || uid('fbk'),
      staffId: str(o.staffId) || staffId,
      content: str(o.content),
      rating: numClamp(o.rating, 1, 5, 4),
      author: str(o.author, OWNER_NAME),
      createdAt: str(o.createdAt) || nowISO(),
    };
  });
}

function sanitizeStaff(v: unknown): Staff {
  const o = asObj(v);
  const role = oneOf(o.role, ROLES, 'prostaff');
  const performance = sanitizePerformance(o.performance);
  const id = str(o.id) || uid('stf');
  const hasTeam = bool(o.hasTeam);
  return {
    id,
    name: str(o.name, 'İsimsiz'),
    discordUsername: str(o.discordUsername),
    role,
    track: role === 'prostaff' ? oneOf(o.track, TRACKS, 'leader_candidate') : null,
    avatar: nstr(o.avatar),
    performanceScore: numClamp(o.performanceScore, 0, 100, performanceAverage(performance)),
    disciplineScore: numClamp(o.disciplineScore, 0, 100, 80),
    performance,
    team: hasTeam ? nstr(o.team) : null,
    teamSize: hasTeam ? numClamp(o.teamSize, 0, 100000, 0) : 0,
    hasTeam,
    trainingRecords: sanitizeTraining(o.trainingRecords),
    lastTrainingDate: nstr(o.lastTrainingDate),
    promotionStatus: oneOf(o.promotionStatus, PROMOTIONS, 'not_ready'),
    promotionCandidate: bool(o.promotionCandidate),
    pinned: bool(o.pinned),
    lastActive: str(o.lastActive) || nowISO(),
    evaluation: str(o.evaluation),
    feedback: sanitizeFeedback(o.feedback, id),
    createdAt: str(o.createdAt) || nowISO(),
  };
}

function sanitizeTask(v: unknown): Task {
  const o = asObj(v);
  const status = oneOf(o.status, STATUSES, 'pending');
  return {
    id: str(o.id) || uid('tsk'),
    staffId: str(o.staffId),
    title: str(o.title, 'Başlıksız görev'),
    description: str(o.description),
    priority: oneOf(o.priority, PRIORITIES, 'medium'),
    status,
    progress: numClamp(o.progress, 0, 100, status === 'completed' ? 100 : 0),
    frequency: oneOf(o.frequency, FREQUENCIES, 'once'),
    dueDate: nstr(o.dueDate),
    createdAt: str(o.createdAt) || nowISO(),
    completedAt: status === 'completed' ? nstr(o.completedAt) ?? nowISO() : nstr(o.completedAt),
    assignedBy: str(o.assignedBy, OWNER_NAME),
    tags: strArr(o.tags),
    notes: str(o.notes),
    pinned: bool(o.pinned),
  };
}

function sanitizeNote(v: unknown): Note {
  const o = asObj(v);
  return {
    id: str(o.id) || uid('not'),
    staffId: str(o.staffId),
    content: str(o.content),
    author: str(o.author, OWNER_NAME),
    createdAt: str(o.createdAt) || nowISO(),
  };
}

function sanitizeDiscipline(v: unknown): DisciplineRecord {
  const o = asObj(v);
  return {
    id: str(o.id) || uid('dsp'),
    staffId: str(o.staffId),
    date: str(o.date) || nowISO(),
    reason: str(o.reason, 'Belirtilmemiş'),
    description: str(o.description),
    status: oneOf(o.status, DISC_STATUSES, 'active'),
    note: str(o.note),
    severity: oneOf(o.severity, SEVERITIES, 'low'),
  };
}

function sanitizeActivity(v: unknown): Activity {
  const o = asObj(v);
  return {
    id: str(o.id) || uid('act'),
    type: oneOf(o.type, ACTIVITY_TYPES, 'task_updated'),
    message: str(o.message),
    staffId: nstr(o.staffId),
    createdAt: str(o.createdAt) || nowISO(),
  };
}

/** Ham/bilinmeyen veriyi geçerli bir AppData yapısına dönüştürür. */
export function normalize(raw: Partial<AppData> | null): AppData {
  if (!raw || typeof raw !== 'object') return createSeedData();
  const r = raw as Dict;
  return {
    staff: Array.isArray(r.staff) ? r.staff.map(sanitizeStaff) : [],
    tasks: Array.isArray(r.tasks) ? r.tasks.map(sanitizeTask) : [],
    notes: Array.isArray(r.notes) ? r.notes.map(sanitizeNote) : [],
    disciplineRecords: Array.isArray(r.disciplineRecords)
      ? r.disciplineRecords.map(sanitizeDiscipline)
      : [],
    activities: Array.isArray(r.activities) ? r.activities.map(sanitizeActivity) : [],
    meta: {
      version: DATA_VERSION,
      lastUpdated: str(asObj(r.meta).lastUpdated) || nowISO(),
    },
  };
}
