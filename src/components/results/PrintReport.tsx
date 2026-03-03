import { AssessmentResult, StoredAssessment, ActionPlan } from '@/lib/types';

interface PrintReportProps {
  result: AssessmentResult;
  stored?: StoredAssessment | null;
  actionPlan: ActionPlan;
  previousResult?: AssessmentResult | null;
}

const riskText: Record<string, string> = {
  low: '良好',
  moderate: '要改善',
  high: '要対応',
};

export default function PrintReport({ result, stored, actionPlan, previousResult }: PrintReportProps) {
  const profile = stored?.profile;
  const deltas = previousResult
    ? result.domains.map((d) => {
        const prev = previousResult.domains.find((pd) => pd.domain === d.domain);
        if (!prev) return null;
        const delta = d.score - prev.score;
        const lowerIsBetter = ['sleep', 'stress', 'fatigue'].includes(d.domain);
        const improved = lowerIsBetter ? delta < 0 : delta > 0;
        return { domain: d.domain, delta, improved, neutral: delta === 0 };
      }).filter(Boolean) as { domain: string; delta: number; improved: boolean; neutral: boolean }[]
    : null;

  return (
    <div className="hidden print:block text-black bg-white" style={{ fontSize: '11px', lineHeight: '1.6' }}>
      {/* Header */}
      <div className="border-b-2 border-black pb-3 mb-4">
        <h1 className="text-lg font-bold text-center mb-1">
          ドライバー健康スクリーニング報告書
        </h1>
        <p className="text-center text-[10px] text-gray-500">
          DWA - Driver Wellness Assessment
        </p>
      </div>

      {/* Metadata table */}
      <table className="w-full mb-4" style={{ borderCollapse: 'collapse' }}>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-bold w-20">評価日</td>
            <td className="border border-gray-300 px-2 py-1 w-40">{result.assessmentDate}</td>
            <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-bold w-20">氏名</td>
            <td className="border border-gray-300 px-2 py-1">{profile?.name ?? '—'}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-bold">社員番号</td>
            <td className="border border-gray-300 px-2 py-1">{profile?.employeeId || '—'}</td>
            <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-bold">年齢</td>
            <td className="border border-gray-300 px-2 py-1">{profile?.age ? `${profile.age}歳` : '—'}</td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-bold">所属</td>
            <td className="border border-gray-300 px-2 py-1">{profile?.company || '—'}</td>
            <td className="border border-gray-300 px-2 py-1 bg-gray-50 font-bold">車種</td>
            <td className="border border-gray-300 px-2 py-1">
              {profile?.vehicleType === 'truck' ? 'トラック' : profile?.vehicleType === 'bus' ? 'バス' : profile?.vehicleType === 'taxi' ? 'タクシー' : profile?.vehicleType === 'other' ? 'その他' : '—'}
            </td>
          </tr>
        </tbody>
      </table>

      {/* Overall result */}
      <div className="mb-4 p-3 border-2 border-gray-400 rounded">
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-sm">総合判定</span>
          <span className="text-sm font-bold px-3 py-0.5 border-2 rounded" style={{
            borderColor: result.overallRisk === 'low' ? '#059669' : result.overallRisk === 'moderate' ? '#d97706' : '#dc2626',
            color: result.overallRisk === 'low' ? '#059669' : result.overallRisk === 'moderate' ? '#d97706' : '#dc2626',
          }}>
            {riskText[result.overallRisk]}
          </span>
        </div>
        <p className="text-[10px]">{result.overallSummary}</p>
      </div>

      {/* Domain scores table */}
      <table className="w-full mb-4" style={{ borderCollapse: 'collapse' }}>
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 px-2 py-1.5 text-left font-bold">領域</th>
            <th className="border border-gray-300 px-2 py-1.5 text-left font-bold">尺度</th>
            <th className="border border-gray-300 px-2 py-1.5 text-center font-bold">スコア</th>
            <th className="border border-gray-300 px-2 py-1.5 text-center font-bold">判定</th>
            {previousResult && <th className="border border-gray-300 px-2 py-1.5 text-center font-bold">前回比</th>}
            <th className="border border-gray-300 px-2 py-1.5 text-center font-bold">要受診</th>
          </tr>
        </thead>
        <tbody>
          {result.domains.map((d) => {
            const deltaInfo = deltas?.find((dl) => dl.domain === d.domain);
            return (
              <tr key={d.domain}>
                <td className="border border-gray-300 px-2 py-1 font-medium">{d.domainLabel}</td>
                <td className="border border-gray-300 px-2 py-1 text-[10px]">{d.scaleName}</td>
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {d.score}{d.maxScore ? `/${d.maxScore}` : ''} {d.scoreUnit}
                </td>
                <td className="border border-gray-300 px-2 py-1 text-center font-bold" style={{
                  color: d.riskLevel === 'low' ? '#059669' : d.riskLevel === 'moderate' ? '#d97706' : '#dc2626',
                }}>
                  {riskText[d.riskLevel]}
                </td>
                {previousResult && (
                  <td className="border border-gray-300 px-2 py-1 text-center text-[10px]">
                    {deltaInfo && !deltaInfo.neutral
                      ? `${deltaInfo.delta > 0 ? '+' : ''}${deltaInfo.delta} ${deltaInfo.improved ? '(改善)' : '(悪化)'}`
                      : '—'}
                  </td>
                )}
                <td className="border border-gray-300 px-2 py-1 text-center">
                  {d.referralNeeded ? '○' : '—'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Referral details */}
      {result.referralRecommended && (
        <div className="mb-4 p-3 border border-gray-400 rounded bg-gray-50">
          <p className="font-bold mb-1">受診勧奨事項</p>
          <ul className="space-y-1">
            {result.domains.filter((d) => d.referralNeeded).map((d) => (
              <li key={d.domain} className="flex gap-1">
                <span className="shrink-0">・</span>
                <span><strong>{d.domainLabel}:</strong> {d.referralDetail}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action plan */}
      <div className="mb-6">
        <p className="font-bold text-sm mb-2 border-b border-gray-300 pb-1">アクションプラン</p>
        {actionPlan.actions.map((action) => (
          <div key={action.id} className="mb-2 pl-2 border-l-2 border-gray-400">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold">
                [{action.priority === 'urgent' ? '緊急' : action.priority === 'recommended' ? '推奨' : '任意'}]
              </span>
              <span className="text-[10px]">{action.timeline} | {action.actorLabel}</span>
            </div>
            <p className="font-bold text-[11px]">{action.title}</p>
            <p className="text-[10px] text-gray-600">{action.description}</p>
            {action.checklist && (
              <ul className="text-[10px] space-y-0.5 pl-3 mt-1">
                {action.checklist.map((item, j) => (
                  <li key={j}>□ {item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      {/* Signature area */}
      <div className="mt-8 pt-4 border-t-2 border-gray-400">
        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="font-bold mb-8">産業医所見・コメント:</p>
            <div className="border-b border-gray-300 mb-3 h-16" />
          </div>
          <div className="text-right">
            <p className="mb-3 text-[10px] text-gray-500">上記の通り報告します。</p>
            <div className="inline-block text-left">
              <p className="mb-6">
                産業医署名: ___________________
              </p>
              <p>
                日付: _____年 _____月 _____日
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-2 border-t border-gray-200 text-[9px] text-gray-400">
        <p>
          ※ 本報告書はDWA（Driver Wellness Assessment）により自動生成されたものです。
          評価結果の解釈および受診勧奨の最終判断は産業医等の医療専門職が行ってください。
        </p>
      </div>
    </div>
  );
}
