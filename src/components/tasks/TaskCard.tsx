import { useState, type DragEvent, type ReactNode } from 'react';
import { motion } from 'framer-motion';
import {
  Pin,
  Pencil,
  Trash2,
  Check,
  Play,
  Pause,
  CalendarClock,
  User2,
  GripVertical,
} from 'lucide-react';
import type { Task } from '../../types';
import { PriorityBadge, StatusBadge } from '../ui/Badge';
import { ProgressBar } from '../ui/ProgressBar';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Avatar } from '../ui/Avatar';
import { useData } from '../../store/DataContext';
import { dueState, formatDate } from '../../utils/helpers';

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  showStaff?: boolean;
  compact?: boolean;
  draggable?: boolean;
  onDragStart?: (e: DragEvent<HTMLDivElement>) => void;
  onDragEnd?: (e: DragEvent<HTMLDivElement>) => void;
  index?: number;
}

const DUE_STYLE: Record<string, string> = {
  overdue: 'text-red-400',
  upcoming: 'text-amber-400',
  later: 'text-discord-muted',
  none: 'text-discord-faint',
  done: 'text-green-400',
};

export function TaskCard({
  task,
  onEdit,
  showStaff = true,
  compact = false,
  draggable = false,
  onDragStart,
  onDragEnd,
  index = 0,
}: TaskCardProps) {
  const { getStaff, setTaskStatus, togglePinTask, deleteTask } = useData();
  const [confirm, setConfirm] = useState(false);
  const staff = getStaff(task.staffId);
  const due = dueState(task);
  const isDone = task.status === 'completed';

  const cardClass = `group relative rounded-xl border border-discord-border/70 bg-discord-card/80 p-3 shadow-glow backdrop-blur-sm transition-colors hover:border-discord-border ${
    draggable ? 'cursor-grab active:cursor-grabbing' : ''
  } ${task.pinned ? 'ring-1 ring-discord-blurple/40' : ''}`;

  const inner: ReactNode = (
    <div className="flex items-start gap-2">
      {draggable && (
        <GripVertical
          size={15}
          className="mt-0.5 shrink-0 text-discord-faint opacity-0 transition-opacity group-hover:opacity-100"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`min-w-0 font-semibold leading-snug text-discord-text ${
              compact ? 'text-sm' : ''
            } ${isDone ? 'text-discord-muted line-through' : ''}`}
          >
            {task.title}
          </p>
          {task.pinned && (
            <Pin size={13} className="mt-0.5 shrink-0 rotate-45 fill-discord-blurple text-discord-blurple" />
          )}
        </div>

        {!compact && task.description && (
          <p className="mt-1 line-clamp-2 text-xs text-discord-muted">{task.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <PriorityBadge priority={task.priority} />
          {!compact && <StatusBadge status={task.status} />}
          {task.dueDate && (
            <span className={`inline-flex items-center gap-1 text-[11px] font-medium ${DUE_STYLE[due]}`}>
              <CalendarClock size={11} />
              {formatDate(task.dueDate)}
            </span>
          )}
        </div>

        {task.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {task.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] font-medium text-discord-faint"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {task.status !== 'pending' && task.status !== 'cancelled' && (
          <div className="mt-2.5">
            <ProgressBar value={task.progress} showLabel />
          </div>
        )}

        <div className="mt-2.5 flex items-center justify-between gap-2">
          {showStaff && staff ? (
            <div className="flex min-w-0 items-center gap-1.5">
              <Avatar name={staff.name} src={staff.avatar} role={staff.role} size="sm" />
              <span className="truncate text-[11px] text-discord-muted">{staff.name}</span>
            </div>
          ) : (
            <span className="flex items-center gap-1 text-[11px] text-discord-faint">
              <User2 size={11} /> {task.assignedBy}
            </span>
          )}

          {/* Hızlı aksiyonlar — mobilde görünür, masaüstünde hover ile açılır */}
          <div className="flex shrink-0 items-center gap-0.5 opacity-100 transition-opacity focus-within:opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
            {!isDone && (
              <IconAction label="Tamamla" onClick={() => setTaskStatus(task.id, 'completed')} className="hover:text-green-400">
                <Check size={14} />
              </IconAction>
            )}
            {task.status === 'pending' && (
              <IconAction label="Başlat" onClick={() => setTaskStatus(task.id, 'in_progress')} className="hover:text-blue-400">
                <Play size={13} />
              </IconAction>
            )}
            {task.status === 'in_progress' && (
              <IconAction label="Beklemeye al" onClick={() => setTaskStatus(task.id, 'pending')} className="hover:text-amber-400">
                <Pause size={13} />
              </IconAction>
            )}
            <IconAction
              label="Sabitle"
              onClick={() => togglePinTask(task.id)}
              className={task.pinned ? 'text-discord-blurple' : 'hover:text-discord-text'}
            >
              <Pin size={13} />
            </IconAction>
            {onEdit && (
              <IconAction label="Düzenle" onClick={() => onEdit(task)} className="hover:text-discord-text">
                <Pencil size={13} />
              </IconAction>
            )}
            <IconAction label="Sil" onClick={() => setConfirm(true)} className="hover:text-red-400">
              <Trash2 size={13} />
            </IconAction>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {draggable ? (
        <div
          draggable
          onDragStart={onDragStart}
          onDragEnd={onDragEnd}
          className={`${cardClass} animate-slide-up`}
        >
          {inner}
        </div>
      ) : (
        <motion.div
          layout
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: Math.min(index * 0.02, 0.2) }}
          className={cardClass}
        >
          {inner}
        </motion.div>
      )}

      <ConfirmDialog
        open={confirm}
        onClose={() => setConfirm(false)}
        onConfirm={() => deleteTask(task.id)}
        title="Görev silinsin mi?"
        description={`"${task.title}" görevi kalıcı olarak silinecek.`}
        confirmLabel="Sil"
        danger
      />
    </>
  );
}

function IconAction({
  children,
  label,
  onClick,
  className = '',
}: {
  children: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={`grid h-7 w-7 place-items-center rounded-md text-discord-muted transition-colors hover:bg-white/5 ${className}`}
    >
      {children}
    </button>
  );
}
