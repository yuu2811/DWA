'use client';

import { academicReferences } from '@/lib/references';

const domainLabels = {
  sleep: '睡眠',
  stress: 'ストレス',
  diet: '食事・栄養',
  exercise: '運動・身体活動',
};

export default function AcademicReferences() {
  const domains = ['sleep', 'stress', 'diet', 'exercise'] as const;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 md:p-6">
      <h3 className="font-bold text-slate-800 mb-4">
        使用尺度・学術的根拠
      </h3>
      {domains.map((domain) => {
        const refs = academicReferences.filter((r) => r.domain === domain);
        if (refs.length === 0) return null;
        return (
          <div key={domain} className="mb-4 last:mb-0">
            <h4 className="text-sm font-semibold text-slate-600 mb-2">
              {domainLabels[domain]}
            </h4>
            <ol className="space-y-2">
              {refs.map((ref, i) => (
                <li
                  key={ref.id}
                  className="text-xs text-slate-500 leading-relaxed pl-4"
                >
                  <span className="text-slate-400">[{i + 1}] </span>
                  {ref.authors}. {ref.title}. <em>{ref.journal}</em>.{' '}
                  {ref.year}.
                  {ref.volume && ` ${ref.volume}`}
                  {ref.pages && `: ${ref.pages}`}
                  {ref.doi && `. doi: ${ref.doi}`}
                  {ref.note && (
                    <span className="block text-slate-400 mt-0.5">
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
  );
}
