'use client';

import { DriverProfile, StoredAssessment, AssessmentResult, ActionPlan, AllAnswers } from './types';

const KEYS = {
  profile: 'dwa-profile',
  history: 'dwa-history',
  draft: 'dwa-draft',
  actionProgress: 'dwa-action-progress',
} as const;

const MAX_HISTORY = 50;

function read<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function write<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage full — silently fail
  }
}

// --- Profile ---

export function getProfile(): DriverProfile | null {
  return read<DriverProfile>(KEYS.profile);
}

export function saveProfile(profile: DriverProfile): void {
  write(KEYS.profile, profile);
}

// --- Assessment History ---

export function getHistory(): StoredAssessment[] {
  return read<StoredAssessment[]>(KEYS.history) ?? [];
}

export function saveAssessment(
  profile: DriverProfile,
  result: AssessmentResult,
  actionPlan: ActionPlan,
): StoredAssessment {
  const history = getHistory();
  const entry: StoredAssessment = {
    id: crypto.randomUUID(),
    date: new Date().toISOString(),
    profile,
    result,
    actionPlan,
    actionProgress: {},
  };
  history.push(entry);

  // Trim oldest if exceeding limit
  while (history.length > MAX_HISTORY) {
    history.shift();
  }

  write(KEYS.history, history);
  return entry;
}

export function getLatestAssessment(): StoredAssessment | null {
  const history = getHistory();
  return history.length > 0 ? history[history.length - 1] : null;
}

export function getAssessmentById(id: string): StoredAssessment | null {
  return getHistory().find((a) => a.id === id) ?? null;
}

export function getPreviousAssessment(currentId: string): StoredAssessment | null {
  const history = getHistory();
  const idx = history.findIndex((a) => a.id === currentId);
  return idx > 0 ? history[idx - 1] : null;
}

// --- Action Progress ---

export function getActionProgress(assessmentId: string): Record<string, boolean> {
  const all = read<Record<string, Record<string, boolean>>>(KEYS.actionProgress) ?? {};
  return all[assessmentId] ?? {};
}

export function toggleActionComplete(assessmentId: string, actionId: string): Record<string, boolean> {
  const all = read<Record<string, Record<string, boolean>>>(KEYS.actionProgress) ?? {};
  if (!all[assessmentId]) all[assessmentId] = {};
  all[assessmentId][actionId] = !all[assessmentId][actionId];
  write(KEYS.actionProgress, all);
  return all[assessmentId];
}

// --- Draft (auto-save) ---

export interface DraftData {
  answers: AllAnswers;
  currentStep: number;
  savedAt: string;
}

export function saveDraft(answers: AllAnswers, currentStep: number): void {
  write<DraftData>(KEYS.draft, {
    answers,
    currentStep,
    savedAt: new Date().toISOString(),
  });
}

export function getDraft(): DraftData | null {
  return read<DraftData>(KEYS.draft);
}

export function clearDraft(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(KEYS.draft);
}
