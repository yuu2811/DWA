'use client';

import { Question } from '@/lib/types';

interface LikertScaleProps {
  question: Question;
  value: number | undefined;
  onChange: (value: number) => void;
  questionNumber: number;
}

export default function LikertScale({
  question,
  value,
  onChange,
  questionNumber,
}: LikertScaleProps) {
  return (
    <div className="py-5 border-b border-[var(--border-subtle)] last:border-b-0">
      <p className="text-sm text-[var(--text-primary)] mb-3 leading-relaxed">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-md bg-[var(--bg-card)] text-[var(--text-muted)] text-[11px] font-semibold mr-2.5 shrink-0">
          {questionNumber}
        </span>
        {question.text}
      </p>
      <div className="flex flex-wrap gap-2 pl-8">
        {question.options.map((option) => {
          const selected = value === option.value;
          return (
            <button
              key={`${question.id}-${option.value}`}
              type="button"
              onClick={() => onChange(option.value)}
              className={`option-pill px-3.5 py-2 rounded-xl text-[13px] border transition-all
                ${selected
                  ? 'bg-[var(--accent-blue)]/10 border-[var(--accent-blue)]/40 text-[var(--accent-blue)] font-medium shadow-sm shadow-blue-500/10'
                  : 'bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }
              `}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
