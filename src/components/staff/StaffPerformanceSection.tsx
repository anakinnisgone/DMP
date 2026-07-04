import { useState } from 'react';
import { Star, Pencil } from 'lucide-react';
import type { PerformanceCriteria, Staff } from '../../types';
import { CRITERIA_KEYS, CRITERIA_LABELS } from '../../utils/constants';
import { useData } from '../../store/DataContext';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { SectionTitle } from '../ui/Common';
import { Modal } from '../ui/Modal';

interface StaffPerformanceSectionProps {
  staff: Staff;
}

export function StaffPerformanceSection({ staff }: StaffPerformanceSectionProps) {
  const { updatePerformance } = useData();
  const [perfModal, setPerfModal] = useState(false);
  const [perf, setPerf] = useState<PerformanceCriteria>(staff.performance);

  const handleSavePerf = () => {
    updatePerformance(staff.id, perf);
    setPerfModal(false);
  };

  return (
    <>
      <Card padding="lg">
        <SectionTitle icon={Star} action={<Button variant="ghost" size="sm" icon={Pencil} onClick={() => setPerfModal(true)} />}>
          Performans
        </SectionTitle>

        <div className="space-y-3">
          {CRITERIA_KEYS.map((key) => (
            <div key={key}>
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs font-semibold text-discord-text">{CRITERIA_LABELS[key]}</span>
                <span className="text-xs font-bold text-discord-blurple">{staff.performance[key]}</span>
              </div>
              <ProgressBar value={staff.performance[key]} />
            </div>
          ))}
        </div>

        <div className="mt-4 rounded-lg bg-discord-elevated px-3 py-2">
          <p className="text-xs font-semibold text-discord-text">Genel Puan</p>
          <p className="text-2xl font-bold text-discord-blurple">{staff.performanceScore.toFixed(1)}</p>
        </div>
      </Card>

      <Modal
        open={perfModal}
        onClose={() => setPerfModal(false)}
        title="Performans Güncelle"
        footer={
          <>
            <Button variant="ghost" onClick={() => setPerfModal(false)}>
              Vazgeç
            </Button>
            <Button variant="primary" onClick={handleSavePerf}>
              Kaydet
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {CRITERIA_KEYS.map((key) => (
            <div key={key}>
              <label className="label-base">{CRITERIA_LABELS[key]}</label>
              <input
                type="range"
                min="0"
                max="100"
                value={perf[key]}
                onChange={(e) => setPerf({ ...perf, [key]: parseInt(e.target.value) })}
                className="w-full"
              />
              <p className="mt-1 text-xs text-discord-muted">{perf[key]}/100</p>
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
