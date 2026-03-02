'use client';

import { SleepAnswers } from '@/lib/types';
import { sleepSection } from '@/lib/questions/sleep';
import LikertScale from './LikertScale';

interface SleepSectionProps {
  answers: SleepAnswers;
  onChange: (answers: SleepAnswers) => void;
}

export default function SleepSection({ answers, onChange }: SleepSectionProps) {
  const handleChange = (index: number, value: number) => {
    const newItems = [...answers.items];
    newItems[index] = value;
    onChange({ items: newItems });
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded mb-2">
          {sleepSection.scaleName}
        </span>
        <p className="text-sm text-slate-600">{sleepSection.description}</p>
      </div>
      <div className="space-y-1">
        {sleepSection.questions.map((q, i) => (
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
