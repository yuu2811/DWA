'use client';

import { FatigueAnswers } from '@/lib/types';
import { fatigueSection } from '@/lib/questions/fatigue';
import LikertSection from './LikertSection';

interface FatigueSectionProps {
  answers: FatigueAnswers;
  onChange: (answers: FatigueAnswers) => void;
}

export default function FatigueSection({ answers, onChange }: FatigueSectionProps) {
  return (
    <LikertSection
      section={fatigueSection}
      items={answers.items}
      onChange={(items) => onChange({ items })}
    />
  );
}
