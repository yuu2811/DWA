'use client';

import { useEffect, useMemo, useState } from 'react';
import { AssessmentResult, StoredAssessment } from '@/lib/types';
import { generateActionPlan } from '@/lib/scoring/actionPlan';
import { getHistory } from '@/lib/storage';
import RiskBadge from './RiskBadge';
import DomainScoreCard from './DomainScoreCard';
import RadarChart from './RadarChart';
import TrendChart from './TrendChart';
import ActionPlanPanel from './ActionPlanPanel';
import AcademicReferences from './AcademicReferences';
import KeyFindingsSummary from './KeyFindingsSummary';
import DoctorNotesPanel from './DoctorNotesPanel';

interface ResultsDashboardProps {
  result: AssessmentResult;
  previousResult?: AssessmentResult | null;
  assessmentId?: string;
}

const riskTheme = {
  low: {
    gradient: 'from-emerald-500/10 to-emerald-600/5',
    border: 'border-emerald-500/20',
    glow: '0 0 60px rgba(52, 211, 153, 0.08)',
  },
  moderate: {
    gradient: 'from-amber-500/10 to-amber-600/5',
    border: 'border-amber-500/20',
    glow: '0 0 60px rgba(251, 191, 36, 0.08)',
  },
  high: {
    gradient: 'from-rose-500/10 to-rose-600/5',
    border: 'border-rose-500/20',
    glow: '0 0 60px rgba(251, 113, 133, 0.08)',
  },
};

function getDomainDelta(current: AssessmentResult, previous: AssessmentResult) {
  return current.domains.map((d) => {
    const prev = previous.domains.find((pd) => pd.domain === d.domain);
    if (!prev) return null;
    const delta = d.score - prev.score;
    // For sleep/stress/fatigue: lower is better. For diet/exercise: higher is better.
    const lowerIsBetter = ['sleep', 'stress', 'fatigue'].includes(d.domain);
    const improved = lowerIsBetter ? delta < 0 : delta > 0;
    return { domain: d.domain, domainLabel: d.domainLabel, delta, improved, neutral: delta === 0 };
  }).filter(Boolean) as { domain: string; domainLabel: string; delta: number; improved: boolean; neutral: boolean }[];
}

export default function ResultsDashboard({ result, previousResult, assessmentId }: ResultsDashboardProps) {
  const theme = riskTheme[result.overallRisk];
  const actionPlan = useMemo(() => generateActionPlan(result), [result]);
  const [history, setHistory] = useState<StoredAssessment[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const deltas = previousResult ? getDomainDelta(result, previousResult) : null;
  const improvedCount = deltas?.filter((d) => d.improved && !d.neutral).length ?? 0;
  const worsedCount = deltas?.filter((d) => !d.improved && !d.neutral).length ?? 0;
  void assessmentId;

  return (
    <div className="space-y-8">
      {/* Change summary banner (if previous exists) */}
      {deltas && (improvedCount > 0 || worsedCount > 0) && (
        <div className="glass rounded-2xl p-5 animate-fade-up border border-[var(--border-subtle)]">
          <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-3">
            前回からの変化
          </p>
          <div className="flex flex-wrap gap-2">
            {deltas.filter((d) => !d.neutral).map((d) => (
              <span
                key={d.domain}
                className="flex items-center gap-1.5 text-[12px] font-medium px-3 py-1.5 rounded-lg"
                style={{
                  background: d.improved ? 'rgba(52,211,153,0.08)' : 'rgba(251,113,133,0.08)',
                  color: d.improved ? '#34d399' : '#fb7185',
                }}
              >
                {d.improved ? '↑' : '↓'} {d.domainLabel}
                <span className="text-[10px] opacity-75">
                  ({d.delta > 0 ? '+' : ''}{d.delta})
                </span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Key findings summary */}
      <KeyFindingsSummary result={result} previousResult={previousResult} />

      {/* Overall assessment + Radar chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-up">
        {/* Overall card */}
        <div
          className={`glass rounded-2xl p-6 border ${theme.border} bg-gradient-to-br ${theme.gradient}`}
          style={{ boxShadow: theme.glow }}
        >
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-1.5">総合判定</p>
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                健康リスク評価
              </h2>
            </div>
            <RiskBadge level={result.overallRisk} size="lg" />
          </div>

          <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-5">
            {result.overallSummary}
          </p>

          {/* Domain risk summary pills */}
          <div className="flex flex-wrap gap-2 mb-4">
            {result.domains.map((d) => (
              <div
                key={d.domain}
                className="flex items-center gap-1.5 text-[11px] text-[var(--text-muted)] bg-[var(--bg-card)] px-2.5 py-1 rounded-lg"
              >
                <span className="font-medium text-[var(--text-secondary)]">{d.domainLabel}</span>
                <RiskBadge level={d.riskLevel} size="sm" />
              </div>
            ))}
          </div>

          <p className="text-[11px] text-[var(--text-muted)]">
            評価日: {result.assessmentDate}
          </p>
        </div>

        {/* Radar chart */}
        <div className="glass rounded-2xl p-6 flex flex-col items-center justify-center">
          <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider mb-2">
            {previousResult ? '5領域バランス（前回比較）' : '5領域バランス'}
          </p>
          <RadarChart domains={result.domains} previousDomains={previousResult?.domains} />
        </div>
      </div>

      {/* Trend chart (when history has 2+ entries) */}
      {history.length >= 2 && (
        <div className="animate-fade-up animate-delay-1">
          <TrendChart history={history} />
        </div>
      )}

      {/* Referral banner */}
      {result.referralRecommended && (
        <div
          className="rounded-2xl p-5 border animate-fade-up animate-delay-1"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 113, 133, 0.08), rgba(251, 113, 133, 0.03))',
            borderColor: 'rgba(251, 113, 133, 0.2)',
            boxShadow: '0 0 40px rgba(251, 113, 133, 0.06)',
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center shrink-0">
              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-[var(--text-primary)] text-lg mb-1">
                医療機関への受診を推奨します
              </p>
              <p className="text-sm text-[var(--text-secondary)] mb-3">
                以下の領域で専門的な対応が必要と判定されました。産業医から対象者への受診勧奨をお願いします。
              </p>
              <ul className="space-y-1.5">
                {result.domains
                  .filter((d) => d.referralNeeded)
                  .map((d) => (
                    <li key={d.domain} className="flex items-start gap-2 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 shrink-0" />
                      <span>
                        <span className="font-medium text-[var(--text-primary)]">
                          {d.domainLabel}:
                        </span>{' '}
                        <span className="text-[var(--text-secondary)]">{d.referralDetail}</span>
                      </span>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Action Plan */}
      <div className="animate-fade-up animate-delay-2">
        <ActionPlanPanel plan={actionPlan} assessmentId={assessmentId} />
      </div>

      {/* Domain score cards */}
      <div className="animate-fade-up animate-delay-3">
        <h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-4">
          領域別評価結果
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.domains.map((domain) => {
            const prevDomain = previousResult?.domains.find((pd) => pd.domain === domain.domain);
            return (
              <DomainScoreCard
                key={domain.domain}
                result={domain}
                previousResult={prevDomain}
              />
            );
          })}
        </div>
      </div>

      {/* Doctor notes */}
      <div className="no-print animate-fade-up animate-delay-3">
        <DoctorNotesPanel assessmentId={assessmentId} />
      </div>

      {/* Academic references */}
      <div className="print-break animate-fade-up animate-delay-4">
        <AcademicReferences />
      </div>

      {/* Disclaimer */}
      <div className="glass-light rounded-2xl p-5 animate-fade-up animate-delay-4">
        <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
          <span className="font-semibold text-[var(--text-secondary)]">免責事項：</span>
          本ツールは健康スクリーニングを目的としたものであり、医学的診断を行うものではありません。
          評価結果の解釈および受診勧奨の最終判断は、必ず産業医等の医療専門職が行ってください。
          使用している尺度は学術的に妥当性が検証されたものですが、個々の状況により精度は異なります。
        </p>
      </div>
    </div>
  );
}
