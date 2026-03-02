'use client';

import { useState } from 'react';
import { academicReferences } from '@/lib/references';

const domainConfig: Record<string, { label: string; color: string }> = {
  sleep: { label: '睡眠', color: '#638cff' },
  stress: { label: 'ストレス', color: '#a78bfa' },
  fatigue: { label: '疲労', color: '#fb7185' },
  diet: { label: '食事・栄養', color: '#34d399' },
  exercise: { label: '運動・身体活動', color: '#fbbf24' },
};

const domains = ['sleep', 'stress', 'fatigue', 'diet', 'exercise'] as const;

export default function AcademicReferences() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="glass rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[var(--bg-card-hover)] transition-colors no-print"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[var(--bg-card)] flex items-center justify-center">
            <svg className="w-4 h-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-[var(--text-primary)] text-sm">使用尺度・学術的根拠</h3>
            <p className="text-[11px] text-[var(--text-muted)]">{academicReferences.length}件の参考文献</p>
          </div>
        </div>
        <svg
          className={`w-4 h-4 text-[var(--text-muted)] transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Interactive expand/collapse for screen */}
      {expanded && (
        <div className="px-5 pb-5 space-y-5 border-t border-[var(--border-subtle)] no-print">
          {domains.map((domain) => {
            const refs = academicReferences.filter((r) => r.domain === domain);
            if (refs.length === 0) return null;
            const cfg = domainConfig[domain];
            return (
              <div key={domain} className="pt-4">
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className="w-1.5 h-4 rounded-full"
                    style={{ background: cfg.color }}
                  />
                  <h4 className="text-xs font-semibold text-[var(--text-secondary)] tracking-wide">
                    {cfg.label}
                  </h4>
                </div>
                <ol className="space-y-2.5">
                  {refs.map((ref, i) => (
                    <li
                      key={ref.id}
                      className="text-[11px] text-[var(--text-muted)] leading-relaxed pl-4"
                    >
                      <span className="text-[var(--text-secondary)] font-medium">[{i + 1}] </span>
                      {ref.authors}. {ref.title}. <em className="text-[var(--text-secondary)]">{ref.journal}</em>.{' '}
                      {ref.year}.
                      {ref.volume && ` ${ref.volume}`}
                      {ref.pages && `: ${ref.pages}`}
                      {ref.doi && `. doi: ${ref.doi}`}
                      {ref.note && (
                        <span className="block text-[var(--text-muted)] mt-0.5 opacity-70">
                          {ref.note}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      )}

      {/* Always visible in print */}
      <div className="hidden print:block px-5 pb-5 space-y-4 border-t border-[var(--border-subtle)]">
        <h3 className="font-bold pt-3 mb-2">使用尺度・学術的根拠</h3>
        {domains.map((domain) => {
          const refs = academicReferences.filter((r) => r.domain === domain);
          if (refs.length === 0) return null;
          const cfg = domainConfig[domain];
          return (
            <div key={domain}>
              <h4 className="text-xs font-semibold mb-1.5">{cfg.label}</h4>
              <ol className="space-y-1">
                {refs.map((ref, i) => (
                  <li key={ref.id} className="text-[10px] leading-relaxed pl-3">
                    [{i + 1}] {ref.authors}. {ref.title}. <em>{ref.journal}</em>. {ref.year}.
                    {ref.volume && ` ${ref.volume}`}
                    {ref.pages && `: ${ref.pages}`}
                    {ref.doi && `. doi: ${ref.doi}`}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>
    </div>
  );
}
