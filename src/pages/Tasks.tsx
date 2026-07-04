import { useMemo, useState, useEffect } from 'react';
import { ClipboardList, Plus, LayoutList, Columns3 } from 'lucide-react';
import type { Task, TaskPriority, TaskStatus } from '../types';
import { useData } from '../store/DataContext';
import { PRIORITY_CONFIG, STATUS_CONFIG } from '../utils/constants';
import { PageHeader, SearchInput } from '../components/ui/Common';
import { Button } from '../components/ui/Button';
import { TaskListView } from '../components/tasks/TaskListView';
import { KanbanBoard } from '../components/tasks/KanbanBoard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';

type ViewMode = 'list' | 'kanban';

export function Tasks() {
  const { data } = useData();
  const [view, setView] = useState<ViewMode>('list');

  useEffect(() => {
    console.log('[Tasks Page] Mounted/Updated - Data loaded:', {
      taskCount: data.tasks.length,
      timestamp: new Date().toISOString(),
    });
  }, [data.tasks.length]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
  const [staffFilter, setStaffFilter] = useState<string>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr');
    // Pano görünümünde kolonlar durumları temsil ettiği için durum filtresi uygulanmaz
    const applyStatus = view === 'list' && statusFilter !== 'all';
    return data.tasks
      .filter((t) => (applyStatus ? t.status === statusFilter : true))
      .filter((t) => (priorityFilter === 'all' ? true : t.priority === priorityFilter))
      .filter((t) => (staffFilter === 'all' ? true : t.staffId === staffFilter))
      .filter(
        (t) =>
          !q ||
          t.title.toLocaleLowerCase('tr').includes(q) ||
          t.description.toLocaleLowerCase('tr').includes(q) ||
          t.tags.some((tag) => tag.toLocaleLowerCase('tr').includes(q)),
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return PRIORITY_CONFIG[a.priority].order - PRIORITY_CONFIG[b.priority].order;
      });
  }, [data.tasks, search, statusFilter, priorityFilter, staffFilter, view]);

  const openEdit = (task: Task) => {
    setEditTask(task);
    setModalOpen(true);
  };
  const openNew = () => {
    setEditTask(null);
    setModalOpen(true);
  };

  return (
    <div>
      <PageHeader
        title="Görevler"
        subtitle={`${data.tasks.length} görev · ${data.tasks.filter((t) => t.status === 'completed').length} tamamlandı`}
        icon={ClipboardList}
        actions={
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-discord-border bg-discord-elevated p-0.5">
              <ViewToggle active={view === 'list'} onClick={() => setView('list')} icon={LayoutList} label="Liste" />
              <ViewToggle active={view === 'kanban'} onClick={() => setView('kanban')} icon={Columns3} label="Pano" />
            </div>
            <Button variant="primary" icon={Plus} onClick={openNew}>
              Görev Ekle
            </Button>
          </div>
        }
      />

      {/* Filtreler */}
      <div className="mb-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {view === 'list' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as TaskStatus | 'all')}
              className="input-base h-9 w-auto"
            >
              <option value="all">Tüm Durumlar</option>
              {(Object.keys(STATUS_CONFIG) as TaskStatus[]).map((s) => (
                <option key={s} value={s}>{STATUS_CONFIG[s].label}</option>
              ))}
            </select>
          )}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
            className="input-base h-9 w-auto"
          >
            <option value="all">Tüm Öncelikler</option>
            {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
              <option key={p} value={p}>{PRIORITY_CONFIG[p].emoji} {PRIORITY_CONFIG[p].label}</option>
            ))}
          </select>
          <select
            value={staffFilter}
            onChange={(e) => setStaffFilter(e.target.value)}
            className="input-base h-9 w-auto"
          >
            <option value="all">Tüm Personeller</option>
            {data.staff.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>
        <SearchInput value={search} onChange={setSearch} placeholder="Görev ara..." className="lg:w-72" />
      </div>

      {view === 'list' ? (
        <TaskListView tasks={filtered} onEdit={openEdit} />
      ) : (
        <KanbanBoard tasks={filtered} onEdit={openEdit} />
      )}

      <TaskFormModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        task={editTask}
      />
    </div>
  );
}

function ViewToggle({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: typeof LayoutList;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
        active ? 'bg-discord-blurple text-white' : 'text-discord-muted hover:text-discord-text'
      }`}
    >
      <Icon size={14} /> {label}
    </button>
  );
}
