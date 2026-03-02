'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AllAnswers } from '@/lib/types';
import { calculateOverallResult } from '@/lib/scoring/overall';
import ProgressBar from './ProgressBar';
import SleepSection from './SleepSection';
import StressSection from './StressSection';
import FatigueSection from './FatigueSection';
import DietSection from './DietSection';
import ExerciseSection from './ExerciseSection';

const STEP_TITLES = ['睡眠', 'ストレス', '疲労', '食事・栄養', '運動・身体活動'];
const TOTAL_STEPS = 5;

function createInitialAnswers(): AllAnswers {
  return {
    sleep: { items: Array(8).fill(undefined) },
    stress: { items: Array(6).fill(undefined) },
    fatigue: { items: Array(13).fill(undefined) },
    diet: { items: Array(8).fill(undefined) },
    exercise: {
      vigorousDays: 0,
      vigorousMinutes: 0,
      moderateDays: 0,
      moderateMinutes: 0,
      walkingDays: 0,
      walkingMinutes: 0,
      sittingHours: 0,
    },
  };
}

function getAnsweredCount(step: number, answers: AllAnswers): { answered: number; total: number } {
  switch (step) {
    case 0:
      return { answered: answers.sleep.items.filter((v) => v !== undefined).length, total: 8 };
    case 1:
      return { answered: answers.stress.items.filter((v) => v !== undefined).length, total: 6 };
    case 2:
      return { answered: answers.fatigue.items.filter((v) => v !== undefined).length, total: 13 };
    case 3:
      return { answered: answers.diet.items.filter((v) => v !== undefined).length, total: 8 };
    case 4:
      return { answered: 7, total: 7 };
    default:
      return { answered: 0, total: 0 };
  }
}

function isStepComplete(step: number, answers: AllAnswers): boolean {
  const { answered, total } = getAnsweredCount(step, answers);
  return answered >= total;
}

export default function QuestionnaireWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AllAnswers>(createInitialAnswers());
  const [showValidation, setShowValidation] = useState(false);

  const canProceed = isStepComplete(currentStep, answers);
  const { answered, total } = getAnsweredCount(currentStep, answers);

  const handleNext = () => {
    if (!canProceed) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);

    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const result = calculateOverallResult(answers);
      sessionStorage.setItem('dwa-result', JSON.stringify(result));
      router.push('/results');
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setShowValidation(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div>
      <ProgressBar currentStep={currentStep} />

      <div className="glass rounded-2xl p-6 md:p-8 animate-scale-in">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[11px] font-medium text-[var(--text-muted)] tracking-wider uppercase mb-1">
              Step {currentStep + 1} of {TOTAL_STEPS}
            </p>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">
              {STEP_TITLES[currentStep]}
            </h2>
          </div>
          {currentStep < 4 && (
            <span className="text-xs text-[var(--text-muted)] tabular-nums">
              {answered}/{total}
            </span>
          )}
        </div>

        {/* Section content */}
        {currentStep === 0 && (
          <SleepSection
            answers={answers.sleep}
            onChange={(sleep) => setAnswers({ ...answers, sleep })}
          />
        )}
        {currentStep === 1 && (
          <StressSection
            answers={answers.stress}
            onChange={(stress) => setAnswers({ ...answers, stress })}
          />
        )}
        {currentStep === 2 && (
          <FatigueSection
            answers={answers.fatigue}
            onChange={(fatigue) => setAnswers({ ...answers, fatigue })}
          />
        )}
        {currentStep === 3 && (
          <DietSection
            answers={answers.diet}
            onChange={(diet) => setAnswers({ ...answers, diet })}
          />
        )}
        {currentStep === 4 && (
          <ExerciseSection
            answers={answers.exercise}
            onChange={(exercise) => setAnswers({ ...answers, exercise })}
          />
        )}

        {/* Validation error */}
        {showValidation && !canProceed && (
          <div className="mt-6 flex items-center gap-2 text-sm text-[var(--accent-rose)]">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01" />
            </svg>
            すべての質問にお答えください（{answered}/{total}）
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--border-subtle)]">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all ${
              currentStep === 0
                ? 'text-[var(--text-muted)]/30 cursor-not-allowed'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            戻る
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="group flex items-center gap-2 px-7 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
          >
            {currentStep === TOTAL_STEPS - 1 ? '結果を見る' : '次へ'}
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
