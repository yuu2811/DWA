'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StoredAssessment } from '@/lib/types';
import { getHistory } from '@/lib/storage';

const riskConfig: Record<string, { text: string; color: string; bg: string; border: string }> = {
  low: { text: '良好', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
  moderate: { text: '要改善', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
  high: { text: '要対応', color: '#fb7185', bg: 'rgba(251,113,133,0.1)', border: 'rgba(251,113,133,0.2)' },
};

const domainColors: Record<string, string> = {
  sleep: '#638cff', stress: '#a78bfa', fatigue: '#fb7185', diet: '#34d399', exercise: '#fbbf24',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatDateShort(iso: string) {
  return new Date(iso).toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
}

export default function HistoryPage() {
  const [history, setHistory] = useState<StoredAssessment[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setHistory(getHistory().slice().reverse()); // newest first
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600/[0.03] blur-3xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-purple-600/[0.04] blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <header className="pt-8 pb-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white text-xs font-black">D</span>
              </div>
              <span className="text-sm font-medium text-[var(--text-muted)] group-hover:text-[var(--text-primary)] tracking-wider uppercase transition-colors">
                DWA
              </span>
            </Link>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-medium rounded-xl transition-all shadow-lg shadow-blue-600/20"
            >
              新しい診断
            </Link>
          </div>
        </header>

        <main className="pt-8 pb-20">
          <div className="mb-8 animate-fade-up">
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">診断履歴</h1>
            <p className="text-sm text-[var(--text-secondary)] mt-1">
              過去の診断結果を確認・比較できます（{history.length}件）
            </p>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-20 animate-fade-up">
              <div className="w-16 h-16 rounded-2xl bg-[var(--bg-card)] flex items-center justify-center mx-auto mb-6">
                <svg className="w-7 h-7 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-[var(--text-secondary)] mb-4">診断履歴がありません</p>
              <Link
                href="/assessment"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20"
              >
                最初の診断を開始する
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((assessment, idx) => {
                const risk = riskConfig[assessment.result.overallRisk];
                const prev = idx < history.length - 1 ? history[idx + 1] : null; // previous in time (history is reversed)

                return (
                  <Link
                    key={assessment.id}
                    href={`/results?id=${assessment.id}`}
                    className="block glass rounded-2xl p-5 hover:bg-[var(--bg-card-hover)] transition-all animate-fade-up group"
                    style={{ animationDelay: `${Math.min(idx * 0.05, 0.3)}s` }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-[var(--text-primary)] group-hover:text-white transition-colors">
                          {formatDate(assessment.date)}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] mt-0.5">
                          {assessment.profile.name}
                          {assessment.profile.employeeId && ` (${assessment.profile.employeeId})`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span
                          className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
                          style={{ background: risk.bg, color: risk.color, border: `1px solid ${risk.border}` }}
                        >
                          {risk.text}
                        </span>
                        <svg className="w-4 h-4 text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>

                    {/* Domain dots */}
                    <div className="flex items-center gap-3">
                      {assessment.result.domains.map((d) => (
                        <div key={d.domain} className="flex items-center gap-1.5">
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ background: domainColors[d.domain] }}
                          />
                          <span className="text-[11px] text-[var(--text-muted)]">
                            {d.domainLabel}
                          </span>
                          <span
                            className="text-[10px] font-medium"
                            style={{ color: riskConfig[d.riskLevel]?.color }}
                          >
                            {d.score}{d.scoreUnit === '点' ? '' : ''}
                          </span>
                          {/* Delta from previous */}
                          {prev && (() => {
                            const prevDomain = prev.result.domains.find((pd) => pd.domain === d.domain);
                            if (!prevDomain) return null;
                            const delta = d.score - prevDomain.score;
                            if (delta === 0) return null;
                            // For sleep/stress/fatigue: lower is better. For diet/exercise: higher is better.
                            const lowerIsBetter = ['sleep', 'stress', 'fatigue'].includes(d.domain);
                            const improved = lowerIsBetter ? delta < 0 : delta > 0;
                            return (
                              <span className={`text-[9px] font-medium ${improved ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {delta > 0 ? '+' : ''}{delta}
                              </span>
                            );
                          })()}
                        </div>
                      ))}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Mini trend overview */}
          {history.length >= 2 && (
            <div className="mt-12 glass rounded-2xl p-6 animate-fade-up animate-delay-2">
              <h3 className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-4">
                総合判定の推移
              </h3>
              <div className="flex items-end gap-1" style={{ height: '60px' }}>
                {history.slice().reverse().map((a, i) => {
                  const h = a.result.overallRisk === 'low' ? 20 : a.result.overallRisk === 'moderate' ? 40 : 60;
                  const c = riskConfig[a.result.overallRisk].color;
                  return (
                    <div key={a.id} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full max-w-[32px] rounded-t-md transition-all"
                        style={{ height: `${h}px`, background: c, opacity: 0.7 + (i / history.length) * 0.3 }}
                      />
                      <span className="text-[8px] text-[var(--text-muted)]">{formatDateShort(a.date)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
