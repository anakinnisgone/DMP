import { useState } from 'react';
import { ShieldAlert, Plus, Trash2 } from 'lucide-react';
import type { DisciplineRecord } from '../../types';
import { useData } from '../../store/DataContext';
import { formatDate } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SectionTitle, EmptyState } from '../ui/Common';
import { SeverityBadge } from '../ui/Badge';
import { Modal } from '../ui/Modal';

interface StaffDisciplineSectionProps {
  staffId: string;
  records: DisciplineRecord[];
}

export function StaffDisciplineSection({ staffId, records }: StaffDisciplineSectionProps) {
  const { addDiscipline, deleteDiscipline } = useData();
  const [discModal, setDiscModal] = useState(false);
  const [discReason, setDiscReason] = useState('');
  const [discSeverity, setDiscSeverity] = useState<'high' | 'medium' | 'low'>('medium');

  const handleAddDisc = () => {
    if (discReason.trim()) {
      addDiscipline({
        staffId,
        reason: discReason.trim(),
        severity: discSeverity,
        date: new Date().toISOString(),
        description: discReason.trim(),
        status: 'active',
        note: '',
      });
      setDiscReason('');
      setDiscSeverity('medium');
      setDiscModal(false);
    }
  };

  return (
    <>
      <Card padding="lg">
        <SectionTitle
          icon={ShieldAlert}
          action={<Button variant="primary" size="sm" icon={Plus} onClick={() => setDiscModal(true)}>Kayıt Ekle</Button>}
        >
          Disiplin Kayıtları ({records.length})
        </SectionTitle>

        {records.length === 0 ? (
          <EmptyState title="Disiplin kaydı yok" />
        ) : (
          <div className="space-y-2">
            {records.map((rec) => (
              <div key={rec.id} className="flex items-start gap-3 rounded-lg border border-discord-border bg-discord-elevated/50 p-3">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <SeverityBadge severity={rec.severity} />
                    <p className="text-[11px] text-discord-faint">{formatDate(rec.date)}</p>
                  </div>
                  <p className="text-sm text-discord-text">{rec.reason}</p>
                </div>
                <Button variant="ghost" size="sm" icon={Trash2} onClick={() => deleteDiscipline(rec.id)} className="!p-0 !h-auto" />
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={discModal}
        onClose={() => setDiscModal(false)}
        title="Disiplin Kaydı Ekle"
        footer={
          <>
            <Button variant="ghost" onClick={() => setDiscModal(false)}>
              Vazgeç
            </Button>
            <Button variant="primary" onClick={handleAddDisc} disabled={!discReason.trim()}>
              Ekle
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label-base">Ciddiyeti</label>
            <select value={discSeverity} onChange={(e) => setDiscSeverity(e.target.value as any)} className="input-base">
              <option value="low">Düşük</option>
              <option value="medium">Orta</option>
              <option value="high">Yüksek</option>
            </select>
          </div>
          <div>
            <label className="label-base">Nedeni</label>
            <textarea value={discReason} onChange={(e) => setDiscReason(e.target.value)} className="input-base min-h-[100px] resize-none" placeholder="Disiplin kaydının nedenini açıklayın..." autoFocus />
          </div>
        </div>
      </Modal>
    </>
  );
}
