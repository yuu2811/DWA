'use client';

import { DietAnswers } from '@/lib/types';
import { dietSection } from '@/lib/questions/diet';
import LikertScale from './LikertScale';

interface DietSectionProps {
  answers: DietAnswers;
  onChange: (answers: DietAnswers) => void;
}

export default function DietSection({ answers, onChange }: DietSectionProps) {
  const handleChange = (index: number, value: number) => {
    const newItems = [...answers.items];
    newItems[index] = value;
    onChange({ items: newItems });
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded mb-2">
          {dietSection.scaleName}
        </span>
        <p className="text-sm text-slate-600">{dietSection.description}</p>
      </div>
      <div className="space-y-1">
        {dietSection.questions.map((q, i) => (
          <LikertScale
            key={q.id}
            question={q}
            value={answers.items[i]}
            onChange={(val) => handleChange(i, val)}
            questionNumber={i + 1}
          />
        ))}
      </div>
    </div>
  );
}
