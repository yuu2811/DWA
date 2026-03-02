'use client';

import { ExerciseAnswers } from '@/lib/types';
import { exerciseNumericQuestions } from '@/lib/questions/exercise';
import { exerciseSection } from '@/lib/questions/exercise';

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

export default function ExerciseSection({
  answers,
  onChange,
}: ExerciseSectionProps) {
  const handleChange = (questionId: string, value: number) => {
    const field = fieldMapping[questionId];
    if (field) {
      onChange({ ...answers, [field]: value });
    }
  };

  const getValue = (questionId: string): number => {
    const field = fieldMapping[questionId];
    return field ? answers[field] : 0;
  };

  return (
    <div>
      <div className="mb-6">
        <span className="inline-block text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded mb-2">
          {exerciseSection.scaleName}
        </span>
        <p className="text-sm text-slate-600">{exerciseSection.description}</p>
      </div>
      <div className="space-y-5">
        {exerciseNumericQuestions.map((q, i) => (
          <div
            key={q.id}
            className="py-3 border-b border-slate-100 last:border-b-0"
          >
            <label
              htmlFor={q.id}
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              <span className="text-slate-400 mr-2">Q{i + 1}.</span>
              {q.text}
            </label>
            <div className="flex items-center gap-2">
              <input
                id={q.id}
                type="number"
                min={q.min}
                max={q.max}
                step={q.step || 1}
                value={getValue(q.id)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  const clamped = Math.min(Math.max(val, q.min), q.max);
                  handleChange(q.id, clamped);
                }}
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-sm text-slate-500">{q.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
