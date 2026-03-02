'use client';

import { DomainResult } from '@/lib/types';
import RiskBadge from './RiskBadge';

interface DomainScoreCardProps {
  result: DomainResult;
}

const domainColors = {
  sleep: { bg: 'bg-blue-50', border: 'border-blue-200', accent: 'text-blue-600' },
  stress: { bg: 'bg-purple-50', border: 'border-purple-200', accent: 'text-purple-600' },
  diet: { bg: 'bg-green-50', border: 'border-green-200', accent: 'text-green-600' },
  exercise: { bg: 'bg-orange-50', border: 'border-orange-200', accent: 'text-orange-600' },
};

export default function DomainScoreCard({ result }: DomainScoreCardProps) {
  const colors = domainColors[result.domain];
  const scoreDisplay = result.maxScore
    ? `${result.score} / ${result.maxScore} ${result.scoreUnit}`
    : `${result.score.toLocaleString()} ${result.scoreUnit}`;

  return (
    <div className={`rounded-xl border ${colors.border} overflow-hidden`}>
      <div className={`${colors.bg} px-5 py-3 flex items-center justify-between`}>
        <div>
          <h3 className={`font-bold ${colors.accent}`}>{result.domainLabel}</h3>
          <p className="text-xs text-slate-500">{result.scaleName}</p>
        </div>
        <RiskBadge level={result.riskLevel} />
      </div>

      <div className="bg-white px-5 py-4 space-y-4">
        <div>
          <p className="text-sm text-slate-500 mb-1">スコア</p>
          <p className="text-2xl font-bold text-slate-800">{scoreDisplay}</p>
        </div>

        <div>
          <p className="text-sm text-slate-500 mb-1">解釈</p>
          <p className="text-sm text-slate-700 leading-relaxed">
            {result.interpretation}
          </p>
        </div>

        {result.referralNeeded && result.referralDetail && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-semibold text-red-800 mb-1">
              受診勧奨
            </p>
            <p className="text-sm text-red-700">{result.referralDetail}</p>
          </div>
        )}

        <div>
          <p className="text-sm text-slate-500 mb-2">推奨アクション</p>
          <ul className="space-y-1.5">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="text-slate-400 mt-0.5 shrink-0">•</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
