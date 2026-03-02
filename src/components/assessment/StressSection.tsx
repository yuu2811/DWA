'use client';

import { StressAnswers } from '@/lib/types';
import { stressSection } from '@/lib/questions/stress';
import LikertScale from './LikertScale';

interface StressSectionProps {
  answers: StressAnswers;
  onChange: (answers: StressAnswers) => void;
}

export default function StressSection({ answers, onChange }: StressSectionProps) {
  const handleChange = (index: number, value: number) => {
    const newItems = [...answers.items];
    newItems[index] = value;
    onChange({ items: newItems });
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-[11px] font-medium text-purple-400 bg-purple-500/10 px-2.5 py-1 rounded-lg mb-2">
          {stressSection.scaleName}
        </span>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{stressSection.description}</p>
      </div>
      <div>
        {stressSection.questions.map((q, i) => (
          <LikertScale key={q.id} question={q} value={answers.items[i]} onChange={(val) => handleChange(i, val)} questionNumber={i + 1} />
        ))}
      </div>
    </div>
  );
}
