'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AllAnswers } from '@/lib/types';
import { calculateOverallResult } from '@/lib/scoring/overall';
import { generateActionPlan } from '@/lib/scoring/actionPlan';
import { getProfile, saveAssessment, getDraft, saveDraft, clearDraft } from '@/lib/storage';
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
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // Check for draft on mount
  useEffect(() => {
    const draft = getDraft();
    if (draft) {
      setShowDraftDialog(true);
    }
  }, []);

  // Auto-save debounced
  const triggerAutoSave = useCallback((newAnswers: AllAnswers, step: number) => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDraft(newAnswers, step);
      setDraftSaved(true);
      setTimeout(() => setDraftSaved(false), 2000);
    }, 500);
  }, []);

  const handleResumeDraft = () => {
    const draft = getDraft();
    if (draft) {
      setAnswers(draft.answers);
      setCurrentStep(draft.currentStep);
    }
    setShowDraftDialog(false);
  };

  const handleDiscardDraft = () => {
    clearDraft();
    setShowDraftDialog(false);
  };

  const updateAnswers = (newAnswers: AllAnswers) => {
    setAnswers(newAnswers);
    triggerAutoSave(newAnswers, currentStep);
  };

  const canProceed = isStepComplete(currentStep, answers);
  const { answered, total } = getAnsweredCount(currentStep, answers);

  const handleNext = () => {
    if (!canProceed) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);

    if (currentStep < TOTAL_STEPS - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      saveDraft(answers, nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const result = calculateOverallResult(answers);
      const actionPlan = generateActionPlan(result);
      const profile = getProfile();

      clearDraft();

      if (profile) {
        const stored = saveAssessment(profile, result, actionPlan);
        router.push(`/results?id=${stored.id}`);
      } else {
        sessionStorage.setItem('dwa-result', JSON.stringify(result));
        router.push('/results');
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      setCurrentStep(prevStep);
      setShowValidation(false);
      saveDraft(answers, prevStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Draft resume dialog
  if (showDraftDialog) {
    const draft = getDraft();
    return (
      <div className="glass rounded-2xl p-6 md:p-8 animate-scale-in">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5 text-[var(--accent-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-1">途中保存データがあります</h3>
            <p className="text-sm text-[var(--text-secondary)] mb-1">
              前回の途中から再開できます。
            </p>
            {draft && (
              <p className="text-[11px] text-[var(--text-muted)]">
                保存日時: {new Date(draft.savedAt).toLocaleString('ja-JP')}
                　ステップ: {draft.currentStep + 1}/{TOTAL_STEPS}（{STEP_TITLES[draft.currentStep]}）
              </p>
            )}
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleResumeDraft}
            className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-600/20"
          >
            途中から再開する
          </button>
          <button
            onClick={handleDiscardDraft}
            className="px-5 py-3 glass rounded-xl text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            最初から
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ProgressBar currentStep={currentStep} />

      <div className="glass rounded-2xl p-6 md:p-8 animate-scale-in">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="text-[11px] font-medium text-[var(--text-muted)] tracking-wider uppercase">
                Step {currentStep + 1} of {TOTAL_STEPS}
              </p>
              {draftSaved && (
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 animate-fade-up">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  保存済み
                </span>
              )}
            </div>
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
            onChange={(sleep) => updateAnswers({ ...answers, sleep })}
          />
        )}
        {currentStep === 1 && (
          <StressSection
            answers={answers.stress}
            onChange={(stress) => updateAnswers({ ...answers, stress })}
          />
        )}
        {currentStep === 2 && (
          <FatigueSection
            answers={answers.fatigue}
            onChange={(fatigue) => updateAnswers({ ...answers, fatigue })}
          />
        )}
        {currentStep === 3 && (
          <DietSection
            answers={answers.diet}
            onChange={(diet) => updateAnswers({ ...answers, diet })}
          />
        )}
        {currentStep === 4 && (
          <ExerciseSection
            answers={answers.exercise}
            onChange={(exercise) => updateAnswers({ ...answers, exercise })}
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
