import { RiskLevel } from './types';

export const DOMAIN_COLORS: Record<string, string> = {
  sleep: '#638cff',
  stress: '#a78bfa',
  fatigue: '#fb7185',
  diet: '#34d399',
  exercise: '#fbbf24',
};

export const RISK_CONFIG: Record<RiskLevel, { text: string; color: string; bg: string; border: string }> = {
  low: { text: '良好', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
  moderate: { text: '要改善', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  high: { text: '要対応', color: '#fb7185', bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.2)' },
};

/** Domains where lower score = better health */
export const LOWER_IS_BETTER_DOMAINS = ['sleep', 'stress', 'fatigue'];
