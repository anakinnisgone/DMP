import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Crown,
  Star,
  Sprout,
  Activity as ActivityIcon,
  ListChecks,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Flame,
  StickyNote,
  ArrowRight,
  CalendarClock,
} from 'lucide-react';
import { useData } from '../store/DataContext';
import {
  computeDashboardStats,
  dueState,
  formatDate,
  relativeTime,
  sortByDate,
} from '../utils/helpers';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { SectionTitle, EmptyState, PageHeader } from '../components/ui/Common';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PriorityBadge } from '../components/ui/Badge';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';

export function Dashboard() {
  const { data, getStaff } = useData();
  const stats = useMemo(() => computeDashboardStats(data), [data]);

  const recentTasks = useMemo(
    () => sortByDate(data.tasks, (t) => t.createdAt).slice(0, 5),
    [data.tasks],
  );
  const recentNotes = useMemo(
    () => sortByDate(data.notes, (n) => n.createdAt).slice(0, 4),
    [data.notes],
  );
  const upcoming = useMemo(
    () =>
      data.tasks
        .filter((t) => dueState(t) === 'upcoming' || dueState(t) === 'overdue')
        .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
        .slice(0, 5),
    [data.tasks],
  );

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Yönetim ekibinin genel görünümü"
        icon={ActivityIcon}
      />

      {/* Rol sayıları */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Leader Staff" value={stats.leaderCount} icon={Crown} accent="text-red-400 bg-red-500/10" delay={0} />
        <StatCard label="Quality Assistant" value={stats.qaCount} icon={Star} accent="text-rose-400 bg-rose-500/10" delay={0.04} />
        <StatCard label="ProStaff" value={stats.prostaffCount} icon={Sprout} accent="text-blue-400 bg-blue-500/10" delay={0.08} />
        <StatCard label="Aktif Görev" value={stats.activeTasks} icon={ListChecks} accent="text-discord-blurple bg-discord-blurple/10" delay={0.12} />
        <StatCard label="Bugün Tamamlanan" value={stats.completedToday} icon={CheckCircle2} accent="text-green-400 bg-green-500/10" delay={0.16} />
        <StatCard label="Bekleyen" value={stats.pendingTasks} icon={Clock} accent="text-discord-muted bg-white/5" delay={0.2} />
        <StatCard label="Geciken" value={stats.overdueTasks} icon={AlertTriangle} accent="text-orange-400 bg-orange-500/10" delay={0.24} />
        <StatCard label="Kritik Görev" value={stats.criticalTasks} icon={Flame} accent="text-red-400 bg-red-500/10" delay={0.28} />
      </div>

      {/* Genel ilerleme */}
      <Card className="mt-4" padding="lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-discord-text">Genel İlerleme</p>
            <p className="text-xs text-discord-muted">Tüm görevlerin tamamlanma oranı</p>
          </div>
          <span className="font-display text-3xl font-bold tabular-nums text-discord-text">
            %{stats.overallProgress}
          </span>
        </div>
        <ProgressBar value={stats.overallProgress} size="md" className="mt-3" />
      </Card>

      {/* Alt bölüm */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Son aktiviteler */}
        <Card className="lg:col-span-2" padding="lg">
          <ActivityFeed />
        </Card>

        {/* Yaklaşan teslimler */}
        <Card padding="lg">
          <SectionTitle icon={CalendarClock} action={<Link to="/takvim" className="text-discord-faint transition-colors hover:text-discord-text"><ArrowRight size={15} /></Link>}>
            Yaklaşan Teslimler
          </SectionTitle>
          {upcoming.length === 0 ? (
            <EmptyState title="Yaklaşan teslim yok" />
          ) : (
            <ul className="space-y-1.5">
              {upcoming.map((t) => {
                const overdue = dueState(t) === 'overdue';
                return (
                  <li key={t.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
                    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${overdue ? 'bg-red-500' : 'bg-amber-500'}`} />
                    <p className="min-w-0 flex-1 truncate text-sm text-discord-text">{t.title}</p>
                    <span className={`shrink-0 text-[11px] font-medium ${overdue ? 'text-red-400' : 'text-amber-400'}`}>
                      {formatDate(t.dueDate)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Son görevler */}
        <Card padding="lg">
          <SectionTitle icon={ListChecks} action={<Link to="/gorevler" className="text-discord-faint transition-colors hover:text-discord-text"><ArrowRight size={15} /></Link>}>
            Son Görevler
          </SectionTitle>
          {recentTasks.length === 0 ? (
            <EmptyState title="Görev yok" />
          ) : (
            <ul className="space-y-1.5">
              {recentTasks.map((t) => {
                const s = getStaff(t.staffId);
                return (
                  <li key={t.id} className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-white/[0.03]">
                    <PriorityBadge priority={t.priority} />
                    <p className="min-w-0 flex-1 truncate text-sm text-discord-text">{t.title}</p>
                    {s && <span className="shrink-0 text-[11px] text-discord-faint">{s.name.split(' ')[0]}</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        {/* Son notlar */}
        <Card padding="lg">
          <SectionTitle icon={StickyNote}>Son Notlar</SectionTitle>
          {recentNotes.length === 0 ? (
            <EmptyState title="Not yok" />
          ) : (
            <ul className="space-y-2">
              {recentNotes.map((n) => {
                const s = getStaff(n.staffId);
                return (
                  <li key={n.id} className="rounded-lg bg-white/[0.02] p-2.5">
                    <p className="line-clamp-2 text-sm text-discord-text">{n.content}</p>
                    <p className="mt-1 text-[11px] text-discord-faint">
                      {s?.name ?? 'Bilinmeyen'} · {relativeTime(n.createdAt)}
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
