// ---------------------------------------------------------------------------
// Roller
// ---------------------------------------------------------------------------
export type Role = 'leader' | 'qa' | 'prostaff';

/** ProStaff iki yola ayrılır: Leader Adayı / QA Adayı */
export type ProStaffTrack = 'leader_candidate' | 'qa_candidate';

// ---------------------------------------------------------------------------
// Görev tipleri
// ---------------------------------------------------------------------------
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';

export type TaskStatus =
  | 'pending'
  | 'in_progress'
  | 'reviewing'
  | 'completed'
  | 'cancelled';

/** Görevin tekrar sıklığı: günlük / haftalık / tek seferlik */
export type TaskFrequency = 'daily' | 'weekly' | 'once';

export interface Task {
  id: string;
  staffId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number; // 0-100
  frequency: TaskFrequency;
  dueDate: string | null; // ISO
  createdAt: string; // ISO
  completedAt: string | null; // ISO
  assignedBy: string;
  tags: string[];
  notes: string;
  pinned: boolean;
}

// ---------------------------------------------------------------------------
// Not & geri bildirim
// ---------------------------------------------------------------------------
export interface Note {
  id: string;
  staffId: string;
  content: string;
  author: string;
  createdAt: string;
}

export interface Feedback {
  id: string;
  staffId: string;
  content: string;
  rating: number; // 1-5
  author: string;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Disiplin
// ---------------------------------------------------------------------------
export type DisciplineStatus = 'active' | 'resolved';

export interface DisciplineRecord {
  id: string;
  staffId: string;
  date: string;
  reason: string;
  description: string;
  status: DisciplineStatus;
  note: string;
  severity: 'low' | 'medium' | 'high';
}

// ---------------------------------------------------------------------------
// Performans
// ---------------------------------------------------------------------------
export interface PerformanceCriteria {
  activity: number; // Aktiflik
  taskCompletion: number; // Görev tamamlama
  responsibility: number; // Sorumluluk
  communication: number; // İletişim
  teamwork: number; // Takım çalışması
  discipline: number; // Disiplin
  quality: number; // Kalite
  training: number; // Eğitim
}

// ---------------------------------------------------------------------------
// Eğitim
// ---------------------------------------------------------------------------
export interface TrainingRecord {
  id: string;
  name: string;
  completed: boolean;
  date: string | null;
}

// ---------------------------------------------------------------------------
// Terfi
// ---------------------------------------------------------------------------
export type PromotionStatus = 'ready' | 'watching' | 'not_ready';

// ---------------------------------------------------------------------------
// Personel
// ---------------------------------------------------------------------------
export interface Staff {
  id: string;
  name: string;
  discordUsername: string;
  role: Role;
  track: ProStaffTrack | null; // yalnızca ProStaff için
  avatar: string | null;

  performanceScore: number; // 0-100 (kriterlerden türetilir)
  disciplineScore: number; // 0-100
  performance: PerformanceCriteria;

  team: string | null; // ait olduğu / yönettiği takım
  teamSize: number; // yönettiği üye sayısı
  hasTeam: boolean;

  trainingRecords: TrainingRecord[];
  lastTrainingDate: string | null;

  promotionStatus: PromotionStatus;
  promotionCandidate: boolean;

  pinned: boolean;
  lastActive: string;
  evaluation: string; // genel değerlendirme
  feedback: Feedback[];
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Aktivite akışı
// ---------------------------------------------------------------------------
export type ActivityType =
  | 'task_created'
  | 'task_completed'
  | 'task_updated'
  | 'note_added'
  | 'discipline_added'
  | 'promotion_marked'
  | 'staff_added'
  | 'performance_updated';

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  staffId: string | null;
  createdAt: string;
}

// ---------------------------------------------------------------------------
// Uygulama verisi (LocalStorage şeması)
// ---------------------------------------------------------------------------
export interface AppData {
  staff: Staff[];
  tasks: Task[];
  notes: Note[];
  disciplineRecords: DisciplineRecord[];
  activities: Activity[];
  meta: {
    version: number;
    lastUpdated: string;
  };
}
