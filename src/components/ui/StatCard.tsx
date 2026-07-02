import type { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accent?: string; // icon tint classes e.g. 'text-blue-400 bg-blue-500/10'
  hint?: string;
  delay?: number;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  accent = 'text-discord-blurple bg-discord-blurple/10',
  hint,
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="glass card-hover rounded-2xl p-4 shadow-glow"
    >
      <div className="flex items-center justify-between">
        <span className={`grid h-10 w-10 place-items-center rounded-xl ${accent}`}>
          <Icon size={19} />
        </span>
        {hint && <span className="text-[11px] font-medium text-discord-faint">{hint}</span>}
      </div>
      <p className="mt-3 font-display text-2xl font-bold tabular-nums text-discord-text">
        {value}
      </p>
      <p className="text-xs font-medium text-discord-muted">{label}</p>
    </motion.div>
  );
}
