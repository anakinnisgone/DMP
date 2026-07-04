import { useState } from 'react';
import { MessageSquare, Plus } from 'lucide-react';
import type { Staff, Feedback } from '../../types';
import { useData } from '../../store/DataContext';
import { formatDate } from '../../utils/helpers';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { SectionTitle, EmptyState } from '../ui/Common';
import { Modal } from '../ui/Modal';

interface StaffFeedbackSectionProps {
  staff: Staff;
}

export function StaffFeedbackSection({ staff }: StaffFeedbackSectionProps) {
  const { addFeedback } = useData();
  const [fbModal, setFbModal] = useState(false);
  const [fbContent, setFbContent] = useState('');
  const [fbRating, setFbRating] = useState(5);

  const handleAddFb = () => {
    if (fbContent.trim()) {
      addFeedback(staff.id, fbContent.trim(), fbRating);
      setFbContent('');
      setFbRating(5);
      setFbModal(false);
    }
  };

  const avgRating = staff.feedback.length > 0 ? (staff.feedback.reduce((sum, f) => sum + f.rating, 0) / staff.feedback.length).toFixed(1) : 'N/A';

  return (
    <>
      <Card padding="lg">
        <SectionTitle
          icon={MessageSquare}
          action={<Button variant="primary" size="sm" icon={Plus} onClick={() => setFbModal(true)}>Geri Bildirim Ekle</Button>}
        >
          Geri Bildirim
        </SectionTitle>

        <div className="mb-4 rounded-lg bg-discord-elevated px-3 py-2">
          <p className="text-xs font-semibold text-discord-text">Ortalama Puan</p>
          <p className="text-2xl font-bold text-discord-blurple">{avgRating} / 10</p>
          <p className="text-xs text-discord-muted">{staff.feedback.length} geri bildirim</p>
        </div>

        {staff.feedback.length === 0 ? (
          <EmptyState title="Geri bildirim yok" description="Henüz hiçbir geri bildirim eklenmemiş" />
        ) : (
          <div className="space-y-3">
            {staff.feedback.map((fb: Feedback) => (
              <div key={fb.id} className="rounded-lg border border-discord-border bg-discord-elevated/50 p-3">
                <div className="mb-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-discord-text">{fb.author}</p>
                    <span className="text-xs font-bold text-discord-blurple">{fb.rating}/10</span>
                  </div>
                </div>
                <p className="text-sm text-discord-text">{fb.content}</p>
                <p className="mt-1.5 text-[11px] text-discord-faint">{formatDate(fb.createdAt)}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Modal
        open={fbModal}
        onClose={() => setFbModal(false)}
        title="Geri Bildirim Ekle"
        footer={
          <>
            <Button variant="ghost" onClick={() => setFbModal(false)}>
              Vazgeç
            </Button>
            <Button variant="primary" onClick={handleAddFb} disabled={!fbContent.trim()}>
              Ekle
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="label-base">Puan (1-10)</label>
            <input type="range" min="1" max="10" value={fbRating} onChange={(e) => setFbRating(parseInt(e.target.value))} className="w-full" />
            <p className="mt-1 text-xs text-discord-muted">{fbRating}/10</p>
          </div>
          <div>
            <label className="label-base">Geri Bildirim</label>
            <textarea value={fbContent} onChange={(e) => setFbContent(e.target.value)} className="input-base min-h-[100px] resize-none" placeholder="Personel hakkındaki düşüncelerinizi yazın..." autoFocus />
          </div>
        </div>
      </Modal>
    </>
  );
}
