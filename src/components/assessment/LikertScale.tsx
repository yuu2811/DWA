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
    <div className="py-4 border-b border-slate-100 last:border-b-0">
      <p className="text-sm font-medium text-slate-700 mb-3">
        <span className="text-slate-400 mr-2">Q{questionNumber}.</span>
        {question.text}
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {question.options.map((option) => (
          <button
            key={`${question.id}-${option.value}`}
            type="button"
            onClick={() => onChange(option.value)}
            className={`text-left px-3 py-2 rounded-lg border text-sm transition-colors ${
              value === option.value
                ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
