import {
  LayoutDashboard,
  Users,
  ClipboardList,
  BarChart3,
  Calendar,
  Settings,
  Crown,
  Star,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import type {
  Role,
  TaskPriority,
  TaskStatus,
  PromotionStatus,
  ProStaffTrack,
  PerformanceCriteria,
} from '../types';

export const STORAGE_KEY = 'dsp.data.v1';
export const DATA_VERSION = 1;

// Sunucu sahibi / görev veren varsayılan kişi
export const OWNER_NAME = 'Yönetici';

// ---------------------------------------------------------------------------
// Roller
// ---------------------------------------------------------------------------
export interface RoleConfig {
  label: string;
  icon: LucideIcon;
  emoji: string;
  /** Ana metin/vurgu rengi */
  text: string;
  /** Yumuşak arka plan */
  soft: string;
  /** Kenarlık */
  border: string;
  /** Rozet (arka plan + metin) */
  badge: string;
  /** Solid renk (nokta/çubuk) */
  solid: string;
  /** Kart üst kenar aksanı */
  accent: string;
  ring: string;
}

export const ROLE_CONFIG: Record<Role, RoleConfig> = {
  leader: {
    label: 'Leader Staff',
    icon: Crown,
    emoji: '👑',
    text: 'text-red-400',
    soft: 'bg-red-500/10',
    border: 'border-red-500/30',
    badge: 'bg-red-500/15 text-red-300 border border-red-500/25',
    solid: 'bg-red-500',
    accent: 'from-red-500/80 to-red-500/0',
    ring: 'ring-red-500/40',
  },
  qa: {
    label: 'Quality Assistant',
    icon: Star,
    emoji: '⭐',
    text: 'text-rose-400',
    soft: 'bg-rose-500/10',
    border: 'border-rose-500/30',
    badge: 'bg-rose-500/15 text-rose-300 border border-rose-500/25',
    solid: 'bg-rose-500',
    accent: 'from-rose-500/80 to-rose-500/0',
    ring: 'ring-rose-500/40',
  },
  prostaff: {
    label: 'ProStaff',
    icon: Sprout,
    emoji: '🌱',
    text: 'text-blue-400',
    soft: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    badge: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
    solid: 'bg-blue-500',
    accent: 'from-blue-500/80 to-blue-500/0',
    ring: 'ring-blue-500/40',
  },
};

export const TRACK_CONFIG: Record<ProStaffTrack, { label: string; emoji: string }> = {
  leader_candidate: { label: 'Leader Adayı', emoji: '👑' },
  qa_candidate: { label: 'QA Adayı', emoji: '⭐' },
};

// ---------------------------------------------------------------------------
// Öncelik
// ---------------------------------------------------------------------------
export interface PriorityConfig {
  label: string;
  emoji: string;
  text: string;
  badge: string;
  solid: string;
  order: number;
}

export const PRIORITY_CONFIG: Record<TaskPriority, PriorityConfig> = {
  critical: {
    label: 'Kritik',
    emoji: '🔴',
    text: 'text-red-400',
    badge: 'bg-red-500/15 text-red-300 border border-red-500/25',
    solid: 'bg-red-500',
    order: 0,
  },
  high: {
    label: 'Yüksek',
    emoji: '🟠',
    text: 'text-orange-400',
    badge: 'bg-orange-500/15 text-orange-300 border border-orange-500/25',
    solid: 'bg-orange-500',
    order: 1,
  },
  medium: {
    label: 'Orta',
    emoji: '🟡',
    text: 'text-yellow-400',
    badge: 'bg-yellow-500/15 text-yellow-300 border border-yellow-500/25',
    solid: 'bg-yellow-500',
    order: 2,
  },
  low: {
    label: 'Düşük',
    emoji: '🟢',
    text: 'text-green-400',
    badge: 'bg-green-500/15 text-green-300 border border-green-500/25',
    solid: 'bg-green-500',
    order: 3,
  },
};

// ---------------------------------------------------------------------------
// Durum
// ---------------------------------------------------------------------------
export interface StatusConfig {
  label: string;
  text: string;
  badge: string;
  solid: string;
  dot: string;
}

export const STATUS_CONFIG: Record<TaskStatus, StatusConfig> = {
  pending: {
    label: 'Bekliyor',
    text: 'text-discord-muted',
    badge: 'bg-white/5 text-discord-muted border border-white/10',
    solid: 'bg-discord-faint',
    dot: 'bg-discord-faint',
  },
  in_progress: {
    label: 'Devam Ediyor',
    text: 'text-blue-400',
    badge: 'bg-blue-500/15 text-blue-300 border border-blue-500/25',
    solid: 'bg-blue-500',
    dot: 'bg-blue-500',
  },
  reviewing: {
    label: 'Kontrol Ediliyor',
    text: 'text-amber-400',
    badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
    solid: 'bg-amber-500',
    dot: 'bg-amber-500',
  },
  completed: {
    label: 'Tamamlandı',
    text: 'text-green-400',
    badge: 'bg-green-500/15 text-green-300 border border-green-500/25',
    solid: 'bg-green-500',
    dot: 'bg-green-500',
  },
  cancelled: {
    label: 'İptal Edildi',
    text: 'text-discord-faint',
    badge: 'bg-white/5 text-discord-faint border border-white/10 line-through',
    solid: 'bg-discord-faint',
    dot: 'bg-discord-faint',
  },
};

/** Kanban kolonlarının sırası (İptal Edildi hariç) */
export const KANBAN_COLUMNS: TaskStatus[] = [
  'pending',
  'in_progress',
  'reviewing',
  'completed',
];

// ---------------------------------------------------------------------------
// Terfi durumu
// ---------------------------------------------------------------------------
export const PROMOTION_CONFIG: Record<
  PromotionStatus,
  { label: string; badge: string; text: string; solid: string }
> = {
  ready: {
    label: 'Hazır',
    badge: 'bg-green-500/15 text-green-300 border border-green-500/25',
    text: 'text-green-400',
    solid: 'bg-green-500',
  },
  watching: {
    label: 'Yakından Takip',
    badge: 'bg-amber-500/15 text-amber-300 border border-amber-500/25',
    text: 'text-amber-400',
    solid: 'bg-amber-500',
  },
  not_ready: {
    label: 'Hazır Değil',
    badge: 'bg-white/5 text-discord-muted border border-white/10',
    text: 'text-discord-muted',
    solid: 'bg-discord-faint',
  },
};

// ---------------------------------------------------------------------------
// Performans kriterleri
// ---------------------------------------------------------------------------
export const CRITERIA_LABELS: Record<keyof PerformanceCriteria, string> = {
  activity: 'Aktiflik',
  taskCompletion: 'Görev Tamamlama',
  responsibility: 'Sorumluluk',
  communication: 'İletişim',
  teamwork: 'Takım Çalışması',
  discipline: 'Disiplin',
  quality: 'Kalite',
  training: 'Eğitim',
};

export const CRITERIA_KEYS = Object.keys(CRITERIA_LABELS) as (keyof PerformanceCriteria)[];

// ---------------------------------------------------------------------------
// Uygulama kimliği (tek merkezden yönetilir)
// ---------------------------------------------------------------------------
export const APP_NAME = 'Discord Manager Panel';
export const APP_VERSION = '0.8.3';

// ---------------------------------------------------------------------------
// Eğitim modülleri (yeni personele de aynı set atanır)
// ---------------------------------------------------------------------------
export const TRAINING_MODULES = [
  'Kurallar & Yönetmelik',
  'Moderasyon Araçları',
  'İletişim & Ton',
  'Anlaşmazlık Çözümü',
  'Kalite Kontrol Süreci',
  'Ekip Yönetimi',
] as const;

// ---------------------------------------------------------------------------
// Navigasyon
// ---------------------------------------------------------------------------
export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/personeller', label: 'Personeller', icon: Users },
  { to: '/gorevler', label: 'Görevler', icon: ClipboardList },
  { to: '/performans', label: 'Performans', icon: BarChart3 },
  { to: '/takvim', label: 'Takvim', icon: Calendar },
  { to: '/ayarlar', label: 'Ayarlar', icon: Settings },
];
