'use client';

import { StressAnswers } from '@/lib/types';
import { stressSection } from '@/lib/questions/stress';
import LikertSection from './LikertSection';

interface StressSectionProps {
  answers: StressAnswers;
  onChange: (answers: StressAnswers) => void;
}

export default function StressSection({ answers, onChange }: StressSectionProps) {
  return (
    <LikertSection
      section={stressSection}
      items={answers.items}
      onChange={(items) => onChange({ items })}
    />
  );
}
