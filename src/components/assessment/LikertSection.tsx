'use client';

import { QuestionSection } from '@/lib/types';
import { DOMAIN_ACCENT } from '@/lib/constants';
import LikertScale from './LikertScale';

interface LikertSectionProps {
  section: QuestionSection;
  items: number[];
  onChange: (items: number[]) => void;
}

export default function LikertSection({ section, items, onChange }: LikertSectionProps) {
  const accent = DOMAIN_ACCENT[section.domain];

  const handleChange = (index: number, value: number) => {
    const next = [...items];
    next[index] = value;
    onChange(next);
  };

  return (
    <div>
      <div className="mb-6">
        <span className={`inline-block text-[11px] font-medium ${accent.text} ${accent.bg} px-2.5 py-1 rounded-lg mb-2`}>
          {section.scaleName}
        </span>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{section.description}</p>
      </div>
      <div>
        {section.questions.map((q, i) => (
          <LikertScale
            key={q.id}
            question={q}
            value={items[i]}
            onChange={(val) => handleChange(i, val)}
            questionNumber={i + 1}
          />
        ))}
      </div>
    </div>
  );
}
