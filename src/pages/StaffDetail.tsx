import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  StickyNote,
  Star,
  ShieldAlert,
  Trophy,
  Pin,
  Pencil,
  Trash2,
  ListChecks,
  Clock,
  CheckCircle2,
  AlertTriangle,
  GraduationCap,
  MessageSquare,
  Trash,
} from 'lucide-react';
import type {
  DisciplineRecord,
  PerformanceCriteria,
  Staff as StaffType,
  Task,
} from '../types';
import { useData } from '../store/DataContext';
import {
  CRITERIA_KEYS,
  CRITERIA_LABELS,
  ROLE_CONFIG,
  TRACK_CONFIG,
} from '../utils/constants';
import {
  formatDate,
  relativeTime,
  staffTaskCounts,
  trainingProgress,
  fromDateInput,
  toDateInput,
} from '../utils/helpers';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { RoleBadge, PromotionBadge, SeverityBadge } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SectionTitle, EmptyState } from '../components/ui/Common';
import { StaffFormModal } from '../components/staff/StaffFormModal';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFormModal } from '../components/tasks/TaskFormModal';

export function StaffDetail() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const {
    getStaff,
    staffTasks,
    staffNotes,
    staffDiscipline,
    data,
    togglePinStaff,
    togglePromotionCandidate,
    deleteStaff,
    deleteNote,
  } = useData();

  const staff = getStaff(id);
  const [taskModal, setTaskModal] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [noteModal, setNoteModal] = useState(false);
  const [perfModal, setPerfModal] = useState(false);
  const [discModal, setDiscModal] = useState(false);
  const [fbModal, setFbModal] = useState(false);
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
        description="Bu personel silinmiş ya da hiç var olmamış olabilir."
        action={
          <Button variant="primary" onClick={() => navigate('/personeller')}>
            Personellere dön
          </Button>
        }
      />
    );
  }

  const cfg = ROLE_CONFIG[staff.role];
  const grouped = {
    active: tasks.filter((t) => t.status === 'in_progress' || t.status === 'reviewing'),
    pending: tasks.filter((t) => t.status === 'pending'),
    completed: tasks.filter((t) => t.status === 'completed'),
  };

  return (
    <div>
      <Link
        to="/personeller"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-discord-muted transition-colors hover:text-discord-text"
      >
        <ArrowLeft size={15} /> Personeller
      </Link>

      {/* Başlık kartı */}
      <div className={`relative overflow-hidden rounded-2xl border ${cfg.border} bg-discord-card/70 p-5 shadow-glow`}>
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
            <Button variant="primary" size="sm" icon={Plus} onClick={() => { setEditTask(null); setTaskModal(true); }}>
              Görev Ekle
            </Button>
            <Button variant="subtle" size="sm" icon={StickyNote} onClick={() => setNoteModal(true)}>
              Not
            </Button>
            <Button variant="subtle" size="sm" icon={Star} onClick={() => setPerfModal(true)}>
              Performans
            </Button>
            <Button variant="subtle" size="sm" icon={ShieldAlert} onClick={() => setDiscModal(true)}>
              Uyarı Ver
            </Button>
            <Button variant="subtle" size="sm" icon={MessageSquare} onClick={() => setFbModal(true)}>
              Geri Bildirim
            </Button>
            <Button
              variant="subtle"
              size="sm"
              icon={Trophy}
              onClick={() => togglePromotionCandidate(staff.id)}
              className={staff.promotionCandidate ? 'text-amber-300' : ''}
            >
              {staff.promotionCandidate ? 'Adaylıktan Çıkar' : 'Terfi Adayı'}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => togglePinStaff(staff.id)} title="Sabitle">
              <Pin size={16} className={staff.pinned ? 'rotate-45 fill-discord-blurple text-discord-blurple' : ''} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setEditStaff(true)} title="Düzenle">
              <Pencil size={16} />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setConfirmDelete(true)} title="Sil">
              <Trash2 size={16} className="text-red-400" />
            </Button>
          </div>
        </div>
      </div>

      {/* Skorlar */}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <ScoreCard label="Performans" value={staff.performanceScore} suffix="/100" accent={cfg.text} />
        <ScoreCard label="Disiplin" value={staff.disciplineScore} suffix="/100" accent="text-green-400" />
        <MiniStat label="Aktif" value={counts.active} icon={ListChecks} />
        <MiniStat label="Bekleyen" value={counts.pending} icon={Clock} />
        <MiniStat label="Tamamlanan" value={counts.completed} icon={CheckCircle2} />
        <MiniStat label="Geciken" value={counts.overdue} icon={AlertTriangle} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Sol: görevler */}
        <div className="space-y-5 lg:col-span-2">
          {(['active', 'pending', 'completed'] as const).map((key) => {
            const list = grouped[key];
            const titles = { active: 'Devam Eden Görevler', pending: 'Bekleyen Görevler', completed: 'Tamamlanan Görevler' };
            if (list.length === 0) return null;
            return (
              <Card key={key} padding="lg">
                <SectionTitle icon={ListChecks}>
                  {titles[key]} <span className="text-discord-faint">({list.length})</span>
                </SectionTitle>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {list.map((t, i) => (
                    <TaskCard
                      key={t.id}
                      task={t}
                      index={i}
                      showStaff={false}
                      onEdit={(task) => { setEditTask(task); setTaskModal(true); }}
                    />
                  ))}
                </div>
              </Card>
            );
          })}

          {tasks.length === 0 && (
            <Card padding="lg">
              <EmptyState
                icon={ListChecks}
                title="Görev yok"
                description="Bu personele henüz görev atanmadı."
                action={
                  <Button variant="primary" icon={Plus} onClick={() => { setEditTask(null); setTaskModal(true); }}>
                    Görev Ekle
                  </Button>
                }
              />
            </Card>
          )}

          {/* Değerlendirme */}
          <Card padding="lg">
            <SectionTitle icon={Star}>Performans Kriterleri</SectionTitle>
            <div className="grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              {CRITERIA_KEYS.map((k) => (
                <div key={k}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-discord-muted">{CRITERIA_LABELS[k]}</span>
                    <span className="font-semibold tabular-nums text-discord-text">{staff.performance[k]}</span>
                  </div>
                  <ProgressBar value={staff.performance[k]} />
                </div>
              ))}
            </div>
            {staff.evaluation && (
              <div className="mt-4 rounded-xl bg-white/[0.02] p-3">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-discord-faint">
                  Genel Değerlendirme
                </p>
                <p className="text-sm text-discord-text">{staff.evaluation}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Sağ: notlar, geri bildirim, disiplin, eğitim */}
        <div className="space-y-5">
          <Card padding="lg">
            <SectionTitle icon={GraduationCap}>
              Eğitim
            </SectionTitle>
            <div className="flex items-center justify-between text-sm">
              <span className="text-discord-muted">İlerleme</span>
              <span className="font-semibold text-discord-text">%{trainingProgress(staff)}</span>
            </div>
            <ProgressBar value={trainingProgress(staff)} className="mt-2" size="md" />
            <p className="mt-2 text-[11px] text-discord-faint">
              Son eğitim: {formatDate(staff.lastTrainingDate)}
            </p>
            <ul className="mt-3 space-y-1">
              {staff.trainingRecords.map((r) => (
                <li key={r.id} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={13} className={r.completed ? 'text-green-400' : 'text-discord-faint'} />
                  <span className={r.completed ? 'text-discord-text' : 'text-discord-muted'}>{r.name}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card padding="lg">
            <SectionTitle icon={StickyNote}>Notlar</SectionTitle>
            {notes.length === 0 ? (
              <EmptyState title="Not yok" />
            ) : (
              <ul className="space-y-2">
                {notes.map((n) => (
                  <li key={n.id} className="group rounded-xl bg-white/[0.02] p-3">
                    <p className="text-sm text-discord-text">{n.content}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="text-[11px] text-discord-faint">
                        {n.author} · {relativeTime(n.createdAt)}
                      </span>
                      <button
                        onClick={() => deleteNote(n.id)}
                        className="text-discord-faint opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                        aria-label="Notu sil"
                      >
                        <Trash size={13} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          {staff.feedback.length > 0 && (
            <Card padding="lg">
              <SectionTitle icon={MessageSquare}>Geri Bildirimler</SectionTitle>
              <ul className="space-y-2">
                {staff.feedback.map((f) => (
                  <li key={f.id} className="rounded-xl bg-white/[0.02] p-3">
                    <div className="mb-1 flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          size={13}
                          className={i < f.rating ? 'fill-amber-400 text-amber-400' : 'text-discord-faint'}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-discord-text">{f.content}</p>
                    <p className="mt-1 text-[11px] text-discord-faint">
                      {f.author} · {relativeTime(f.createdAt)}
                    </p>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          <Card padding="lg">
            <SectionTitle icon={ShieldAlert}>Disiplin</SectionTitle>
            {discipline.length === 0 ? (
              <EmptyState title="Kayıt yok" description="Temiz sicil 🎉" />
            ) : (
              <ul className="space-y-2">
                {discipline.map((d) => (
                  <li key={d.id} className="rounded-xl bg-white/[0.02] p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-sm font-medium text-discord-text">{d.reason}</p>
                      <SeverityBadge severity={d.severity} />
                    </div>
                    {d.description && <p className="mt-1 text-xs text-discord-muted">{d.description}</p>}
                    <p className="mt-1 text-[11px] text-discord-faint">{formatDate(d.date)}</p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      {/* Modallar */}
      <TaskFormModal
        open={taskModal}
        onClose={() => { setTaskModal(false); setEditTask(null); }}
        task={editTask}
        defaultStaffId={staff.id}
      />
      <StaffFormModal open={editStaff} onClose={() => setEditStaff(false)} staff={staff} />
      <NoteModal open={noteModal} onClose={() => setNoteModal(false)} staffId={staff.id} />
      <PerformanceModal open={perfModal} onClose={() => setPerfModal(false)} staff={staff} />
      <DisciplineModal open={discModal} onClose={() => setDiscModal(false)} staffId={staff.id} />
      <FeedbackModal open={fbModal} onClose={() => setFbModal(false)} staffId={staff.id} />
      <ConfirmDialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
        onConfirm={() => { deleteStaff(staff.id); navigate('/personeller'); }}
        title="Personel silinsin mi?"
        description={`${staff.name} ve ilişkili tüm görev, not ve disiplin kayıtları silinecek.`}
        confirmLabel="Sil"
        danger
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Yardımcı kartlar
// ---------------------------------------------------------------------------
function ScoreCard({ label, value, suffix, accent }: { label: string; value: number; suffix?: string; accent: string }) {
  return (
    <Card padding="md">
      <p className="text-[11px] font-medium uppercase tracking-wide text-discord-faint">{label}</p>
      <p className={`font-display text-2xl font-bold tabular-nums ${accent}`}>
        {value}
        {suffix && <span className="text-sm text-discord-faint">{suffix}</span>}
      </p>
    </Card>
  );
}

function MiniStat({ label, value, icon: Icon }: { label: string; value: number; icon: typeof ListChecks }) {
  return (
    <Card padding="md">
      <div className="flex items-center gap-1.5 text-[11px] text-discord-faint">
        <Icon size={12} /> {label}
      </div>
      <p className="font-display text-2xl font-bold tabular-nums text-discord-text">{value}</p>
    </Card>
  );
}


// ---------------------------------------------------------------------------
// Not modalı
// ---------------------------------------------------------------------------
function NoteModal({ open, onClose, staffId }: { open: boolean; onClose: () => void; staffId: string }) {
  const { addNote } = useData();
  const [content, setContent] = useState('');
  useEffect(() => {
    if (open) setContent('');
  }, [open]);
  const save = () => {
    if (!content.trim()) return;
    addNote(staffId, content.trim());
    setContent('');
    onClose();
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Not Ekle"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Vazgeç</Button>
          <Button variant="primary" onClick={save} disabled={!content.trim()}>Ekle</Button>
        </>
      }
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="input-base min-h-[110px] resize-y"
        placeholder="Not içeriği..."
        autoFocus
      />
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Performans modalı
// ---------------------------------------------------------------------------
function PerformanceModal({ open, onClose, staff }: { open: boolean; onClose: () => void; staff: StaffType }) {
  const { updatePerformance } = useData();
  const [criteria, setCriteria] = useState<PerformanceCriteria>(staff.performance);

  useEffect(() => {
    if (open) setCriteria(staff.performance);
  }, [open, staff]);

  const avg = Math.round(CRITERIA_KEYS.reduce((a, k) => a + criteria[k], 0) / CRITERIA_KEYS.length);

  const save = () => {
    updatePerformance(staff.id, criteria);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Performans Değerlendir"
      description={`Ortalama: ${avg}/100`}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Vazgeç</Button>
          <Button variant="primary" onClick={save}>Kaydet</Button>
        </>
      }
    >
      <div className="space-y-3">
        {CRITERIA_KEYS.map((k) => (
          <div key={k}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-discord-muted">{CRITERIA_LABELS[k]}</span>
              <span className="font-semibold tabular-nums text-discord-text">{criteria[k]}</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={criteria[k]}
              onChange={(e) => setCriteria((c) => ({ ...c, [k]: Number(e.target.value) }))}
              className="w-full accent-discord-blurple"
            />
          </div>
        ))}
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Disiplin modalı
// ---------------------------------------------------------------------------
function DisciplineModal({ open, onClose, staffId }: { open: boolean; onClose: () => void; staffId: string }) {
  const { addDiscipline } = useData();
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [severity, setSeverity] = useState<DisciplineRecord['severity']>('low');
  const [date, setDate] = useState(toDateInput(new Date().toISOString()));
  const [note, setNote] = useState('');

  useEffect(() => {
    if (open) {
      setReason('');
      setDescription('');
      setSeverity('low');
      setDate(toDateInput(new Date().toISOString()));
      setNote('');
    }
  }, [open]);

  const save = () => {
    if (!reason.trim()) return;
    addDiscipline({
      staffId,
      reason: reason.trim(),
      description: description.trim(),
      severity,
      status: 'active',
      note: note.trim(),
      date: fromDateInput(date) ?? new Date().toISOString(),
    });
    setReason(''); setDescription(''); setNote(''); setSeverity('low');
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Uyarı / Disiplin Kaydı"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Vazgeç</Button>
          <Button variant="danger" onClick={save} disabled={!reason.trim()}>Kaydet</Button>
        </>
      }
    >
      <div className="space-y-4">
        <label className="block">
          <span className="label-base">Sebep</span>
          <input value={reason} onChange={(e) => setReason(e.target.value)} className="input-base" placeholder="Örn: Görev ihmali" autoFocus />
        </label>
        <label className="block">
          <span className="label-base">Açıklama</span>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="input-base min-h-[70px] resize-y" placeholder="Detaylar..." />
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="label-base">Şiddet</span>
            <select value={severity} onChange={(e) => setSeverity(e.target.value as DisciplineRecord['severity'])} className="input-base">
              <option value="low">Hafif</option>
              <option value="medium">Orta</option>
              <option value="high">Ağır</option>
            </select>
          </label>
          <label className="block">
            <span className="label-base">Tarih</span>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input-base" />
          </label>
        </div>
        <label className="block">
          <span className="label-base">Not</span>
          <input value={note} onChange={(e) => setNote(e.target.value)} className="input-base" placeholder="Ek not (opsiyonel)" />
        </label>
      </div>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Geri bildirim modalı
// ---------------------------------------------------------------------------
function FeedbackModal({ open, onClose, staffId }: { open: boolean; onClose: () => void; staffId: string }) {
  const { addFeedback } = useData();
  const [content, setContent] = useState('');
  const [rating, setRating] = useState(4);

  useEffect(() => {
    if (open) {
      setContent('');
      setRating(4);
    }
  }, [open]);

  const save = () => {
    if (!content.trim()) return;
    addFeedback(staffId, content.trim(), rating);
    setContent(''); setRating(4);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Geri Bildirim Ekle"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Vazgeç</Button>
          <Button variant="primary" onClick={save} disabled={!content.trim()}>Ekle</Button>
        </>
      }
    >
      <div className="space-y-3">
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <button key={i} onClick={() => setRating(i + 1)} aria-label={`${i + 1} yıldız`}>
              <Star size={22} className={i < rating ? 'fill-amber-400 text-amber-400' : 'text-discord-faint'} />
            </button>
          ))}
        </div>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input-base min-h-[90px] resize-y"
          placeholder="Geri bildiriminiz..."
        />
      </div>
    </Modal>
  );
}
