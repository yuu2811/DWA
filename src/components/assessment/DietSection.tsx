'use client';

import { DietAnswers } from '@/lib/types';
import { dietSection } from '@/lib/questions/diet';
import LikertSection from './LikertSection';

interface DietSectionProps {
  answers: DietAnswers;
  onChange: (answers: DietAnswers) => void;
}

export default function DietSection({ answers, onChange }: DietSectionProps) {
  return (
    <LikertSection
      section={dietSection}
      items={answers.items}
      onChange={(items) => onChange({ items })}
    />
  );
}
