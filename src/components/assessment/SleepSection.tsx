'use client';

import { SleepAnswers } from '@/lib/types';
import { sleepSection } from '@/lib/questions/sleep';
import LikertSection from './LikertSection';

interface SleepSectionProps {
  answers: SleepAnswers;
  onChange: (answers: SleepAnswers) => void;
}

export default function SleepSection({ answers, onChange }: SleepSectionProps) {
  return (
    <LikertSection
      section={sleepSection}
      items={answers.items}
      onChange={(items) => onChange({ items })}
    />
  );
}
