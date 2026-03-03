'use client';

import { useState, useEffect, useCallback } from 'react';
import { ActionPlan } from '@/lib/types';
import { getActionProgress, toggleActionComplete } from '@/lib/storage';
import ActionCard, { priorityConfig } from './ActionCard';

interface ActionPlanPanelProps {
  plan: ActionPlan;
  assessmentId?: string;
}

export default function ActionPlanPanel({ plan, assessmentId }: ActionPlanPanelProps) {
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (assessmentId) {
      setProgress(getActionProgress(assessmentId));
    }
  }, [assessmentId]);

  const handleToggle = useCallback((actionId: string) => {
    if (!assessmentId) return;
    const updated = toggleActionComplete(assessmentId, actionId);
    setProgress({ ...updated });
  }, [assessmentId]);

  const completedCount = plan.actions.filter((a) => progress[a.id]).length;
  const urgentActions = plan.actions.filter((a) => a.priority === 'urgent');
  const recommendedActions = plan.actions.filter((a) => a.priority === 'recommended');
  const optionalActions = plan.actions.filter((a) => a.priority === 'optional');

  const groups = [
    { key: 'urgent', label: '緊急対応', actions: urgentActions, color: '#fb7185' },
    { key: 'recommended', label: '推奨対応', actions: recommendedActions, color: '#638cff' },
    { key: 'optional', label: '維持・任意', actions: optionalActions, color: '#34d399' },
  ].filter((g) => g.actions.length > 0);

  let globalIndex = 0;

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-[var(--accent-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              アクションプラン
            </h3>
            <p className="text-[11px] text-[var(--text-muted)]">
              {completedCount}/{plan.actions.length}件 完了
            </p>
          </div>
        </div>

        {/* Priority summary */}
        <div className="flex items-center gap-2">
          {urgentActions.length > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{
                background: priorityConfig.urgent.bg,
                color: priorityConfig.urgent.color,
                border: `1px solid ${priorityConfig.urgent.border}`,
              }}
            >
              緊急 {urgentActions.length}
            </span>
          )}
          {recommendedActions.length > 0 && (
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-md"
              style={{
                background: priorityConfig.recommended.bg,
                color: priorityConfig.recommended.color,
                border: `1px solid ${priorityConfig.recommended.border}`,
              }}
            >
              推奨 {recommendedActions.length}
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      {assessmentId && plan.actions.length > 0 && (
        <div>
          <div className="progress-track rounded-full overflow-hidden" style={{ height: '4px' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              role="progressbar"
              aria-valuenow={completedCount}
              aria-valuemin={0}
              aria-valuemax={plan.actions.length}
              aria-label={`アクションプラン進捗: ${completedCount}/${plan.actions.length}件完了`}
              style={{
                width: `${(completedCount / plan.actions.length) * 100}%`,
                background: completedCount === plan.actions.length
                  ? '#34d399'
                  : 'linear-gradient(90deg, var(--accent-blue), var(--accent-purple))',
              }}
            />
          </div>
        </div>
      )}

      {/* Action groups */}
      {groups.map((group) => (
        <div key={group.key}>
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-1.5 h-4 rounded-full"
              style={{ background: group.color }}
            />
            <p className="text-[11px] text-[var(--text-muted)] uppercase tracking-wider font-semibold">
              {group.label}
            </p>
          </div>
          <div className="space-y-3">
            {group.actions.map((action) => {
              const idx = globalIndex++;
              return (
                <ActionCard
                  key={action.id}
                  action={action}
                  index={idx}
                  completed={!!progress[action.id]}
                  onToggle={() => handleToggle(action.id)}
                />
              );
            })}
          </div>
        </div>
      ))}

      {/* Print-optimized version */}
      <div className="hidden print:block space-y-4 border-t border-[var(--border-subtle)] pt-4">
        <h3 className="font-bold text-base mb-2">アクションプラン</h3>
        {plan.actions.map((action) => (
          <div key={action.id} className="mb-3 pl-2 border-l-2" style={{ borderColor: priorityConfig[action.priority].color }}>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-[10px] font-bold uppercase" style={{ color: priorityConfig[action.priority].color }}>
                [{priorityConfig[action.priority].label}]
              </span>
              <span className="text-[10px]">{action.timeline}</span>
              <span className="text-[10px]">| {action.actorLabel}</span>
            </div>
            <p className="text-xs font-bold mb-0.5">{action.title}</p>
            <p className="text-[10px] mb-1">{action.description}</p>
            {action.checklist && (
              <ul className="text-[10px] space-y-0.5 pl-3">
                {action.checklist.map((item, j) => (
                  <li key={j}>□ {item}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
