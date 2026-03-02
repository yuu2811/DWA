'use client';

import { FatigueAnswers } from '@/lib/types';
import { fatigueSection } from '@/lib/questions/fatigue';
import LikertScale from './LikertScale';

interface FatigueSectionProps {
  answers: FatigueAnswers;
  onChange: (answers: FatigueAnswers) => void;
}

export default function FatigueSection({ answers, onChange }: FatigueSectionProps) {
  const handleChange = (index: number, value: number) => {
    const newItems = [...answers.items];
    newItems[index] = value;
    onChange({ items: newItems });
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-[11px] font-medium text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg mb-2">
          {fatigueSection.scaleName}
        </span>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{fatigueSection.description}</p>
      </div>
      <div>
        {fatigueSection.questions.map((q, i) => (
          <LikertScale key={q.id} question={q} value={answers.items[i]} onChange={(val) => handleChange(i, val)} questionNumber={i + 1} />
        ))}
      </div>
    </div>
  );
}
