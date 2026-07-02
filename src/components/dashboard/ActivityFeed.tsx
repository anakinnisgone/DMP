import { useState } from 'react';
import {
  Activity as ActivityIcon,
  ListChecks,
  CheckCircle2,
  StickyNote,
  ShieldAlert,
  Trophy,
  Crown,
  TrendingUp,
  Trash2,
  CheckSquare,
  Square,
  X,
} from 'lucide-react';
import type { ActivityType } from '../../types';
import { useData } from '../../store/DataContext';
import { relativeTime } from '../../utils/helpers';
import { SectionTitle, EmptyState } from '../ui/Common';
import { ConfirmDialog } from '../ui/ConfirmDialog';

const ACTIVITY_ICON: Record<ActivityType, typeof ActivityIcon> = {
  task_created: ListChecks,
  task_completed: CheckCircle2,
  task_updated: ActivityIcon,
  note_added: StickyNote,
  discipline_added: ShieldAlert,
  promotion_marked: Trophy,
  staff_added: Crown,
  performance_updated: TrendingUp,
};

export function ActivityFeed() {
  const { data, deleteActivity, deleteActivities, clearActivities } = useData();
  const activities = data.activities;

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmClear, setConfirmClear] = useState(false);
  const [confirmBulk, setConfirmBulk] = useState(false);

  const exitSelect = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const runBulkDelete = () => {
    deleteActivities([...selected]);
    setConfirmBulk(false);
    exitSelect();
  };

  const runClear = () => {
    clearActivities();
    setConfirmClear(false);
    exitSelect();
  };

  return (
    <>
      <div className="mb-1 flex items-center justify-between gap-2">
        <SectionTitle icon={ActivityIcon}>Son Aktiviteler</SectionTitle>
        {activities.length > 0 && (
          <div className="flex items-center gap-1">
            {selectMode ? (
              <>
                <button
                  onClick={() => selected.size > 0 && setConfirmBulk(true)}
                  disabled={selected.size === 0}
                  className="inline-flex items-center gap-1 rounded-md bg-red-500/10 px-2 py-1 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20 disabled:opacity-40"
                >
                  <Trash2 size={13} /> Sil ({selected.size})
                </button>
                <button
                  onClick={exitSelect}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-discord-muted transition-colors hover:bg-white/5 hover:text-discord-text"
                >
                  <X size={13} /> Vazgeç
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setSelectMode(true)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-discord-muted transition-colors hover:bg-white/5 hover:text-discord-text"
                >
                  <CheckSquare size={13} /> Seç
                </button>
                <button
                  onClick={() => setConfirmClear(true)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-discord-muted transition-colors hover:bg-white/5 hover:text-red-300"
                >
                  <Trash2 size={13} /> Temizle
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {activities.length === 0 ? (
        <EmptyState title="Henüz aktivite yok" />
      ) : (
        <ul className="max-h-[22rem] space-y-1 overflow-y-auto pr-1">
          {activities.map((act) => {
            const Icon = ACTIVITY_ICON[act.type] ?? ActivityIcon;
            const isSel = selected.has(act.id);
            return (
              <li
                key={act.id}
                className={`group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors ${
                  isSel ? 'bg-discord-blurple/10' : 'hover:bg-white/[0.03]'
                }`}
              >
                {selectMode && (
                  <button
                    onClick={() => toggle(act.id)}
                    className={isSel ? 'text-discord-blurple' : 'text-discord-faint hover:text-discord-muted'}
                    aria-label={isSel ? 'Seçimi kaldır' : 'Seç'}
                  >
                    {isSel ? <CheckSquare size={16} /> : <Square size={16} />}
                  </button>
                )}
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white/5 text-discord-muted">
                  <Icon size={15} />
                </span>
                <p className="min-w-0 flex-1 truncate text-sm text-discord-text">{act.message}</p>
                <span className="shrink-0 text-[11px] text-discord-faint">
                  {relativeTime(act.createdAt)}
                </span>
                {!selectMode && (
                  <button
                    onClick={() => deleteActivity(act.id)}
                    className="shrink-0 rounded-md p-1 text-discord-faint opacity-0 transition-all hover:bg-red-500/10 hover:text-red-300 focus-within:opacity-100 group-hover:opacity-100 max-lg:opacity-100"
                    aria-label="Aktiviteyi sil"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}

      <ConfirmDialog
        open={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={runClear}
        title="Tüm aktiviteler temizlensin mi?"
        description="Aktivite akışındaki tüm kayıtlar kalıcı olarak silinecek."
        confirmLabel="Temizle"
        danger
      />
      <ConfirmDialog
        open={confirmBulk}
        onClose={() => setConfirmBulk(false)}
        onConfirm={runBulkDelete}
        title={`${selected.size} aktivite silinsin mi?`}
        description="Seçili aktivite kayıtları kalıcı olarak silinecek."
        confirmLabel="Sil"
        danger
      />
    </>
  );
}
