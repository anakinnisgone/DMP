import type {
  Activity,
  AppData,
  DisciplineRecord,
  Note,
  PerformanceCriteria,
  ProStaffTrack,
  PromotionStatus,
  Role,
  Staff,
  Task,
  TaskPriority,
  TaskStatus,
  TrainingRecord,
} from '../types';
import { DATA_VERSION, TRAINING_MODULES } from '../utils/constants';
import { performanceAverage, uid } from '../utils/helpers';

// ---------------------------------------------------------------------------
// Göreli tarih yardımcıları
// ---------------------------------------------------------------------------
const day = 86400000;
const daysAgo = (n: number) => new Date(Date.now() - n * day).toISOString();
const hoursAgo = (n: number) => new Date(Date.now() - n * 3600000).toISOString();

function makeTraining(completedCount: number): TrainingRecord[] {
  return TRAINING_MODULES.map((name, i) => ({
    id: uid('trn'),
    name,
    completed: i < completedCount,
    date: i < completedCount ? daysAgo(20 - i * 2) : null,
  }));
}

function perf(v: Partial<PerformanceCriteria>): PerformanceCriteria {
  const base: PerformanceCriteria = {
    activity: 75,
    taskCompletion: 75,
    responsibility: 75,
    communication: 75,
    teamwork: 75,
    discipline: 80,
    quality: 75,
    training: 70,
  };
  return { ...base, ...v };
}

interface SeedStaff {
  name: string;
  discordUsername: string;
  role: Role;
  track?: ProStaffTrack;
  team?: string;
  teamSize?: number;
  hasTeam?: boolean;
  performance: PerformanceCriteria;
  disciplineScore?: number;
  promotionStatus?: PromotionStatus;
  promotionCandidate?: boolean;
  trainingDone: number;
  lastActive: string;
  evaluation: string;
  createdAgo: number;
}

const seedStaff: SeedStaff[] = [
  // ---- Leader Staff (3) ----
  {
    name: 'Kaan Yılmaz',
    discordUsername: 'kaan#0001',
    role: 'leader',
    team: 'Alpha Ekibi',
    teamSize: 6,
    hasTeam: true,
    performance: perf({ activity: 92, taskCompletion: 90, responsibility: 95, communication: 88, teamwork: 90, quality: 86, training: 100 }),
    disciplineScore: 100,
    trainingDone: 6,
    lastActive: hoursAgo(2),
    evaluation: 'Ekibini istikrarlı yöneten, güvenilir ve çözüm odaklı bir lider.',
    createdAgo: 210,
  },
  {
    name: 'Elif Demir',
    discordUsername: 'elifd#0002',
    role: 'leader',
    team: 'Bravo Ekibi',
    teamSize: 7,
    hasTeam: true,
    performance: perf({ activity: 85, taskCompletion: 88, responsibility: 90, communication: 92, teamwork: 89, quality: 84, training: 100 }),
    disciplineScore: 95,
    trainingDone: 6,
    lastActive: hoursAgo(5),
    evaluation: 'İletişimi güçlü, ekip motivasyonunu yüksek tutan bir lider.',
    createdAgo: 180,
  },
  {
    name: 'Mert Aksoy',
    discordUsername: 'merta#0003',
    role: 'leader',
    team: 'Charlie Ekibi',
    teamSize: 6,
    hasTeam: true,
    performance: perf({ activity: 78, taskCompletion: 80, responsibility: 82, communication: 79, teamwork: 83, quality: 80, discipline: 70, training: 100 }),
    disciplineScore: 78,
    promotionStatus: 'watching',
    trainingDone: 6,
    lastActive: daysAgo(1),
    evaluation: 'Deneyimli ancak son dönemde aktifliği dalgalı seyrediyor.',
    createdAgo: 150,
  },

  // ---- Quality Assistant (3) ----
  {
    name: 'Zeynep Kara',
    discordUsername: 'zeynep#0101',
    role: 'qa',
    performance: perf({ activity: 88, taskCompletion: 91, responsibility: 87, communication: 85, teamwork: 82, quality: 96, training: 95 }),
    disciplineScore: 98,
    trainingDone: 6,
    lastActive: hoursAgo(1),
    evaluation: 'Detaycı, kalite standartlarını en üst seviyede tutan bir denetçi.',
    createdAgo: 160,
  },
  {
    name: 'Baran Şahin',
    discordUsername: 'baran#0102',
    role: 'qa',
    performance: perf({ activity: 80, taskCompletion: 84, responsibility: 85, communication: 82, teamwork: 80, quality: 90, training: 90 }),
    disciplineScore: 92,
    trainingDone: 5,
    lastActive: hoursAgo(8),
    evaluation: 'Tutarlı kontroller yapıyor, raporlaması net.',
    createdAgo: 120,
  },
  {
    name: 'Selin Yıldız',
    discordUsername: 'selin#0103',
    role: 'qa',
    performance: perf({ activity: 83, taskCompletion: 86, responsibility: 84, communication: 88, teamwork: 85, quality: 89, training: 85 }),
    disciplineScore: 96,
    promotionStatus: 'watching',
    trainingDone: 5,
    lastActive: daysAgo(2),
    evaluation: 'Kalite ekibinde yükselen bir isim, geri bildirimleri yapıcı.',
    createdAgo: 90,
  },

  // ---- ProStaff (6) ----
  {
    name: 'Emir Çelik',
    discordUsername: 'emir#0201',
    role: 'prostaff',
    track: 'leader_candidate',
    team: 'Delta Ekibi',
    teamSize: 3,
    hasTeam: true,
    performance: perf({ activity: 84, taskCompletion: 82, responsibility: 80, communication: 78, teamwork: 85, quality: 76, training: 66 }),
    disciplineScore: 90,
    promotionStatus: 'ready',
    promotionCandidate: true,
    trainingDone: 4,
    lastActive: hoursAgo(3),
    evaluation: 'Kendi mini ekibini yöneten, liderliğe hazır güçlü bir aday.',
    createdAgo: 70,
  },
  {
    name: 'Deniz Arslan',
    discordUsername: 'deniz#0202',
    role: 'prostaff',
    track: 'qa_candidate',
    performance: perf({ activity: 79, taskCompletion: 80, responsibility: 76, communication: 82, teamwork: 78, quality: 84, training: 72 }),
    disciplineScore: 94,
    promotionStatus: 'ready',
    promotionCandidate: true,
    trainingDone: 5,
    lastActive: hoursAgo(6),
    evaluation: 'QA yolunda hızla ilerliyor, kalite gözü gelişmiş.',
    createdAgo: 65,
  },
  {
    name: 'Ada Koç',
    discordUsername: 'ada#0203',
    role: 'prostaff',
    track: 'leader_candidate',
    performance: perf({ activity: 72, taskCompletion: 70, responsibility: 74, communication: 71, teamwork: 76, quality: 68, training: 55 }),
    disciplineScore: 85,
    promotionStatus: 'watching',
    trainingDone: 3,
    lastActive: daysAgo(1),
    evaluation: 'Potansiyeli yüksek, eğitimlerini tamamlaması bekleniyor.',
    createdAgo: 45,
  },
  {
    name: 'Cem Öztürk',
    discordUsername: 'cem#0204',
    role: 'prostaff',
    track: 'qa_candidate',
    performance: perf({ activity: 68, taskCompletion: 66, responsibility: 70, communication: 72, teamwork: 69, quality: 74, training: 50, discipline: 65 }),
    disciplineScore: 68,
    promotionStatus: 'not_ready',
    trainingDone: 3,
    lastActive: daysAgo(3),
    evaluation: 'Kaliteye ilgili fakat aktifliği artırması gerekiyor.',
    createdAgo: 40,
  },
  {
    name: 'İpek Aydın',
    discordUsername: 'ipek#0205',
    role: 'prostaff',
    track: 'leader_candidate',
    performance: perf({ activity: 76, taskCompletion: 78, responsibility: 75, communication: 74, teamwork: 80, quality: 72, training: 60 }),
    disciplineScore: 88,
    promotionStatus: 'watching',
    trainingDone: 4,
    lastActive: hoursAgo(10),
    evaluation: 'Ekip çalışmasına yatkın, düzenli görev tamamlıyor.',
    createdAgo: 38,
  },
  {
    name: 'Berk Şen',
    discordUsername: 'berk#0206',
    role: 'prostaff',
    track: 'qa_candidate',
    performance: perf({ activity: 60, taskCompletion: 58, responsibility: 62, communication: 64, teamwork: 60, quality: 66, training: 45, discipline: 60 }),
    disciplineScore: 62,
    promotionStatus: 'not_ready',
    trainingDone: 2,
    lastActive: daysAgo(5),
    evaluation: 'Yeni katıldı, uyum ve eğitim sürecinde.',
    createdAgo: 20,
  },
];

function buildStaff(): Staff[] {
  return seedStaff.map((s) => {
    const perfScore = performanceAverage(s.performance);
    const training = makeTraining(s.trainingDone);
    const lastTraining = training.filter((t) => t.completed).at(-1)?.date ?? null;
    return {
      id: uid('stf'),
      name: s.name,
      discordUsername: s.discordUsername,
      role: s.role,
      track: s.track ?? null,
      avatar: null,
      performanceScore: perfScore,
      disciplineScore: s.disciplineScore ?? 90,
      performance: s.performance,
      team: s.team ?? null,
      teamSize: s.teamSize ?? 0,
      hasTeam: s.hasTeam ?? false,
      trainingRecords: training,
      lastTrainingDate: lastTraining,
      promotionStatus: s.promotionStatus ?? 'not_ready',
      promotionCandidate: s.promotionCandidate ?? false,
      pinned: false,
      lastActive: s.lastActive,
      evaluation: s.evaluation,
      feedback: [],
      createdAt: daysAgo(s.createdAgo),
    };
  });
}

// ---------------------------------------------------------------------------
// Görevler
// ---------------------------------------------------------------------------
interface SeedTask {
  staffIdx: number;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  progress: number;
  frequency: Task['frequency'];
  due: number | null; // gün (negatif = geçmiş)
  tags: string[];
}

const seedTasks: SeedTask[] = [
  { staffIdx: 0, title: 'Alpha ekibi haftalık toplantısı', description: 'Ekip performansını gözden geçir ve hedefleri belirle.', priority: 'high', status: 'in_progress', progress: 60, frequency: 'weekly', due: 2, tags: ['toplantı', 'ekip'] },
  { staffIdx: 0, title: 'Yeni üye onboarding kontrolü', description: 'Bu hafta katılan üyelerin uyumunu denetle.', priority: 'medium', status: 'pending', progress: 0, frequency: 'weekly', due: 4, tags: ['onboarding'] },
  { staffIdx: 1, title: 'Günlük kanal denetimi', description: 'Tüm metin kanallarını gözden geçir.', priority: 'medium', status: 'completed', progress: 100, frequency: 'daily', due: -1, tags: ['denetim'] },
  { staffIdx: 1, title: 'Bravo ekip raporu', description: 'Haftalık ekip aktivite raporunu hazırla.', priority: 'high', status: 'reviewing', progress: 85, frequency: 'weekly', due: 1, tags: ['rapor'] },
  { staffIdx: 2, title: 'Kural güncellemesi taslağı', description: 'Sunucu kurallarına yeni maddeler ekle.', priority: 'critical', status: 'pending', progress: 0, frequency: 'once', due: -2, tags: ['kural', 'öncelikli'] },
  { staffIdx: 3, title: 'Kalite kontrol turu', description: 'Moderasyon loglarını kalite açısından incele.', priority: 'high', status: 'in_progress', progress: 45, frequency: 'daily', due: 0, tags: ['kalite'] },
  { staffIdx: 3, title: 'QA haftalık kontrol listesi', description: 'Standart kontrol listesini uygula ve raporla.', priority: 'medium', status: 'completed', progress: 100, frequency: 'weekly', due: -1, tags: ['kalite', 'kontrol'] },
  { staffIdx: 4, title: 'Ticket yanıt kalitesi denetimi', description: 'Destek taleplerinin yanıt kalitesini incele.', priority: 'medium', status: 'in_progress', progress: 30, frequency: 'weekly', due: 3, tags: ['destek'] },
  { staffIdx: 5, title: 'Yeni QA aday değerlendirmesi', description: 'Aday personelin ilk hafta performansını değerlendir.', priority: 'low', status: 'pending', progress: 0, frequency: 'once', due: 5, tags: ['değerlendirme'] },
  { staffIdx: 6, title: 'Delta ekibi görev dağılımı', description: 'Mini ekip için haftalık görevleri planla.', priority: 'high', status: 'in_progress', progress: 55, frequency: 'weekly', due: 2, tags: ['ekip', 'planlama'] },
  { staffIdx: 6, title: 'Liderlik eğitimi modülü 4', description: 'Ekip yönetimi eğitim modülünü tamamla.', priority: 'medium', status: 'reviewing', progress: 80, frequency: 'once', due: 6, tags: ['eğitim'] },
  { staffIdx: 7, title: 'Kalite kontrol pratiği', description: 'QA mentörü ile ortak denetim yap.', priority: 'medium', status: 'completed', progress: 100, frequency: 'once', due: -3, tags: ['kalite', 'eğitim'] },
  { staffIdx: 8, title: 'Moderasyon aracı eğitimi', description: 'Moderasyon araçları eğitimini tamamla.', priority: 'high', status: 'pending', progress: 0, frequency: 'once', due: -1, tags: ['eğitim'] },
  { staffIdx: 9, title: 'Aktiflik hedefi', description: 'Bu hafta minimum aktiflik hedefini karşıla.', priority: 'critical', status: 'in_progress', progress: 20, frequency: 'weekly', due: 1, tags: ['aktiflik', 'öncelikli'] },
  { staffIdx: 10, title: 'Görev geri bildirimi topla', description: 'Tamamlanan görevler için ekip geri bildirimi al.', priority: 'low', status: 'pending', progress: 0, frequency: 'weekly', due: 4, tags: ['geribildirim'] },
  { staffIdx: 11, title: 'Kurallar eğitimini bitir', description: 'Temel kurallar eğitim modülünü tamamla.', priority: 'high', status: 'pending', progress: 0, frequency: 'once', due: 2, tags: ['eğitim', 'oryantasyon'] },
];

function buildTasks(staff: Staff[]): Task[] {
  const staffNameByIdx = (i: number) => staff[i]?.name ?? '';
  return seedTasks.map((t) => {
    const status = t.status;
    return {
      id: uid('tsk'),
      staffId: staff[t.staffIdx].id,
      title: t.title,
      description: t.description,
      priority: t.priority,
      status,
      progress: t.progress,
      frequency: t.frequency,
      dueDate: t.due === null ? null : new Date(Date.now() + t.due * day).toISOString(),
      createdAt: daysAgo(Math.max(1, Math.abs(t.due ?? 3) + 2)),
      completedAt: status === 'completed' ? daysAgo(Math.abs(t.due ?? 1)) : null,
      assignedBy: t.staffIdx > 5 ? staffNameByIdx(0) : 'Yönetici',
      tags: t.tags,
      notes: '',
      pinned: false,
    };
  });
}

// ---------------------------------------------------------------------------
// Notlar, disiplin, aktiviteler
// ---------------------------------------------------------------------------
function buildNotes(staff: Staff[]): Note[] {
  return [
    { id: uid('not'), staffId: staff[0].id, content: 'Ekip yönetiminde çok başarılı, terfi görüşülebilir.', author: 'Yönetici', createdAt: daysAgo(3) },
    { id: uid('not'), staffId: staff[3].id, content: 'Kalite raporları örnek gösterilebilir nitelikte.', author: 'Yönetici', createdAt: daysAgo(5) },
    { id: uid('not'), staffId: staff[6].id, content: 'Liderlik adaylığı için güçlü bir profil.', author: staff[0].name, createdAt: daysAgo(1) },
    { id: uid('not'), staffId: staff[11].id, content: 'Oryantasyon sürecinde, yakından takip edilmeli.', author: 'Yönetici', createdAt: hoursAgo(12) },
  ];
}

function buildDiscipline(staff: Staff[]): DisciplineRecord[] {
  return [
    { id: uid('dsp'), staffId: staff[2].id, date: daysAgo(10), reason: 'Görev gecikmesi', description: 'Haftalık rapor zamanında teslim edilmedi.', status: 'resolved', note: 'Uyarı yapıldı, düzeltildi.', severity: 'low' },
    { id: uid('dsp'), staffId: staff[9].id, date: daysAgo(4), reason: 'Aktiflik düşüklüğü', description: 'Minimum aktiflik hedefi karşılanmadı.', status: 'active', note: 'Takip ediliyor.', severity: 'medium' },
    { id: uid('dsp'), staffId: staff[11].id, date: daysAgo(2), reason: 'Eğitim gecikmesi', description: 'Temel eğitim modülleri süresinde tamamlanmadı.', status: 'active', note: 'Ek süre verildi.', severity: 'low' },
  ];
}

function buildActivities(staff: Staff[], _tasks: Task[]): Activity[] {
  return [
    { id: uid('act'), type: 'task_completed', message: `${staff[1].name} bir görevi tamamladı: "Günlük kanal denetimi"`, staffId: staff[1].id, createdAt: hoursAgo(3) },
    { id: uid('act'), type: 'promotion_marked', message: `${staff[6].name} terfi adayı olarak işaretlendi`, staffId: staff[6].id, createdAt: hoursAgo(6) },
    { id: uid('act'), type: 'note_added', message: `${staff[0].name} için not eklendi`, staffId: staff[0].id, createdAt: daysAgo(1) },
    { id: uid('act'), type: 'discipline_added', message: `${staff[9].name} için disiplin kaydı oluşturuldu`, staffId: staff[9].id, createdAt: daysAgo(4) },
    { id: uid('act'), type: 'task_created', message: `${staff[0].name} için yeni görev oluşturuldu`, staffId: staff[0].id, createdAt: daysAgo(2) },
    { id: uid('act'), type: 'performance_updated', message: `${staff[3].name} performans değerlendirmesi güncellendi`, staffId: staff[3].id, createdAt: daysAgo(5) },
  ];
}

// ---------------------------------------------------------------------------
// Ana fabrika
// ---------------------------------------------------------------------------
export function createSeedData(): AppData {
  const staff = buildStaff();
  const tasks = buildTasks(staff);
  const notes = buildNotes(staff);
  const disciplineRecords = buildDiscipline(staff);
  const activities = buildActivities(staff, tasks);

  return {
    staff,
    tasks,
    notes,
    disciplineRecords,
    activities,
    meta: { version: DATA_VERSION, lastUpdated: new Date().toISOString() },
  };
}
