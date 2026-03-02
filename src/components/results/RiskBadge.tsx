'use client';

import { RiskLevel } from '@/lib/types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const config = {
  low: {
    label: '良好',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    dotColor: 'bg-green-500',
  },
  moderate: {
    label: '要改善',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-300',
    dotColor: 'bg-yellow-500',
  },
  high: {
    label: '要注意',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    dotColor: 'bg-red-500',
  },
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
  lg: 'text-base px-4 py-2',
};

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const c = config[level];
  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${c.bgColor} ${c.textColor} ${c.borderColor} ${sizeClasses[size]}`}
    >
      <span className={`w-2 h-2 rounded-full ${c.dotColor}`} />
      {c.label}
    </span>
  );
}
