import type { Task } from '../../types';
import { EmptyState } from '../ui/Common';
import { TaskCard } from './TaskCard';
import { ClipboardList } from 'lucide-react';

interface TaskListViewProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  showStaff?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}

export function TaskListView({
  tasks,
  onEdit,
  showStaff = true,
  emptyTitle = 'Görev bulunamadı',
  emptyDescription = 'Filtreleri değiştirin ya da yeni bir görev ekleyin.',
}: TaskListViewProps) {
  if (tasks.length === 0) {
    return <EmptyState icon={ClipboardList} title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task, i) => (
        <TaskCard key={task.id} task={task} onEdit={onEdit} showStaff={showStaff} index={i} />
      ))}
    </div>
  );
}
