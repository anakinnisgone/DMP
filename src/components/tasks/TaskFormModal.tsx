import { useEffect, useState, useCallback, type ReactNode } from 'react';
import type { Task, TaskFrequency, TaskPriority, TaskStatus } from '../../types';
import { OWNER_NAME, PRIORITY_CONFIG, STATUS_CONFIG } from '../../utils/constants';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../store/DataContext';
import { toDateInput, fromDateInput, progressForStatus, STATUS_ORDER } from '../../utils/helpers';

interface TaskFormModalProps {
  open: boolean;
  onClose: () => void;
  task?: Task | null;
  defaultStaffId?: string;
}

const FREQUENCIES: { value: TaskFrequency; label: string }[] = [
  { value: 'once', label: 'Tek Seferlik' },
  { value: 'daily', label: 'Günlük' },
  { value: 'weekly', label: 'Haftalık' },
];

export function TaskFormModal({ open, onClose, task, defaultStaffId }: TaskFormModalProps) {
  const { data, addTask, updateTask } = useData();
  const editing = Boolean(task);

  const [staffId, setStaffId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [frequency, setFrequency] = useState<TaskFrequency>('once');
  const [dueDate, setDueDate] = useState('');
  const [assignedBy, setAssignedBy] = useState(OWNER_NAME);
  const [tags, setTags] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (open) {
      setStaffId(task?.staffId ?? defaultStaffId ?? data.staff[0]?.id ?? '');
      setTitle(task?.title ?? '');
      setDescription(task?.description ?? '');
      setPriority(task?.priority ?? 'medium');
      setStatus(task?.status ?? 'pending');
      setFrequency(task?.frequency ?? 'once');
      setDueDate(toDateInput(task?.dueDate ?? null));
      setAssignedBy(task?.assignedBy ?? OWNER_NAME);
      setTags(task?.tags.join(', ') ?? '');
      setNotes(task?.notes ?? '');
    }
  }, [open, task, defaultStaffId, data.staff]);

  const canSave = title.trim().length > 0 && staffId.length > 0;

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (!canSave) return;
    const parsedTags = tags
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    const payload = {
      staffId,
      title: title.trim(),
      description: description.trim(),
      priority,
      status,
      progress: progressForStatus(status),
      frequency,
      dueDate: fromDateInput(dueDate),
      assignedBy: assignedBy.trim() || OWNER_NAME,
      tags: parsedTags,
      notes: notes.trim(),
      pinned: task?.pinned ?? false,
    };

    if (editing && task) {
      updateTask(task.id, payload);
    } else {
      addTask(payload);
    }
    handleClose();
  }, [canSave, tags, staffId, title, description, priority, status, frequency, dueDate, assignedBy, notes, task, editing, updateTask, addTask, handleClose]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={editing ? 'Görevi Düzenle' : 'Yeni Görev'}
      description={editing ? undefined : 'Bir personele yeni görev atayın.'}
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={handleClose}>
            Vazgeç
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!canSave}>
            {editing ? 'Kaydet' : 'Görev Oluştur'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Personel">
            <select
              value={staffId}
              onChange={(e) => setStaffId(e.target.value)}
              className="input-base"
            >
              {data.staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Görevi Veren">
            <input
              value={assignedBy}
              onChange={(e) => setAssignedBy(e.target.value)}
              className="input-base"
              placeholder="Yönetici"
            />
          </Field>
        </div>

        <Field label="Başlık">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-base"
            placeholder="Görev başlığı"
            autoFocus
          />
        </Field>

        <Field label="Açıklama">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="input-base min-h-[76px] resize-y"
            placeholder="Görev detayları..."
          />
        </Field>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <Field label="Öncelik">
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as TaskPriority)}
              className="input-base"
            >
              {(Object.keys(PRIORITY_CONFIG) as TaskPriority[]).map((p) => (
                <option key={p} value={p}>
                  {PRIORITY_CONFIG[p].emoji} {PRIORITY_CONFIG[p].label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Durum">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="input-base"
            >
              {STATUS_ORDER.map((s) => (
                <option key={s} value={s}>
                  {STATUS_CONFIG[s].label}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Sıklık">
            <select
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as TaskFrequency)}
              className="input-base"
            >
              {FREQUENCIES.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field label="Teslim Tarihi">
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="input-base"
          />
        </Field>

        <Field label="Etiketler (virgülle ayırın)">
          <input
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="input-base"
            placeholder="moderasyon, acil, haftalık"
          />
        </Field>

        <Field label="Notlar">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="input-base min-h-[60px] resize-y"
            placeholder="Ek notlar..."
          />
        </Field>
      </div>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="label-base">{label}</span>
      {children}
    </label>
  );
}
