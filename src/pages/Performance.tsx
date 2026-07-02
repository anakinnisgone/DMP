import { useMemo } from 'react';
import {
  BarChart3,
  Trophy,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Award,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
} from 'recharts';
import { useData } from '../store/DataContext';
import {
  CRITERIA_KEYS,
  CRITERIA_LABELS,
  ROLE_CONFIG,
} from '../utils/constants';
import { staffTaskCounts } from '../utils/helpers';
import { PageHeader, SectionTitle } from '../components/ui/Common';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Avatar } from '../components/ui/Avatar';
import { ProgressBar } from '../components/ui/ProgressBar';

const ROLE_HEX: Record<string, string> = {
  leader: '#ef4444',
  qa: '#f43f5e',
  prostaff: '#3b82f6',
};

export function Performance() {
  const { data } = useData();

  const enriched = useMemo(
    () =>
      data.staff.map((s) => ({
        staff: s,
        completed: staffTaskCounts(data.tasks, s.id).completed,
      })),
    [data.staff, data.tasks],
  );

  const stats = useMemo(() => {
    const scores = data.staff.map((s) => s.performanceScore);
    const disc = data.staff.map((s) => s.disciplineScore);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0;
    const avgDisc = disc.length ? Math.round(disc.reduce((a, b) => a + b, 0) / disc.length) : 0;
    const top = [...data.staff].sort((a, b) => b.performanceScore - a.performanceScore)[0];
    const totalCompleted = data.tasks.filter((t) => t.status === 'completed').length;
    return { avg, avgDisc, top, totalCompleted };
  }, [data.staff, data.tasks]);

  const topPerformers = useMemo(
    () => [...data.staff].sort((a, b) => b.performanceScore - a.performanceScore).slice(0, 5),
    [data.staff],
  );
  const needsImprovement = useMemo(
    () => [...data.staff].sort((a, b) => a.performanceScore - b.performanceScore).slice(0, 5),
    [data.staff],
  );
  const mostCompleted = useMemo(
    () => [...enriched].sort((a, b) => b.completed - a.completed).slice(0, 5),
    [enriched],
  );

  const perfChartData = useMemo(
    () =>
      [...data.staff]
        .sort((a, b) => b.performanceScore - a.performanceScore)
        .slice(0, 8)
        .map((s) => ({
          name: s.name.split(' ')[0],
          value: s.performanceScore,
          role: s.role,
        })),
    [data.staff],
  );

  const criteriaChartData = useMemo(
    () =>
      CRITERIA_KEYS.map((k) => {
        const avg =
          data.staff.length === 0
            ? 0
            : Math.round(data.staff.reduce((a, s) => a + s.performance[k], 0) / data.staff.length);
        return { name: CRITERIA_LABELS[k], value: avg };
      }),
    [data.staff],
  );

  return (
    <div>
      <PageHeader title="Performans" subtitle="Ekip performansı, kriterler ve sıralamalar" icon={BarChart3} />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Ortalama Performans" value={stats.avg} icon={BarChart3} accent="text-discord-blurple bg-discord-blurple/10" />
        <StatCard label="Ortalama Disiplin" value={stats.avgDisc} icon={Award} accent="text-green-400 bg-green-500/10" delay={0.04} />
        <StatCard label="En Başarılı" value={stats.top?.name.split(' ')[0] ?? '—'} icon={Trophy} accent="text-amber-400 bg-amber-500/10" delay={0.08} />
        <StatCard label="Tamamlanan Görev" value={stats.totalCompleted} icon={CheckCircle2} accent="text-green-400 bg-green-500/10" delay={0.12} />
      </div>

      {/* Grafikler */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card padding="lg">
          <SectionTitle icon={BarChart3}>Performans Skorları (İlk 8)</SectionTitle>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={perfChartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2b30" vertical={false} />
                <XAxis dataKey="name" tick={{ fill: '#9aa0a8', fontSize: 12 }} axisLine={{ stroke: '#2a2b30' }} tickLine={false} />
                <YAxis domain={[0, 100]} tick={{ fill: '#9aa0a8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{ background: '#232428', border: '1px solid #3a3c42', borderRadius: 12, color: '#e3e5e8', fontSize: 12 }}
                  labelStyle={{ color: '#9aa0a8' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {perfChartData.map((d, i) => (
                    <Cell key={i} fill={ROLE_HEX[d.role]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="lg">
          <SectionTitle icon={BarChart3}>Kriter Ortalamaları</SectionTitle>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={criteriaChartData} layout="vertical" margin={{ top: 4, right: 12, left: 24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2b30" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fill: '#9aa0a8', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="name" width={92} tick={{ fill: '#9aa0a8', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{ background: '#232428', border: '1px solid #3a3c42', borderRadius: 12, color: '#e3e5e8', fontSize: 12 }}
                />
                <Bar dataKey="value" fill="#5865f2" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Sıralamalar */}
      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <LeaderboardCard title="En Başarılı" icon={TrendingUp} items={topPerformers.map((s) => ({ staff: s, value: s.performanceScore, suffix: '/100' }))} />
        <LeaderboardCard title="En Çok Tamamlayan" icon={CheckCircle2} items={mostCompleted.map((e) => ({ staff: e.staff, value: e.completed, suffix: ' görev' }))} accentBar />
        <LeaderboardCard title="Gelişmesi Gerekenler" icon={TrendingDown} items={needsImprovement.map((s) => ({ staff: s, value: s.performanceScore, suffix: '/100' }))} />
      </div>
    </div>
  );
}

function LeaderboardCard({
  title,
  icon: Icon,
  items,
  accentBar = false,
}: {
  title: string;
  icon: typeof TrendingUp;
  items: { staff: import('../types').Staff; value: number; suffix?: string }[];
  accentBar?: boolean;
}) {
  return (
    <Card padding="lg">
      <SectionTitle icon={Icon}>{title}</SectionTitle>
      <ul className="space-y-2.5">
        {items.map((item, i) => {
          const cfg = ROLE_CONFIG[item.staff.role];
          return (
            <li key={item.staff.id} className="flex items-center gap-3">
              <span className="w-4 text-center text-sm font-bold tabular-nums text-discord-faint">{i + 1}</span>
              <Avatar name={item.staff.name} src={item.staff.avatar} role={item.staff.role} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-discord-text">{item.staff.name}</p>
                {accentBar ? (
                  <p className="text-[11px] text-discord-faint">{ROLE_CONFIG[item.staff.role].label}</p>
                ) : (
                  <ProgressBar value={item.value} color={cfg.solid} />
                )}
              </div>
              <span className={`shrink-0 text-sm font-bold tabular-nums ${cfg.text}`}>
                {item.value}
                <span className="text-[11px] text-discord-faint">{item.suffix}</span>
              </span>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
