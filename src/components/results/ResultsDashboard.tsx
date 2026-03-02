'use client';

import { AssessmentResult } from '@/lib/types';
import RiskBadge from './RiskBadge';
import DomainScoreCard from './DomainScoreCard';
import AcademicReferences from './AcademicReferences';

interface ResultsDashboardProps {
  result: AssessmentResult;
}

export default function ResultsDashboard({ result }: ResultsDashboardProps) {
  const overallBgColor =
    result.overallRisk === 'high'
      ? 'bg-red-50 border-red-200'
      : result.overallRisk === 'moderate'
        ? 'bg-yellow-50 border-yellow-200'
        : 'bg-green-50 border-green-200';

  return (
    <div className="space-y-6">
      {/* 総合判定 */}
      <div className={`rounded-2xl border p-6 md:p-8 ${overallBgColor}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <p className="text-sm text-slate-500 mb-1">総合判定</p>
            <h2 className="text-2xl font-bold text-slate-800">
              健康リスク評価結果
            </h2>
          </div>
          <RiskBadge level={result.overallRisk} size="lg" />
        </div>
        <p className="text-sm text-slate-700 leading-relaxed">
          {result.overallSummary}
        </p>
        <p className="text-xs text-slate-500 mt-3">
          評価日: {result.assessmentDate}
        </p>
      </div>

      {/* 受診勧奨バナー */}
      {result.referralRecommended && (
        <div className="bg-red-600 text-white rounded-xl p-5">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <div>
              <p className="font-bold text-lg">医療機関への受診を推奨します</p>
              <p className="text-sm text-red-100 mt-1">
                以下の領域で専門的な対応が必要と判定されました。産業医から対象者への受診勧奨をお願いします。
              </p>
              <ul className="mt-2 space-y-1">
                {result.domains
                  .filter((d) => d.referralNeeded)
                  .map((d) => (
                    <li key={d.domain} className="text-sm">
                      <span className="font-medium">
                        {d.domainLabel}:
                      </span>{' '}
                      {d.referralDetail}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 領域別スコア */}
      <div>
        <h3 className="text-lg font-bold text-slate-800 mb-4">
          領域別評価結果
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.domains.map((domain) => (
            <DomainScoreCard key={domain.domain} result={domain} />
          ))}
        </div>
      </div>

      {/* 学術的根拠 */}
      <div className="print-break">
        <AcademicReferences />
      </div>

      {/* 免責事項 */}
      <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
        <p className="text-xs text-slate-500 leading-relaxed">
          <span className="font-semibold">免責事項：</span>
          本ツールは健康スクリーニングを目的としたものであり、医学的診断を行うものではありません。
          評価結果の解釈および受診勧奨の最終判断は、必ず産業医等の医療専門職が行ってください。
          使用している尺度は学術的に妥当性が検証されたものですが、個々の状況により精度は異なります。
        </p>
      </div>
    </div>
  );
}
