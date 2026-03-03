'use client';

import { RiskLevel } from '@/lib/types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const config = {
  low: {
    label: '良好',
    color: 'var(--accent-emerald)',
    bg: 'rgba(52, 211, 153, 0.1)',
    border: 'rgba(52, 211, 153, 0.25)',
    glow: 'rgba(52, 211, 153, 0.12)',
  },
  moderate: {
    label: '要改善',
    color: 'var(--accent-amber)',
    bg: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 0.25)',
    glow: 'rgba(251, 191, 36, 0.12)',
  },
  high: {
    label: '要注意',
    color: 'var(--accent-rose)',
    bg: 'rgba(251, 113, 133, 0.1)',
    border: 'rgba(251, 113, 133, 0.25)',
    glow: 'rgba(251, 113, 133, 0.12)',
  },
};

const sizeClasses = {
  sm: 'text-[10px] px-2.5 py-1 gap-1.5',
  md: 'text-[11px] px-3 py-1.5 gap-1.5',
  lg: 'text-[13px] px-4 py-2 gap-2',
};

const dotSizes = {
  sm: 'w-1.5 h-1.5',
  md: 'w-2 h-2',
  lg: 'w-2.5 h-2.5',
};

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const c = config[level];
  return (
    <span
      className={`inline-flex items-center font-bold rounded-full tracking-wide ${sizeClasses[size]}`}
      style={{
        background: c.bg,
        border: `1px solid ${c.border}`,
        color: c.color,
        boxShadow: `0 0 16px ${c.glow}`,
      }}
    >
      <span
        className={`rounded-full shrink-0 ${dotSizes[size]} ${level === 'high' ? 'animate-pulse' : ''}`}
        style={{ background: c.color }}
      />
      {c.label}
    </span>
  );
}
