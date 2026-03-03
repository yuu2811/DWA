'use client';

import { AssessmentResult, DomainResult } from '@/lib/types';
import { DOMAIN_COLORS } from '@/lib/constants';

interface KeyFindingsSummaryProps {
  result: AssessmentResult;
  previousResult?: AssessmentResult | null;
}

function getWorstDomain(domains: DomainResult[]): DomainResult | null {
  const high = domains.filter((d) => d.riskLevel === 'high');
  if (high.length > 0) return high[0];
  const moderate = domains.filter((d) => d.riskLevel === 'moderate');
  if (moderate.length > 0) return moderate[0];
  return null;
}

function getNextFollowUpDays(result: AssessmentResult): number {
  if (result.overallRisk === 'high') return 14;
  if (result.overallRisk === 'moderate') return 30;
  return 90;
}

export default function KeyFindingsSummary({ result, previousResult }: KeyFindingsSummaryProps) {
  const worst = getWorstDomain(result.domains);
  const highCount = result.domains.filter((d) => d.riskLevel === 'high').length;
  const moderateCount = result.domains.filter((d) => d.riskLevel === 'moderate').length;
  const allGood = highCount === 0 && moderateCount === 0;
  const followUpDays = getNextFollowUpDays(result);

  // Improvement summary
  let improvementSummary: string | null = null;
  if (previousResult) {
    const prevHighCount = previousResult.domains.filter((d) => d.riskLevel === 'high').length;
    const prevModerateCount = previousResult.domains.filter((d) => d.riskLevel === 'moderate').length;
    const prevTotal = prevHighCount * 2 + prevModerateCount;
    const currentTotal = highCount * 2 + moderateCount;
    if (currentTotal < prevTotal) {
      improvementSummary = '前回から全体的に改善が見られます';
    } else if (currentTotal > prevTotal) {
      improvementSummary = '前回より注意が必要な領域が増えています';
    }
  }

  if (allGood) {
    return (
      <div
        className="glass rounded-2xl p-5 border animate-fade-up"
        style={{
          borderColor: 'rgba(52, 211, 153, 0.2)',
          background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.06), rgba(52, 211, 153, 0.02))',
        }}
      >
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-emerald-400 mb-1">全領域で良好な結果です</p>
            <p className="text-sm text-[var(--text-secondary)]">
              現在の健康状態を維持してください。次回フォローアップ推奨: 約{followUpDays}日後
            </p>
            {improvementSummary && (
              <p className="text-[11px] text-emerald-400/80 mt-1">{improvementSummary}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="glass rounded-2xl p-5 border animate-fade-up"
      style={{
        borderColor: highCount > 0 ? 'rgba(251, 113, 133, 0.2)' : 'rgba(251, 191, 36, 0.2)',
        background: highCount > 0
          ? 'linear-gradient(135deg, rgba(251, 113, 133, 0.06), rgba(251, 113, 133, 0.02))'
          : 'linear-gradient(135deg, rgba(251, 191, 36, 0.06), rgba(251, 191, 36, 0.02))',
      }}
    >
      <div className="flex items-start gap-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: highCount > 0 ? 'rgba(251,113,133,0.1)' : 'rgba(251,191,36,0.1)' }}
        >
          <svg
            className="w-5 h-5"
            style={{ color: highCount > 0 ? '#fb7185' : '#fbbf24' }}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <p className="font-bold text-[var(--text-primary)]">
              {highCount > 0
                ? `${highCount}領域で要対応`
                : `${moderateCount}領域で要改善`}
            </p>
            <span className="text-[10px] text-[var(--text-muted)] px-2 py-0.5 rounded-md bg-[var(--bg-card)]">
              次回推奨: {followUpDays}日後
            </span>
          </div>

          {worst && (
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full" style={{ background: DOMAIN_COLORS[worst.domain] }} />
              <span className="text-sm text-[var(--text-secondary)]">
                最も注意が必要: <strong className="text-[var(--text-primary)]">{worst.domainLabel}</strong>
                {worst.referralDetail && ` — ${worst.referralDetail}`}
              </span>
            </div>
          )}

          {/* Urgent action count */}
          {highCount > 0 && (
            <p className="text-[11px] text-[var(--accent-rose)]">
              緊急アクションが含まれています。下記アクションプランを確認してください。
            </p>
          )}

          {improvementSummary && (
            <p className={`text-[11px] mt-1 ${improvementSummary.includes('改善') ? 'text-emerald-400/80' : 'text-rose-400/80'}`}>
              {improvementSummary}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
