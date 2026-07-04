import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, AlertTriangle, Pin, Pencil, Trash2 } from 'lucide-react';
import type { Staff as StaffType } from '../types';
import { useData } from '../store/DataContext';
import { ROLE_CONFIG, TRACK_CONFIG } from '../utils/constants';
import { staffTaskCounts } from '../utils/helpers';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { RoleBadge, PromotionBadge } from '../components/ui/Badge';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { EmptyState } from '../components/ui/Common';
import { StaffFormModal } from '../components/staff/StaffFormModal';
import { StaffPerformanceSection } from '../components/staff/StaffPerformanceSection';
import { StaffTasksSection } from '../components/staff/StaffTasksSection';
import { StaffNotesSection } from '../components/staff/StaffNotesSection';
import { StaffDisciplineSection } from '../components/staff/StaffDisciplineSection';
import { StaffFeedbackSection } from '../components/staff/StaffFeedbackSection';
import { StaffTrainingSection } from '../components/staff/StaffTrainingSection';

export function StaffDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { getStaff, staffTasks, staffNotes, staffDiscipline, data, togglePinStaff, deleteStaff, togglePromotionCandidate } = useData();

  const staff = getStaff(id);
  const [editStaff, setEditStaff] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const tasks = staffTasks(id);
  const notes = staffNotes(id);
  const discipline = staffDiscipline(id);
  const counts = useMemo(() => staffTaskCounts(data.tasks, id), [data.tasks, id]);

  if (!staff) {
    return (
      <EmptyState
        icon={AlertTriangle}
        title="Personel bulunamadı"
        action={<Button variant="primary" onClick={() => navigate('/personeller')}>Personellere dön</Button>}
      />
    );
  }

  const cfg = ROLE_CONFIG[staff.role];

  const handleDelete = () => {
    deleteStaff(id);
    navigate('/personeller');
  };

  return (
    <div>
      <Link to="/personeller" className="mb-4 inline-flex items-center gap-1.5 text-sm text-discord-muted transition-colors hover:text-discord-text">
        <ArrowLeft size={15} /> Personeller
      </Link>

      {/* Header */}
      <div className={`relative overflow-hidden rounded-2xl border ${cfg.border} bg-discord-card/70 p-5 shadow-glow mb-6`}>
        <span className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${cfg.accent}`} />
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={staff.name} src={staff.avatar} role={staff.role} size="xl" ring />
            <div>
              <h1 className="font-display text-2xl font-bold text-discord-text">{staff.name}</h1>
              <p className="text-sm text-discord-faint">{staff.discordUsername}</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <RoleBadge role={staff.role} />
                {staff.role === 'prostaff' && staff.track && (
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-discord-muted">
                    {TRACK_CONFIG[staff.track].emoji} {TRACK_CONFIG[staff.track].label}
                  </span>
                )}
                <PromotionBadge status={staff.promotionStatus} />
                {staff.hasTeam && staff.team && (
                  <span className="rounded-md bg-white/5 px-2 py-0.5 text-[11px] font-medium text-discord-muted">
                    {staff.team} · {staff.teamSize} kişi
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="subtle" size="sm" icon={Pin} onClick={() => togglePinStaff(id)}>
              {staff.pinned ? 'Sabitlendi' : 'Sabitle'}
            </Button>
            <Button variant="subtle" size="sm" icon={Pencil} onClick={() => setEditStaff(true)}>
              Düzenle
            </Button>
            <Button variant="danger" size="sm" icon={Trash2} onClick={() => setConfirmDelete(true)}>
              Sil
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-4 grid grid-cols-4 gap-3">
          {[
            { label: 'Aktif', value: counts.active },
            { label: 'Beklemede', value: counts.pending },
            { label: 'Tamamlanan', value: counts.completed },
            { label: 'Geciken', value: counts.overdue },
          ].map((stat) => (
            <div key={stat.label} className="rounded-lg bg-white/5 p-2.5 text-center">
              <p className="text-[11px] text-discord-muted">{stat.label}</p>
              <p className="font-bold text-discord-text">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <StaffTasksSection staffId={id} tasks={tasks} />
          <StaffPerformanceSection staff={staff} />
          <StaffDisciplineSection staffId={id} records={discipline} />
        </div>

        <div className="space-y-6">
          <StaffTrainingSection staff={staff} />
          <StaffFeedbackSection staff={staff} />
          <StaffNotesSection staffId={id} notes={notes} />
        </div>
      </div>

      {/* Modals */}
      <StaffFormModal open={editStaff} onClose={() => setEditStaff(false)} staff={staff} />
      <ConfirmDialog
        open={confirmDelete}
        title="Personeli Sil?"
        description="Bu işlem geri alınamaz. Personele ait tüm görevler, notlar ve kayıtlar silinecektir."
        onConfirm={handleDelete}
        onClose={() => setConfirmDelete(false)}
        danger
      />
    </div>
  );
}
