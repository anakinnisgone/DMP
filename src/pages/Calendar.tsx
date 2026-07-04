import { useMemo, useState } from 'react';
import {
  CalendarDays,
  CalendarRange,
  CalendarClock,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunrise,
  AlertTriangle,
  Clock,
  CheckCircle2,
  ListChecks,
  Inbox,
} from 'lucide-react';
import type { Task } from '../types';
import { useData } from '../store/DataContext';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../utils/constants';
import { dueState, sameDay, formatDate, relativeTime } from '../utils/helpers';
import { PageHeader } from '../components/ui/Common';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Avatar } from '../components/ui/Avatar';
import { RoleBadge, PriorityBadge, StatusBadge } from '../components/ui/Badge';

// ---------------------------------------------------------------------------
// Tarih yardımcıları
// ---------------------------------------------------------------------------
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};
const mondayOf = (d: Date) => {
  const x = startOfDay(d);
  const offset = (x.getDay() + 6) % 7; // Pazartesi = 0
  return addDays(x, -offset);
};

const WEEKDAYS_SHORT = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
const MONTHS_SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

const DUE_TEXT: Record<string, string> = {
  overdue: 'text-red-400',
  upcoming: 'text-amber-400',
  later: 'text-discord-muted',
  done: 'text-green-400',
  none: 'text-discord-faint',
};

const isOpen = (t: Task) => t.status !== 'completed' && t.status !== 'cancelled';
const byPriority = (a: Task, b: Task) =>
  PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
const byDueThenPriority = (a: Task, b: Task) => {
  const da = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
  const db = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
  return da === db ? byPriority(a, b) : da - db;
};

export function Calendar() {
  const { data } = useData();
  const [weekOffset, setWeekOffset] = useState(0);

  const today = useMemo(() => startOfDay(new Date()), []);
  const tomorrow = useMemo(() => addDays(today, 1), [today]);

  // -------------------------------------------------------------------------
  // Bölüm hesaplamaları (gerçek "bugün"e göre)
  // -------------------------------------------------------------------------
  const sections = useMemo(() => {
    const withDue = data.tasks.filter((t) => t.dueDate);
    const weekStart = mondayOf(today);
    const weekEnd = addDays(weekStart, 7); // Pazar sonu (dahil değil)
    const next7End = addDays(today, 7);

    const todayTasks = withDue
      .filter((t) => isOpen(t) && sameDay(new Date(t.dueDate!), today))
      .sort(byPriority);

    const tomorrowTasks = withDue
      .filter((t) => isOpen(t) && sameDay(new Date(t.dueDate!), tomorrow))
      .sort(byPriority);

    const thisWeekTasks = withDue
      .filter((t) => {
        if (!isOpen(t)) return false;
        const d = new Date(t.dueDate!).getTime();
        return d >= weekStart.getTime() && d < weekEnd.getTime();
      })
      .sort(byDueThenPriority);

    const overdueTasks = data.tasks.filter((t) => dueState(t) === 'overdue').sort(byDueThenPriority);

    const next7Tasks = withDue
      .filter((t) => {
        if (!isOpen(t)) return false;
        const d = new Date(t.dueDate!).getTime();
        return d >= today.getTime() && d < next7End.getTime();
      })
      .sort(byDueThenPriority);

    const completedToday = data.tasks
      .filter((t) => t.status === 'completed' && t.completedAt && sameDay(new Date(t.completedAt), today))
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

    return { todayTasks, tomorrowTasks, thisWeekTasks, overdueTasks, next7Tasks, completedToday };
  }, [data.tasks, today, tomorrow]);

  // -------------------------------------------------------------------------
  // Haftalık plan (gezilebilir)
  // -------------------------------------------------------------------------
  const week = useMemo(() => {
    const start = mondayOf(addDays(today, weekOffset * 7));
    const days = Array.from({ length: 7 }, (_, i) => {
      const date = addDays(start, i);
      const tasks = data.tasks
        .filter((t) => t.dueDate && sameDay(new Date(t.dueDate), date))
        .sort(byPriority);
      return { date, tasks };
    });
    const end = addDays(start, 6);
    const range =
      start.getMonth() === end.getMonth()
        ? `${start.getDate()}–${end.getDate()} ${MONTHS_SHORT[end.getMonth()]}`
        : `${start.getDate()} ${MONTHS_SHORT[start.getMonth()]} – ${end.getDate()} ${MONTHS_SHORT[end.getMonth()]}`;
    return { start, days, range };
  }, [data.tasks, today, weekOffset]);

  return (
    <div>
      <PageHeader
        title="Takvim"
        subtitle="Haftalık ve günlük görev planı"
        icon={CalendarDays}
      />

      {/* Özet sayaçlar */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Bugün" value={sections.todayTasks.length} icon={Sun} accent="text-discord-blurple bg-discord-blurple/10" />
        <StatCard label="Yarın" value={sections.tomorrowTasks.length} icon={Sunrise} accent="text-amber-400 bg-amber-500/10" delay={0.04} />
        <StatCard label="Geciken" value={sections.overdueTasks.length} icon={AlertTriangle} accent="text-red-400 bg-red-500/10" delay={0.08} />
        <StatCard label="Bu Hafta" value={sections.thisWeekTasks.length} icon={CalendarRange} accent="text-blue-400 bg-blue-500/10" delay={0.12} />
        <StatCard label="Bugün Tamamlanan" value={sections.completedToday.length} icon={CheckCircle2} accent="text-green-400 bg-green-500/10" delay={0.16} />
      </div>

      {/* Bugün / Yarın */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PlanSection icon={Sun} title="Bugünkü Görevler" accent="text-discord-blurple" count={sections.todayTasks.length}
          tasks={sections.todayTasks} emptyText="Bugün için planlanmış görev yok." />
        <PlanSection icon={Sunrise} title="Yarınki Görevler" accent="text-amber-400" count={sections.tomorrowTasks.length}
          tasks={sections.tomorrowTasks} emptyText="Yarın için planlanmış görev yok." />
      </div>

      {/* Geciken / Önümüzdeki 7 gün */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PlanSection icon={AlertTriangle} title="Geciken Görevler" accent="text-red-400" count={sections.overdueTasks.length}
          tasks={sections.overdueTasks} emptyText="Geciken görev yok 🎉" />
        <PlanSection icon={Clock} title="Önümüzdeki 7 Gün" accent="text-orange-400" count={sections.next7Tasks.length}
          tasks={sections.next7Tasks} emptyText="Önümüzdeki 7 günde görev yok." />
      </div>

      {/* Bu hafta tamamlanacak / Bugün tamamlanan */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <PlanSection icon={ListChecks} title="Bu Hafta Tamamlanacak" accent="text-blue-400" count={sections.thisWeekTasks.length}
          tasks={sections.thisWeekTasks} emptyText="Bu hafta için açık görev yok." />
        <PlanSection icon={CheckCircle2} title="Bugün Tamamlanan" accent="text-green-400" count={sections.completedToday.length}
          tasks={sections.completedToday} emptyText="Bugün henüz görev tamamlanmadı." showCompletedAt />
      </div>

      {/* Haftalık plan (Pzt-Paz) */}
      <div className="mt-6">
        <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-discord-blurple/10 text-discord-blurple">
              <CalendarRange size={17} />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-discord-text">Haftalık Plan</h2>
              <p className="text-xs text-discord-faint">
                {week.range}
                {weekOffset === 0 && <span className="ml-1.5 text-discord-blurple">· Bu hafta</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setWeekOffset((w) => w - 1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-discord-border bg-discord-elevated text-discord-muted transition-colors hover:text-discord-text"
              aria-label="Önceki hafta"
            >
              <ChevronLeft size={17} />
            </button>
            <button
              onClick={() => setWeekOffset(0)}
              disabled={weekOffset === 0}
              className="rounded-lg border border-discord-border bg-discord-elevated px-3 py-2 text-xs font-semibold text-discord-muted transition-colors hover:text-discord-text disabled:opacity-40"
            >
              Bugün
            </button>
            <button
              onClick={() => setWeekOffset((w) => w + 1)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-discord-border bg-discord-elevated text-discord-muted transition-colors hover:text-discord-text"
              aria-label="Sonraki hafta"
            >
              <ChevronRight size={17} />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto pb-1">
          <div className="flex gap-2.5">
            {week.days.map((day, i) => {
              const isToday = sameDay(day.date, today);
              return (
                <div
                  key={i}
                  className={`flex min-w-[160px] flex-1 flex-col rounded-2xl border ${
                    isToday ? 'border-discord-blurple/50 bg-discord-blurple/[0.06]' : 'border-discord-line bg-discord-surface/40'
                  }`}
                >
                  <div className={`flex items-center justify-between border-b px-3 py-2.5 ${
                    isToday ? 'border-discord-blurple/30' : 'border-discord-line'
                  }`}>
                    <div>
                      <p className={`text-xs font-bold ${isToday ? 'text-discord-blurple' : 'text-discord-text'}`}>
                        {WEEKDAYS_SHORT[i]}
                      </p>
                      <p className="text-[11px] text-discord-faint">
                        {day.date.getDate()} {MONTHS_SHORT[day.date.getMonth()]}
                      </p>
                    </div>
                    {day.tasks.length > 0 && (
                      <span className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold ${
                        isToday ? 'bg-discord-blurple/20 text-discord-blurple' : 'bg-white/5 text-discord-muted'
                      }`}>
                        {day.tasks.length}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-1.5 p-2">
                    {day.tasks.length === 0 ? (
                      <p className="py-6 text-center text-[11px] text-discord-faint">—</p>
                    ) : (
                      day.tasks.map((t) => <MiniTaskCard key={t.id} task={t} />)
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-3 hidden flex-wrap items-center gap-3 text-[11px] text-discord-muted sm:flex">
          <span className="font-semibold text-discord-faint">Öncelik:</span>
          {(Object.keys(PRIORITY_CONFIG) as Array<keyof typeof PRIORITY_CONFIG>).map((p) => (
            <span key={p} className="inline-flex items-center gap-1">
              <span className={`h-2 w-2 rounded-full ${PRIORITY_CONFIG[p].solid}`} />
              {PRIORITY_CONFIG[p].label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Bölüm sarmalayıcı
// ---------------------------------------------------------------------------
function PlanSection({
  icon: Icon,
  title,
  accent,
  count,
  tasks,
  emptyText,
  showCompletedAt = false,
}: {
  icon: typeof Sun;
  title: string;
  accent: string;
  count: number;
  tasks: Task[];
  emptyText: string;
  showCompletedAt?: boolean;
}) {
  return (
    <Card padding="lg">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={17} className={accent} />
          <h3 className="font-display text-sm font-bold text-discord-text">{title}</h3>
        </div>
        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/5 px-1.5 text-[11px] font-semibold text-discord-muted">
          {count}
        </span>
      </div>
      {tasks.length === 0 ? (
        <div className="flex items-center gap-2.5 rounded-xl bg-white/[0.02] px-3 py-5 text-sm text-discord-faint">
          <Inbox size={16} />
          {emptyText}
        </div>
      ) : (
        <div className="space-y-2.5">
          {tasks.map((t) => (
            <PlanTaskCard key={t.id} task={t} showCompletedAt={showCompletedAt} />
          ))}
        </div>
      )}
    </Card>
  );
}

// ---------------------------------------------------------------------------
// Tam görev kartı
// ---------------------------------------------------------------------------
function PlanTaskCard({ task, showCompletedAt = false }: { task: Task; showCompletedAt?: boolean }) {
  const { getStaff } = useData();
  const staff = getStaff(task.staffId);
  const due = dueState(task);

  return (
    <div className="animate-slide-up rounded-xl border border-discord-border/60 bg-discord-card/70 p-3 transition-colors hover:border-discord-border">
      <div className="flex items-start gap-2.5">
        <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${PRIORITY_CONFIG[task.priority].solid}`} />
        <div className="min-w-0 flex-1">
          <p className={`font-semibold leading-snug text-discord-text ${task.status === 'completed' ? 'line-through opacity-70' : ''}`}>
            {task.title}
          </p>

          {/* Personel + rol */}
          {staff ? (
            <div className="mt-1.5 flex items-center gap-1.5">
              <Avatar name={staff.name} src={staff.avatar} role={staff.role} size="sm" />
              <span className="truncate text-xs text-discord-muted">{staff.name}</span>
              <RoleBadge role={staff.role} showIcon={false} />
            </div>
          ) : (
            <p className="mt-1.5 text-xs text-discord-faint">Personel atanmamış</p>
          )}

          {/* Öncelik + durum + tarih */}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            <PriorityBadge priority={task.priority} />
            <StatusBadge status={task.status} />
            {showCompletedAt && task.completedAt ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-green-400">
                <CheckCircle2 size={11} />
                {relativeTime(task.completedAt)}
              </span>
            ) : (
              task.dueDate && (
                <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${DUE_TEXT[due]}`}>
                  <CalendarClock size={11} />
                  {formatDate(task.dueDate)}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Kompakt görev kartı (haftalık plan sütunları)
// ---------------------------------------------------------------------------
function MiniTaskCard({ task }: { task: Task }) {
  const { getStaff } = useData();
  const staff = getStaff(task.staffId);
  const pri = PRIORITY_CONFIG[task.priority];
  const st = STATUS_CONFIG[task.status];

  return (
    <div className={`rounded-lg border-l-[3px] bg-discord-card/70 p-2 shadow-sm ${priorityBorder(task.priority)}`}>
      <p
        className={`truncate text-xs font-semibold text-discord-text ${
          task.status === 'completed' ? 'line-through opacity-60' : ''
        }`}
        title={task.title}
      >
        {task.title}
      </p>
      {staff && (
        <div className="mt-1 flex items-center gap-1.5">
          <Avatar name={staff.name} src={staff.avatar} role={staff.role} size="sm" />
          <span className="truncate text-[11px] text-discord-muted">{staff.name}</span>
        </div>
      )}
      <div className="mt-1.5 flex items-center gap-1.5">
        <span className={`inline-flex items-center rounded px-1 py-0.5 text-[10px] font-semibold ${pri.badge}`}>
          {pri.emoji} {pri.label}
        </span>
        <span className="inline-flex items-center gap-1 text-[10px] text-discord-muted">
          <span className={`h-1.5 w-1.5 rounded-full ${st.dot}`} />
          {st.label}
        </span>
      </div>
    </div>
  );
}

function priorityBorder(p: Task['priority']): string {
  switch (p) {
    case 'critical':
      return 'border-red-500';
    case 'high':
      return 'border-orange-500';
    case 'medium':
      return 'border-yellow-500';
    default:
      return 'border-green-500';
  }
}
