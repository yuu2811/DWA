'use client';

import { DomainResult } from '@/lib/types';
import { useCountUp } from '@/hooks/useCountUp';
import RiskBadge from './RiskBadge';

interface DomainScoreCardProps {
  result: DomainResult;
  previousResult?: DomainResult;
}

const domainTheme: Record<string, { color: string; glow: string; label: string }> = {
  sleep: { color: '#638cff', glow: 'var(--glow-blue)', label: 'border-blue-500/20' },
  stress: { color: '#a78bfa', glow: 'rgba(167, 139, 250, 0.15)', label: 'border-purple-500/20' },
  fatigue: { color: '#fb7185', glow: 'var(--glow-rose)', label: 'border-rose-500/20' },
  diet: { color: '#34d399', glow: 'var(--glow-emerald)', label: 'border-emerald-500/20' },
  exercise: { color: '#fbbf24', glow: 'var(--glow-amber)', label: 'border-amber-500/20' },
};

function ScoreRing({ score, animatedScore, maxScore, color }: { score: number; animatedScore: number; maxScore: number | null; color: string }) {
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const ratio = maxScore ? Math.min(animatedScore / maxScore, 1) : Math.min(animatedScore / Math.max(score, 1), 0.5);
  const offset = circumference * (1 - ratio);

  return (
    <svg width="80" height="80" viewBox="0 0 80 80" className="score-ring shrink-0">
      <circle cx="40" cy="40" r={radius} className="score-ring-track" />
      <circle
        cx="40"
        cy="40"
        r={radius}
        className="score-ring-fill"
        stroke={color}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
      />
      <text
        x="40"
        y="38"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-lg font-bold"
        fill="var(--text-primary)"
        transform="rotate(90 40 40)"
      >
        {animatedScore}
      </text>
      {maxScore && (
        <text
          x="40"
          y="52"
          textAnchor="middle"
          dominantBaseline="middle"
          className="text-[9px]"
          fill="var(--text-muted)"
          transform="rotate(90 40 40)"
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

  // Delta calculation
  const delta = previousResult ? result.score - previousResult.score : null;
  const lowerIsBetter = ['sleep', 'stress', 'fatigue'].includes(result.domain);
  const improved = delta !== null && delta !== 0 ? (lowerIsBetter ? delta < 0 : delta > 0) : null;

  return (
    <div
      className="glass rounded-2xl overflow-hidden transition-all hover:scale-[1.01]"
      style={{ boxShadow: `0 0 32px ${theme.glow}` }}
    >
      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-8 rounded-full"
            style={{ background: theme.color }}
          />
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-[15px]">{result.domainLabel}</h3>
            <p className="text-[11px] text-[var(--text-muted)]">{result.scaleName}</p>
          </div>
        </div>
        <RiskBadge level={result.riskLevel} size="sm" />
      </div>

      {/* Body */}
      <div className="px-5 py-4 space-y-4">
        {/* Score display */}
        <div className="flex items-center gap-4">
          <ScoreRing score={result.score} animatedScore={animatedScore} maxScore={result.maxScore} color={theme.color} />
          <div>
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">スコア</p>
            <div className="flex items-center gap-2">
              <p className="text-xl font-bold text-[var(--text-primary)]">{scoreDisplay}</p>
              {delta !== null && delta !== 0 && (
                <span
                  className="text-xs font-bold px-1.5 py-0.5 rounded-md"
                  style={{
                    background: improved ? 'rgba(52,211,153,0.12)' : 'rgba(251,113,133,0.12)',
                    color: improved ? '#34d399' : '#fb7185',
                  }}
                >
                  {delta > 0 ? '+' : ''}{delta} {improved ? '↑改善' : '↓悪化'}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div>
          <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1">解釈</p>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
            {result.interpretation}
          </p>
        </div>

        {/* Referral alert */}
        {result.referralNeeded && result.referralDetail && (
          <div
            className="p-3 rounded-xl border"
            style={{
              background: 'rgba(251, 113, 133, 0.06)',
              borderColor: 'rgba(251, 113, 133, 0.2)',
            }}
          >
            <p className="text-[11px] font-semibold text-[var(--accent-rose)] uppercase tracking-wider mb-1">
              受診勧奨
            </p>
            <p className="text-sm text-[var(--text-secondary)]">{result.referralDetail}</p>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">推奨アクション</p>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
                <span
                  className="w-1 h-1 rounded-full mt-2 shrink-0"
                  style={{ background: theme.color }}
                />
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
