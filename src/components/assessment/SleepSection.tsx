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
        <span className="inline-block text-[11px] font-medium text-blue-400 bg-blue-500/10 px-2.5 py-1 rounded-lg mb-2">
          {sleepSection.scaleName}
        </span>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{sleepSection.description}</p>
      </div>
      <div>
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
