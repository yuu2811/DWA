'use client';

import { useState } from 'react';
import { ActionItem, ActionPlan, ActionPriority } from '@/lib/types';

interface ActionPlanPanelProps {
  plan: ActionPlan;
}

const priorityConfig: Record<
  ActionPriority,
  { label: string; color: string; bg: string; border: string; glow: string; icon: React.ReactNode }
> = {
  urgent: {
    label: '緊急',
    color: '#fb7185',
    bg: 'rgba(251, 113, 133, 0.08)',
    border: 'rgba(251, 113, 133, 0.2)',
    glow: 'rgba(251, 113, 133, 0.06)',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
      </svg>
    ),
  },
  recommended: {
    label: '推奨',
    color: '#638cff',
    bg: 'rgba(99, 140, 255, 0.08)',
    border: 'rgba(99, 140, 255, 0.2)',
    glow: 'rgba(99, 140, 255, 0.06)',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    ),
  },
  optional: {
    label: '任意',
    color: '#34d399',
    bg: 'rgba(52, 211, 153, 0.08)',
    border: 'rgba(52, 211, 153, 0.2)',
    glow: 'rgba(52, 211, 153, 0.06)',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
  },
};

const actorIcons: Record<string, string> = {
  occupational_physician: '👨‍⚕️',
  specialist: '🏥',
  public_health_nurse: '👩‍⚕️',
  nutritionist: '🥗',
  exercise_instructor: '🏋️',
  driver: '🚛',
};

function ActionCard({ action, index }: { action: ActionItem; index: number }) {
  const [expanded, setExpanded] = useState(action.priority === 'urgent');
  const cfg = priorityConfig[action.priority];

  return (
    <div
      className="glass rounded-xl overflow-hidden transition-all animate-fade-up"
      style={{
        animationDelay: `${index * 0.05}s`,
        boxShadow: `0 0 24px ${cfg.glow}`,
      }}
    >
      {/* Header - always visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3.5 flex items-start gap-3 text-left hover:bg-[var(--bg-card-hover)] transition-colors"
      >
        {/* Priority indicator */}
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span
              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md"
              style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
            >
              {cfg.label}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {action.timeline}
            </span>
          </div>
          <h4 className="text-sm font-bold text-[var(--text-primary)] leading-snug">
            {action.title}
          </h4>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs">{actorIcons[action.actor]}</span>
            <span className="text-[11px] text-[var(--text-muted)]">
              {action.actorLabel}
            </span>
          </div>
        </div>

        {/* Expand chevron */}
        <svg
          className={`w-4 h-4 text-[var(--text-muted)] shrink-0 mt-1.5 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-4 pb-4 pt-0 border-t"
          style={{ borderColor: cfg.border }}
        >
          <p className="text-[13px] text-[var(--text-secondary)] leading-relaxed mt-3 mb-3">
            {action.description}
          </p>

          {action.checklist && action.checklist.length > 0 && (
            <div
              className="rounded-lg p-3"
              style={{ background: 'rgba(255, 255, 255, 0.02)' }}
            >
              <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-semibold mb-2">
                チェックリスト
              </p>
              <ul className="space-y-2">
                {action.checklist.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-[13px] text-[var(--text-secondary)]">
                    <div
                      className="w-4 h-4 rounded border flex items-center justify-center shrink-0 mt-0.5"
                      style={{ borderColor: 'var(--border-subtle)' }}
                    >
                      <span className="text-[8px] text-[var(--text-muted)]">{i + 1}</span>
                    </div>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ActionPlanPanel({ plan }: ActionPlanPanelProps) {
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
              {plan.actions.length}件のアクション
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
              return <ActionCard key={action.id} action={action} index={idx} />;
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
