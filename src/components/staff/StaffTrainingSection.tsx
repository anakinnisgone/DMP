import { GraduationCap } from 'lucide-react';
import type { Staff } from '../../types';
import { TRAINING_MODULES } from '../../utils/constants';
import { trainingProgress } from '../../utils/helpers';
import { useData } from '../../store/DataContext';
import { Card } from '../ui/Card';
import { ProgressBar } from '../ui/ProgressBar';
import { SectionTitle } from '../ui/Common';

interface StaffTrainingSectionProps {
  staff: Staff;
}

export function StaffTrainingSection({ staff }: StaffTrainingSectionProps) {
  const { toggleTraining } = useData();
  const progress = trainingProgress(staff);

  return (
    <Card padding="lg">
      <SectionTitle icon={GraduationCap}>Eğitim Programı</SectionTitle>

      <div className="mb-3">
        <div className="mb-1.5 flex items-center justify-between">
          <span className="text-xs font-semibold text-discord-text">Genel İlerleme</span>
          <span className="text-xs font-bold text-discord-blurple">{progress}%</span>
        </div>
        <ProgressBar value={progress} />
      </div>

      <div className="space-y-2">
        {staff.trainingRecords.map((rec) => {
          const module = TRAINING_MODULES.find((m) => m === rec.name);
          return (
            <button
              key={rec.id}
              onClick={() => toggleTraining(staff.id, rec.id)}
              className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition ${
                rec.completed ? 'border-green-500/30 bg-green-500/5 text-green-400' : 'border-discord-border text-discord-text hover:bg-white/5'
              }`}
            >
              <input type="checkbox" checked={rec.completed} readOnly className="cursor-pointer" />
              <span className="flex-1 text-left font-medium">{module}</span>
              {rec.completed && <span className="text-[11px] text-discord-faint">✓</span>}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
