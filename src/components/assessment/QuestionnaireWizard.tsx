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

function isStepComplete(step: number, answers: AllAnswers): boolean {
  switch (step) {
    case 0:
      return answers.sleep.items.every((v) => v !== undefined);
    case 1:
      return answers.stress.items.every((v) => v !== undefined);
    case 2:
      return answers.fatigue.items.every((v) => v !== undefined);
    case 3:
      return answers.diet.items.every((v) => v !== undefined);
    case 4:
      return true;
    default:
      return false;
  }
}

export default function QuestionnaireWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<AllAnswers>(createInitialAnswers());
  const [showValidation, setShowValidation] = useState(false);

  const canProceed = isStepComplete(currentStep, answers);

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

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          {STEP_TITLES[currentStep]}
        </h2>
        <p className="text-sm text-slate-400 mb-6">
          ステップ {currentStep + 1} / {TOTAL_STEPS}
        </p>

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

        {showValidation && !canProceed && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">
              すべての質問にお答えください。
            </p>
          </div>
        )}

        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={handleBack}
            disabled={currentStep === 0}
            className={`px-6 py-3 rounded-xl text-sm font-medium transition-colors ${
              currentStep === 0
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            戻る
          </button>
          <button
            type="button"
            onClick={handleNext}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition-colors"
          >
            {currentStep === TOTAL_STEPS - 1 ? '結果を見る' : '次へ'}
          </button>
        </div>
      </div>
    </div>
  );
}
