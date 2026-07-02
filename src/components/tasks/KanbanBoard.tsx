import { useState, type DragEvent } from 'react';
import type { Task, TaskStatus } from '../../types';
import { KANBAN_COLUMNS, STATUS_CONFIG } from '../../utils/constants';
import { useData } from '../../store/DataContext';
import { TaskCard } from './TaskCard';

interface KanbanBoardProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
}

export function KanbanBoard({ tasks, onEdit }: KanbanBoardProps) {
  const { setTaskStatus } = useData();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overColumn, setOverColumn] = useState<TaskStatus | null>(null);

  const handleDrop = (status: TaskStatus) => {
    if (draggingId) {
      const task = tasks.find((t) => t.id === draggingId);
      if (task && task.status !== status) setTaskStatus(draggingId, status);
    }
    setDraggingId(null);
    setOverColumn(null);
  };

  const allowDrop = (e: DragEvent<HTMLDivElement>, status: TaskStatus) => {
    e.preventDefault();
    if (overColumn !== status) setOverColumn(status);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
      {KANBAN_COLUMNS.map((status) => {
        const cfg = STATUS_CONFIG[status];
        const columnTasks = tasks.filter((t) => t.status === status);
        const active = overColumn === status;

        return (
          <div
            key={status}
            onDragOver={(e) => allowDrop(e, status)}
            onDragLeave={() => setOverColumn((c) => (c === status ? null : c))}
            onDrop={() => handleDrop(status)}
            className={`flex flex-col rounded-2xl border bg-discord-surface/40 transition-colors ${
              active ? 'border-discord-blurple/50 bg-discord-blurple/5' : 'border-discord-line'
            }`}
          >
            <div className="flex items-center justify-between gap-2 border-b border-discord-line px-3.5 py-3">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${cfg.dot}`} />
                <span className="text-sm font-semibold text-discord-text">{cfg.label}</span>
              </div>
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-white/5 px-1.5 text-[11px] font-semibold text-discord-muted">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex min-h-[120px] flex-1 flex-col gap-2.5 p-2.5">
              {columnTasks.length === 0 ? (
                <div className="grid flex-1 place-items-center rounded-xl border border-dashed border-discord-border/40 py-8 text-center text-xs text-discord-faint">
                  {active ? 'Buraya bırak' : 'Görev yok'}
                </div>
              ) : (
                columnTasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    compact
                    draggable
                    index={i}
                    onDragStart={() => setDraggingId(task.id)}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setOverColumn(null);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
