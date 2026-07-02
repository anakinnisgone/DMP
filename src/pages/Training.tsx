import { useMemo, useState } from 'react';
import { GraduationCap, CheckCircle2, Circle, Search } from 'lucide-react';
import { useData } from '../store/DataContext';
import { ROLE_CONFIG, TRACK_CONFIG } from '../utils/constants';
import { trainingProgress, formatDate } from '../utils/helpers';
import { PageHeader, SearchInput, EmptyState } from '../components/ui/Common';
import { Card } from '../components/ui/Card';
import { StatCard } from '../components/ui/StatCard';
import { Avatar } from '../components/ui/Avatar';
import { RoleBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';

export function Training() {
  const { data, toggleTraining } = useData();
  const [search, setSearch] = useState('');

  const staffList = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr');
    return [...data.staff]
      .filter((s) => !q || s.name.toLocaleLowerCase('tr').includes(q))
      .sort((a, b) => trainingProgress(b) - trainingProgress(a));
  }, [data.staff, search]);

  const stats = useMemo(() => {
    const totals = data.staff.map((s) => trainingProgress(s));
    const avg = totals.length ? Math.round(totals.reduce((a, b) => a + b, 0) / totals.length) : 0;
    const fullyTrained = data.staff.filter((s) => trainingProgress(s) === 100).length;
    const inTraining = data.staff.filter((s) => {
      const p = trainingProgress(s);
      return p > 0 && p < 100;
    }).length;
    const notStarted = data.staff.filter((s) => trainingProgress(s) === 0).length;
    return { avg, fullyTrained, inTraining, notStarted };
  }, [data.staff]);

  return (
    <div>
      <PageHeader
        title="Eğitim"
        subtitle="Personel eğitim modülleri ve ilerleme takibi"
        icon={GraduationCap}
        actions={<SearchInput value={search} onChange={setSearch} placeholder="Personel ara..." className="w-56" />}
      />

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Ortalama İlerleme" value={`%${stats.avg}`} icon={GraduationCap} accent="text-discord-blurple bg-discord-blurple/10" />
        <StatCard label="Eğitimi Tamamlanan" value={stats.fullyTrained} icon={CheckCircle2} accent="text-green-400 bg-green-500/10" delay={0.04} />
        <StatCard label="Eğitimde" value={stats.inTraining} icon={Circle} accent="text-amber-400 bg-amber-500/10" delay={0.08} />
        <StatCard label="Başlamayan" value={stats.notStarted} icon={Circle} accent="text-discord-muted bg-white/5" delay={0.12} />
      </div>

      {staffList.length === 0 ? (
        <EmptyState icon={Search} title="Personel bulunamadı" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {staffList.map((s) => {
            const progress = trainingProgress(s);
            const cfg = ROLE_CONFIG[s.role];
            return (
              <Card key={s.id} padding="lg">
                <div className="flex items-center gap-3">
                  <Avatar name={s.name} src={s.avatar} role={s.role} size="md" ring />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display font-bold text-discord-text">{s.name}</p>
                    <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
                      <RoleBadge role={s.role} showIcon={false} />
                      {s.role === 'prostaff' && s.track && (
                        <span className="text-[11px] text-discord-faint">
                          {TRACK_CONFIG[s.track].emoji} {TRACK_CONFIG[s.track].label}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`font-display text-xl font-bold tabular-nums ${cfg.text}`}>%{progress}</span>
                </div>

                <ProgressBar value={progress} className="mt-3" size="md" color={cfg.solid} />

                <div className="mt-3 grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                  {s.trainingRecords.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => toggleTraining(s.id, r.id)}
                      className={`flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
                        r.completed
                          ? 'bg-green-500/10 text-discord-text'
                          : 'bg-white/[0.02] text-discord-muted hover:bg-white/5'
                      }`}
                    >
                      {r.completed ? (
                        <CheckCircle2 size={16} className="shrink-0 text-green-400" />
                      ) : (
                        <Circle size={16} className="shrink-0 text-discord-faint" />
                      )}
                      <span className="min-w-0 flex-1 truncate">{r.name}</span>
                    </button>
                  ))}
                </div>

                <p className="mt-2.5 text-[11px] text-discord-faint">
                  Son eğitim tarihi: {formatDate(s.lastTrainingDate)}
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
