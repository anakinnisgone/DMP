import { useState } from 'react';
import { ListChecks, Plus } from 'lucide-react';
import type { Task } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SectionTitle, EmptyState } from '../ui/Common';
import { TaskCard } from '../tasks/TaskCard';
import { TaskFormModal } from '../tasks/TaskFormModal';

interface StaffTasksSectionProps {
  staffId: string;
  tasks: Task[];
}

export function StaffTasksSection({ staffId, tasks }: StaffTasksSectionProps) {
  const [taskModal, setTaskModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);

  const openNewTask = () => {
    setEditTask(null);
    setTaskModal(true);
  };

  const openEditTask = (task: Task) => {
    setEditTask(task);
    setTaskModal(true);
  };

  const activeTasks = tasks.filter((t) => t.status !== 'completed').length;
  const completedTasks = tasks.filter((t) => t.status === 'completed').length;

  return (
    <>
      <Card padding="lg">
        <SectionTitle
          icon={ListChecks}
          action={<Button variant="primary" size="sm" icon={Plus} onClick={openNewTask}>Görev Ekle</Button>}
        >
          Görevler ({activeTasks} Aktif / {completedTasks} Tamamlanan)
        </SectionTitle>

        {tasks.length === 0 ? (
          <EmptyState title="Görev yok" description="Bu personele henüz görev atanmamış" />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} onEdit={openEditTask} />
            ))}
          </div>
        )}
      </Card>

      <TaskFormModal open={taskModal} onClose={() => setTaskModal(false)} task={editTask} defaultStaffId={staffId} />
    </>
  );
}
