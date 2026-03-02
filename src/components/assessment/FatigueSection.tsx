'use client';

import { FatigueAnswers } from '@/lib/types';
import { fatigueSection } from '@/lib/questions/fatigue';
import LikertScale from './LikertScale';

interface FatigueSectionProps {
  answers: FatigueAnswers;
  onChange: (answers: FatigueAnswers) => void;
}

export default function FatigueSection({
  answers,
  onChange,
}: FatigueSectionProps) {
  const handleChange = (index: number, value: number) => {
    const newItems = [...answers.items];
    newItems[index] = value;
    onChange({ items: newItems });
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded mb-2">
          {fatigueSection.scaleName}
        </span>
        <p className="text-sm text-slate-600">{fatigueSection.description}</p>
      </div>
      <div className="space-y-1">
        {fatigueSection.questions.map((q, i) => (
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
