import { useMemo, useState } from 'react';
import { Users, Plus, CheckSquare, Trash2, X } from 'lucide-react';
import type { Role } from '../types';
import { useData } from '../store/DataContext';
import { ROLE_CONFIG } from '../utils/constants';
import { PageHeader, SearchInput, EmptyState } from '../components/ui/Common';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { StaffCard } from '../components/staff/StaffCard';
import { StaffFormModal } from '../components/staff/StaffFormModal';

type Filter = 'all' | Role;

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'leader', label: 'Leader Staff' },
  { value: 'qa', label: 'Quality Assistant' },
  { value: 'prostaff', label: 'ProStaff' },
];

export function Staff() {
  const { data, deleteStaffMany } = useData();
  const [filter, setFilter] = useState<Filter>('all');
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [confirmBulk, setConfirmBulk] = useState(false);

  const filtered = useMemo(() => {
    const q = search.trim().toLocaleLowerCase('tr');
    return data.staff
      .filter((s) => (filter === 'all' ? true : s.role === filter))
      .filter(
        (s) =>
          !q ||
          s.name.toLocaleLowerCase('tr').includes(q) ||
          s.discordUsername.toLocaleLowerCase('tr').includes(q),
      )
      .sort((a, b) => {
        if (a.pinned !== b.pinned) return a.pinned ? -1 : 1;
        return b.performanceScore - a.performanceScore;
      });
  }, [data.staff, filter, search]);

  const countFor = (f: Filter) =>
    f === 'all' ? data.staff.length : data.staff.filter((s) => s.role === f).length;

  const exitSelect = () => {
    setSelectMode(false);
    setSelected(new Set());
  };

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const selectAllVisible = () => setSelected(new Set(filtered.map((s) => s.id)));

  const runBulkDelete = () => {
    deleteStaffMany([...selected]);
    setConfirmBulk(false);
    exitSelect();
  };

  return (
    <div>
      <PageHeader
        title="Personeller"
        subtitle={`${data.staff.length} kişilik yönetim ekibi`}
        icon={Users}
        actions={
          selectMode ? (
            <Button variant="ghost" icon={X} onClick={exitSelect}>
              Vazgeç
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              {data.staff.length > 0 && (
                <Button variant="secondary" icon={CheckSquare} onClick={() => setSelectMode(true)}>
                  Seç
                </Button>
              )}
              <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
                Personel Ekle
              </Button>
            </div>
          )
        }
      />

      {/* Toplu seçim araç çubuğu */}
      {selectMode && (
        <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-discord-border bg-discord-surface/50 px-3 py-2.5">
          <span className="text-sm font-medium text-discord-text">{selected.size} seçili</span>
          <span className="text-discord-line">·</span>
          <button
            onClick={selectAllVisible}
            className="text-sm font-medium text-discord-muted transition-colors hover:text-discord-text"
          >
            Tümünü Seç
          </button>
          <button
            onClick={() => setSelected(new Set())}
            className="text-sm font-medium text-discord-muted transition-colors hover:text-discord-text"
          >
            Seçimi Kaldır
          </button>
          <div className="ml-auto">
            <Button
              variant="danger"
              icon={Trash2}
              onClick={() => selected.size > 0 && setConfirmBulk(true)}
              disabled={selected.size === 0}
            >
              Seçilenleri Sil
            </Button>
          </div>
        </div>
      )}

      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            const accent = f.value !== 'all' && active ? ROLE_CONFIG[f.value].text : '';
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-white/10 text-discord-text'
                    : 'text-discord-muted hover:bg-white/5 hover:text-discord-text'
                } ${accent}`}
              >
                {f.label}
                <span className="rounded-full bg-black/20 px-1.5 text-[11px] tabular-nums">
                  {countFor(f.value)}
                </span>
              </button>
            );
          })}
        </div>
        <SearchInput
          value={search}
          onChange={setSearch}
          placeholder="İsim veya kullanıcı adı ara..."
          className="sm:w-72"
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Personel bulunamadı"
          description="Arama ya da filtre kriterlerine uyan personel yok."
          action={
            !selectMode && (
              <Button variant="primary" icon={Plus} onClick={() => setModalOpen(true)}>
                Personel Ekle
              </Button>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((s, i) => (
            <StaffCard
              key={s.id}
              staff={s}
              tasks={data.tasks}
              index={i}
              selectable={selectMode}
              selected={selected.has(s.id)}
              onSelectToggle={toggleOne}
            />
          ))}
        </div>
      )}

      <StaffFormModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <ConfirmDialog
        open={confirmBulk}
        onClose={() => setConfirmBulk(false)}
        onConfirm={runBulkDelete}
        title={`${selected.size} personel silinsin mi?`}
        description="Seçili personeller ve onlara ait tüm görev, not ve disiplin kayıtları kalıcı olarak silinecek."
        confirmLabel="Sil"
        danger
      />
    </div>
  );
}
