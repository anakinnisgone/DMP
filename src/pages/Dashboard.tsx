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
  Users,
  UserCheck,
  UserPlus,
  ClipboardList,
  Calendar,
  BarChart3,
  Zap,
} from 'lucide-react';
import { useData } from '../store/DataContext';
import {
  computeDashboardStats,
  dueState,
  formatDate,
  relativeTime,
  sortByDate,
} from '../utils/helpers';
import { ROLE_CONFIG } from '../utils/constants';
import { StatCard } from '../components/ui/StatCard';
import { Card } from '../components/ui/Card';
import { SectionTitle, EmptyState, PageHeader } from '../components/ui/Common';
import { ProgressBar } from '../components/ui/ProgressBar';
import { PriorityBadge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Tooltip } from '../components/ui/Tooltip';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';

const QUICK_ACTIONS = [
  { to: '/personeller', label: 'Yeni Personel', icon: UserPlus },
  { to: '/gorevler', label: 'Yeni Görev', icon: ClipboardList },
  { to: '/takvim', label: 'Takvim', icon: Calendar },
  { to: '/performans', label: 'Performans', icon: BarChart3 },
];

export function Dashboard() {
  const { data, getStaff } = useData();
  const stats = useMemo(() => computeDashboardStats(data), [data]);

  // Son 7 gün içinde aktif olan personel
  const activeStaffCount = useMemo(() => {
    const weekAgo = Date.now() - 7 * 86400000;
    return data.staff.filter((s) => new Date(s.lastActive).getTime() >= weekAgo).length;
  }, [data.staff]);

  const recentStaff = useMemo(
    () => sortByDate(data.staff, (s) => s.createdAt).slice(0, 4),
    [data.staff],
  );
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
        subtitle="✨ Yönetim ekibinin gerçek zamanlı görünümü"
        icon={ActivityIcon}
      />

      {/* Ekip istatistikleri */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Toplam Personel" value={stats.totalStaff} icon={Users} accent="text-discord-blurple bg-discord-blurple/10" delay={0} />
        <StatCard label="Aktif Personel" value={activeStaffCount} icon={UserCheck} accent="text-emerald-400 bg-emerald-500/10" hint="son 7 gün" delay={0.04} />
        <StatCard label="Leader Staff" value={stats.leaderCount} icon={Crown} accent="text-red-400 bg-red-500/10" delay={0.08} />
        <StatCard label="Quality Assistant" value={stats.qaCount} icon={Star} accent="text-rose-400 bg-rose-500/10" delay={0.12} />
        <StatCard label="ProStaff" value={stats.prostaffCount} icon={Sprout} accent="text-blue-400 bg-blue-500/10" delay={0.16} />
      </div>

      {/* Görev istatistikleri */}
      <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Aktif Görev" value={stats.activeTasks} icon={ListChecks} accent="text-discord-blurple bg-discord-blurple/10" delay={0.2} />
        <StatCard label="Bugün Tamamlanan" value={stats.completedToday} icon={CheckCircle2} accent="text-green-400 bg-green-500/10" delay={0.24} />
        <StatCard label="Bekleyen" value={stats.pendingTasks} icon={Clock} accent="text-discord-muted bg-white/5" delay={0.28} />
        <StatCard label="Geciken" value={stats.overdueTasks} icon={AlertTriangle} accent="text-orange-400 bg-orange-500/10" delay={0.32} />
        <StatCard label="Kritik Görev" value={stats.criticalTasks} icon={Flame} accent="text-red-400 bg-red-500/10" delay={0.36} />
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

        {/* Sağ kolon: hızlı işlemler + son eklenen personeller */}
        <div className="space-y-5">
          <Card padding="lg">
            <SectionTitle icon={Zap}>Hızlı İşlemler</SectionTitle>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
                <Link
                  key={label}
                  to={to}
                  className="group flex flex-col items-center gap-1.5 rounded-xl border border-discord-border/60 bg-white/[0.02] px-2 py-3 text-center transition-all duration-150 hover:border-discord-blurple/30 hover:bg-discord-blurple/10"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-discord-blurple/10 text-discord-blurple transition-transform duration-150 group-hover:scale-110">
                    <Icon size={16} />
                  </span>
                  <span className="text-[11px] font-medium text-discord-muted group-hover:text-discord-text">
                    {label}
                  </span>
                </Link>
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <SectionTitle
              icon={UserPlus}
              action={
                <Tooltip label="Tümünü gör">
                  <Link to="/personeller" className="text-discord-faint transition-colors hover:text-discord-text">
                    <ArrowRight size={15} />
                  </Link>
                </Tooltip>
              }
            >
              Son Eklenen Personeller
            </SectionTitle>
            {recentStaff.length === 0 ? (
              <EmptyState title="Personel yok" />
            ) : (
              <ul className="space-y-1">
                {recentStaff.map((s) => (
                  <li key={s.id}>
                    <Link
                      to={`/personeller/${s.id}`}
                      className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 transition-colors hover:bg-white/[0.04]"
                    >
                      <Avatar name={s.name} src={s.avatar} size="sm" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-discord-text">{s.name}</span>
                        <span className={`block truncate text-[11px] ${ROLE_CONFIG[s.role].text}`}>
                          {ROLE_CONFIG[s.role].label}
                        </span>
                      </span>
                      <span className="shrink-0 text-[10px] text-discord-faint">
                        {relativeTime(s.createdAt)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>

        {/* Yaklaşan teslimler */}
        <Card padding="lg">
          <SectionTitle icon={CalendarClock} action={<Tooltip label="Takvime git"><Link to="/takvim" className="text-discord-faint transition-colors hover:text-discord-text"><ArrowRight size={15} /></Link></Tooltip>}>
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
          <SectionTitle icon={ListChecks} action={<Tooltip label="Görevlere git"><Link to="/gorevler" className="text-discord-faint transition-colors hover:text-discord-text"><ArrowRight size={15} /></Link></Tooltip>}>
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
