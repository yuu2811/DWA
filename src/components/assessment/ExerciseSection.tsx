'use client';

import { ExerciseAnswers } from '@/lib/types';
import { exerciseSection } from '@/lib/questions/exercise';
import LikertScale from './LikertScale';

interface ExerciseSectionProps {
  answers: ExerciseAnswers;
  onChange: (answers: ExerciseAnswers) => void;
}

const fieldMapping: Record<string, keyof ExerciseAnswers> = {
  'exercise-vigorous-days': 'vigorousDays',
  'exercise-vigorous-minutes': 'vigorousMinutes',
  'exercise-moderate-days': 'moderateDays',
  'exercise-moderate-minutes': 'moderateMinutes',
  'exercise-walking-days': 'walkingDays',
  'exercise-walking-minutes': 'walkingMinutes',
  'exercise-sitting-hours': 'sittingHours',
};

export default function ExerciseSection({ answers, onChange }: ExerciseSectionProps) {
  const handleChange = (questionId: string, value: number) => {
    const field = fieldMapping[questionId];
    if (field) {
      onChange({ ...answers, [field]: value });
    }
  };

  const getValue = (questionId: string): number | undefined => {
    const field = fieldMapping[questionId];
    return field ? answers[field] : undefined;
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg mb-2">
          {exerciseSection.scaleName}
        </span>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{exerciseSection.description}</p>
      </div>
      <div>
        {exerciseSection.questions.map((q, i) => (
          <LikertScale key={q.id} question={q} value={getValue(q.id)} onChange={(val) => handleChange(q.id, val)} questionNumber={i + 1} />
        ))}
      </div>
    </div>
  );
}
