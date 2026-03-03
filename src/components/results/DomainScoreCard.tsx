'use client';

import { DomainResult } from '@/lib/types';
import { LOWER_IS_BETTER_DOMAINS } from '@/lib/constants';
import { useCountUp } from '@/hooks/useCountUp';
import RiskBadge from './RiskBadge';

interface DomainScoreCardProps {
  result: DomainResult;
  previousResult?: DomainResult;
}

const domainTheme: Record<string, { color: string; glow: string }> = {
  sleep: { color: '#638cff', glow: 'var(--glow-blue)' },
  stress: { color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.15)' },
  fatigue: { color: '#fb7185', glow: 'var(--glow-rose)' },
  diet: { color: '#34d399', glow: 'var(--glow-emerald)' },
  exercise: { color: '#fbbf24', glow: 'var(--glow-amber)' },
};

function ScoreRing({ score, animatedScore, maxScore, color }: { score: number; animatedScore: number; maxScore: number | null; color: string }) {
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const ratio = maxScore ? Math.min(animatedScore / maxScore, 1) : Math.min(animatedScore / Math.max(score, 1), 0.5);
  const offset = circumference * (1 - ratio);
  const gradId = `ring-${color.replace('#', '')}`;

  return (
    <svg width="88" height="88" viewBox="0 0 88 88" className="score-ring shrink-0">
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor={color} stopOpacity={0.4} />
        </linearGradient>
      </defs>
      <circle cx="44" cy="44" r={radius} className="score-ring-track" />
      <circle
        cx="44"
        cy="44"
        r={radius}
        className="score-ring-fill"
        stroke={`url(#${gradId})`}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        x="44"
        y="41"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-lg font-black"
        fill="var(--text-primary)"
        transform="rotate(90 44 44)"
      >
        {animatedScore}
      </text>
      {maxScore && (
        <text
          x="44"
          y="56"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[9px]"
          fill="var(--text-muted)"
          transform="rotate(90 44 44)"
        >
          / {maxScore}
        </text>
      )}
    </svg>
  );
}

export default function DomainScoreCard({ result, previousResult }: DomainScoreCardProps) {
  const theme = domainTheme[result.domain];
  const animatedScore = useCountUp(result.score, 1200, 200);
  const scoreDisplay = result.maxScore
    ? `${animatedScore} / ${result.maxScore} ${result.scoreUnit}`
    : `${animatedScore.toLocaleString()} ${result.scoreUnit}`;

  const delta = previousResult ? result.score - previousResult.score : null;
  const lowerIsBetter = LOWER_IS_BETTER_DOMAINS.includes(result.domain);
  const improved = delta !== null && delta !== 0 ? (lowerIsBetter ? delta < 0 : delta > 0) : null;

  return (
    <div
      className="glass rounded-2xl overflow-hidden card-hover"
      style={{ boxShadow: `0 0 32px ${theme.glow}` }}
    >
      {/* Color accent bar */}
      <div className="h-[2px]" style={{ background: `linear-gradient(90deg, ${theme.color}, transparent)` }} />

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-2.5 h-9 rounded-full"
            style={{ background: `linear-gradient(180deg, ${theme.color}, ${theme.color}40)` }}
          />
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-[15px] tracking-tight">{result.domainLabel}</h3>
            <p className="text-[10px] text-[var(--text-muted)] tracking-wide">{result.scaleName}</p>
          </div>
        </div>
        <RiskBadge level={result.riskLevel} size="sm" />
      </div>

      <div className="mx-5 h-px bg-[var(--border-subtle)]" />

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Score */}
        <div className="flex items-center gap-4">
          <ScoreRing score={result.score} animatedScore={animatedScore} maxScore={result.maxScore} color={theme.color} />
          <div>
            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1 font-medium">スコア</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-black text-[var(--text-primary)] tabular-nums">{scoreDisplay}</p>
              {delta !== null && delta !== 0 && (
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    background: improved ? 'rgba(52,211,153,0.12)' : 'rgba(251,113,133,0.12)',
                    color: improved ? '#34d399' : '#fb7185',
                  }}
                >
                  {delta > 0 ? '+' : ''}{delta} {improved ? '改善' : '悪化'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="p-3 rounded-xl bg-[var(--bg-primary)]/30">
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5 font-medium">解釈</p>
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed">
            {result.interpretation}
          </p>
        </div>

        {/* Referral */}
        {result.referralNeeded && result.referralDetail && (
          <div
            className="p-3 rounded-xl border"
            style={{
              background: 'rgba(251, 113, 133, 0.06)',
              borderColor: 'rgba(251, 113, 133, 0.2)',
            }}
          >
            <p className="text-[10px] font-bold text-[var(--accent-rose)] uppercase tracking-wider mb-1">
              受診勧奨
            </p>
            <p className="text-[13px] text-[var(--text-secondary)]">{result.referralDetail}</p>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-2 font-medium">推奨アクション</p>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)]">
                <span
                  className="w-1.5 h-1.5 rounded-full mt-[7px] shrink-0"
                  style={{ background: theme.color }}
                />
                <span className="leading-relaxed">{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
