import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Pin, ListChecks, Clock, Check } from 'lucide-react';
import type { Staff, Task } from '../../types';
import { ROLE_CONFIG, TRACK_CONFIG } from '../../utils/constants';
import { Avatar } from '../ui/Avatar';
import { RoleBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { staffProgress, staffTaskCounts } from '../../utils/helpers';

interface StaffCardProps {
  staff: Staff;
  tasks: Task[];
  index?: number;
  selectable?: boolean;
  selected?: boolean;
  onSelectToggle?: (id: string) => void;
}

export function StaffCard({
  staff,
  tasks,
  index = 0,
  selectable = false,
  selected = false,
  onSelectToggle,
}: StaffCardProps) {
  const navigate = useNavigate();
  const cfg = ROLE_CONFIG[staff.role];
  const counts = staffTaskCounts(tasks, staff.id);
  const progress = staffProgress(tasks, staff.id);

  const handleClick = () => {
    if (selectable) onSelectToggle?.(staff.id);
    else navigate(`/personeller/${staff.id}`);
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: Math.min(index * 0.03, 0.3) }}
      onClick={handleClick}
      className={`group relative overflow-hidden rounded-2xl border bg-discord-card/70 p-4 text-left shadow-glow backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 hover:bg-discord-card/90 ${
        selected ? 'border-discord-blurple ring-2 ring-discord-blurple/40' : cfg.border
      }`}
    >
      {/* Üst renk aksanı */}
      <span className={`absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${cfg.accent}`} />

      {/* Seçim kutusu */}
      {selectable && (
        <span
          className={`absolute left-3 top-3 z-10 grid h-5 w-5 place-items-center rounded-md border transition-colors ${
            selected
              ? 'border-discord-blurple bg-discord-blurple text-white'
              : 'border-discord-border bg-discord-bg/60 text-transparent'
          }`}
        >
          <Check size={13} />
        </span>
      )}

      {staff.pinned && (
        <Pin
          size={14}
          className="absolute right-3 top-3 rotate-45 fill-discord-blurple text-discord-blurple"
        />
      )}

      <div className={`flex items-center gap-3 ${selectable ? 'pl-7' : ''}`}>
        <Avatar name={staff.name} src={staff.avatar} role={staff.role} size="lg" ring />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-bold text-discord-text">{staff.name}</p>
          <p className="truncate text-xs text-discord-faint">{staff.discordUsername}</p>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <RoleBadge role={staff.role} />
            {staff.role === 'prostaff' && staff.track && (
              <span className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-discord-muted">
                {TRACK_CONFIG[staff.track].emoji} {TRACK_CONFIG[staff.track].label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Performans */}
      <div className="mt-4 flex items-end justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-discord-faint">
            Performans
          </p>
          <p className={`font-display text-xl font-bold tabular-nums ${cfg.text}`}>
            {staff.performanceScore}
            <span className="text-sm text-discord-faint">/100</span>
          </p>
        </div>
        <div className="flex gap-3 text-right">
          <div>
            <p className="flex items-center gap-1 text-[11px] text-discord-faint">
              <ListChecks size={11} /> Aktif
            </p>
            <p className="font-semibold tabular-nums text-discord-text">{counts.active}</p>
          </div>
          <div>
            <p className="flex items-center gap-1 text-[11px] text-discord-faint">
              <Clock size={11} /> Bekleyen
            </p>
            <p className="font-semibold tabular-nums text-discord-text">{counts.pending}</p>
          </div>
        </div>
      </div>

      {/* İlerleme */}
      <div className="mt-3">
        <ProgressBar value={progress} showLabel color={cfg.solid} />
      </div>
    </motion.button>
  );
}
