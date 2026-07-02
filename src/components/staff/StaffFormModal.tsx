import { useEffect, useState } from 'react';
import type { ProStaffTrack, Role, Staff } from '../../types';
import { ROLE_CONFIG, TRACK_CONFIG } from '../../utils/constants';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useData } from '../../store/DataContext';
import { nowISO } from '../../utils/helpers';

interface StaffFormModalProps {
  open: boolean;
  onClose: () => void;
  staff?: Staff | null;
}

const DEFAULT_PERF = {
  activity: 70,
  taskCompletion: 70,
  responsibility: 70,
  communication: 70,
  teamwork: 70,
  discipline: 80,
  quality: 70,
  training: 60,
};

export function StaffFormModal({ open, onClose, staff }: StaffFormModalProps) {
  const { addStaff, updateStaff } = useData();
  const editing = Boolean(staff);

  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<Role>('prostaff');
  const [track, setTrack] = useState<ProStaffTrack>('leader_candidate');
  const [hasTeam, setHasTeam] = useState(false);
  const [team, setTeam] = useState('');
  const [teamSize, setTeamSize] = useState(0);
  const [disciplineScore, setDisciplineScore] = useState(90);
  const [evaluation, setEvaluation] = useState('');

  useEffect(() => {
    if (open) {
      setName(staff?.name ?? '');
      setUsername(staff?.discordUsername ?? '');
      setRole(staff?.role ?? 'prostaff');
      setTrack(staff?.track ?? 'leader_candidate');
      setHasTeam(staff?.hasTeam ?? false);
      setTeam(staff?.team ?? '');
      setTeamSize(staff?.teamSize ?? 0);
      setDisciplineScore(staff?.disciplineScore ?? 90);
      setEvaluation(staff?.evaluation ?? '');
    }
  }, [open, staff]);

  const canSave = name.trim().length > 0 && username.trim().length > 0;

  const handleSave = () => {
    if (!canSave) return;
    const base = {
      name: name.trim(),
      discordUsername: username.trim(),
      role,
      track: role === 'prostaff' ? track : null,
      hasTeam,
      team: hasTeam ? team.trim() || null : null,
      teamSize: hasTeam ? teamSize : 0,
      disciplineScore,
      evaluation: evaluation.trim(),
    };

    if (editing && staff) {
      updateStaff(staff.id, base);
    } else {
      addStaff({
        ...base,
        avatar: null,
        performance: DEFAULT_PERF,
        promotionStatus: 'not_ready',
        promotionCandidate: false,
        pinned: false,
        lastActive: nowISO(),
      });
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editing ? 'Personeli Düzenle' : 'Yeni Personel'}
      description={editing ? 'Bilgileri güncelle' : 'Ekibe yeni bir personel ekle'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Vazgeç
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={!canSave}>
            {editing ? 'Kaydet' : 'Ekle'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="label-base">İsim</label>
            <input
              className="input-base"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ör. Kaan Yılmaz"
            />
          </div>
          <div>
            <label className="label-base">Discord Kullanıcı Adı</label>
            <input
              className="input-base"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ör. kaan#0001"
            />
          </div>
        </div>

        {/* Rol seçimi */}
        <div>
          <label className="label-base">Rol</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(ROLE_CONFIG) as Role[]).map((r) => {
              const cfg = ROLE_CONFIG[r];
              const Icon = cfg.icon;
              const active = role === r;
              return (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex flex-col items-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-semibold transition ${
                    active
                      ? `${cfg.border} ${cfg.soft} ${cfg.text}`
                      : 'border-discord-border text-discord-muted hover:bg-white/5'
                  }`}
                >
                  <Icon size={16} />
                  {cfg.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ProStaff yolu */}
        {role === 'prostaff' && (
          <div>
            <label className="label-base">ProStaff Yolu</label>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(TRACK_CONFIG) as ProStaffTrack[]).map((t) => {
                const active = track === t;
                return (
                  <button
                    key={t}
                    onClick={() => setTrack(t)}
                    className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                      active
                        ? 'border-blue-500/40 bg-blue-500/10 text-blue-300'
                        : 'border-discord-border text-discord-muted hover:bg-white/5'
                    }`}
                  >
                    {TRACK_CONFIG[t].emoji} {TRACK_CONFIG[t].label}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Takım */}
        <div className="rounded-lg border border-discord-border bg-discord-surface/40 p-3">
          <label className="flex cursor-pointer items-center justify-between">
            <span className="text-sm font-medium text-discord-text">Kendi takımı var mı?</span>
            <input
              type="checkbox"
              checked={hasTeam}
              onChange={(e) => setHasTeam(e.target.checked)}
              className="h-4 w-4 accent-discord-blurple"
            />
          </label>
          {hasTeam && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <label className="label-base">Takım Adı</label>
                <input
                  className="input-base"
                  value={team}
                  onChange={(e) => setTeam(e.target.value)}
                  placeholder="Ör. Alpha Ekibi"
                />
              </div>
              <div>
                <label className="label-base">Üye Sayısı</label>
                <input
                  type="number"
                  min={0}
                  className="input-base"
                  value={teamSize}
                  onChange={(e) => setTeamSize(Number(e.target.value))}
                />
              </div>
            </div>
          )}
        </div>

        {/* Disiplin puanı */}
        <div>
          <label className="label-base">
            Disiplin Puanı: <span className="text-discord-text">{disciplineScore}</span>
          </label>
          <input
            type="range"
            min={0}
            max={100}
            value={disciplineScore}
            onChange={(e) => setDisciplineScore(Number(e.target.value))}
            className="w-full accent-discord-blurple"
          />
        </div>

        {/* Değerlendirme */}
        <div>
          <label className="label-base">Genel Değerlendirme</label>
          <textarea
            className="input-base min-h-[70px] resize-none"
            value={evaluation}
            onChange={(e) => setEvaluation(e.target.value)}
            placeholder="Personel hakkında kısa değerlendirme..."
          />
        </div>

        {!editing && (
          <p className="text-xs text-discord-faint">
            Performans kriterleri varsayılan 70 ile başlar. Detay sayfasından
            "Performans Değerlendir" ile ayarlayabilirsin.
          </p>
        )}
      </div>
    </Modal>
  );
}
