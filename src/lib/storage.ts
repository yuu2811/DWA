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

// --- Notes ---

export function saveNotes(assessmentId: string, notes: string): void {
  const history = getHistory();
  const idx = history.findIndex((a) => a.id === assessmentId);
  if (idx === -1) return;
  history[idx].notes = notes;
  write(KEYS.history, history);
}

export function saveFollowUpDate(assessmentId: string, followUpDate: string): void {
  const history = getHistory();
  const idx = history.findIndex((a) => a.id === assessmentId);
  if (idx === -1) return;
  history[idx].followUpDate = followUpDate;
  write(KEYS.history, history);
}

// --- Export ---

export function exportHistoryJSON(): string {
  const data = {
    exportDate: new Date().toISOString(),
    profile: getProfile(),
    history: getHistory(),
  };
  return JSON.stringify(data, null, 2);
}

export function exportHistoryCSV(): string {
  const history = getHistory();
  if (history.length === 0) return '';

  const headers = [
    '評価日', '氏名', '社員番号', '所属', '総合判定',
    '睡眠スコア', '睡眠判定',
    'ストレススコア', 'ストレス判定',
    '疲労スコア', '疲労判定',
    '食事スコア', '食事判定',
    '運動スコア', '運動判定',
    '受診勧奨', '所見メモ',
  ];

  const riskLabel: Record<string, string> = { low: '良好', moderate: '要改善', high: '要対応' };

  const rows = history.map((entry) => {
    const domainMap: Record<string, { score: number; risk: string }> = {};
    for (const d of entry.result.domains) {
      domainMap[d.domain] = { score: d.score, risk: riskLabel[d.riskLevel] ?? d.riskLevel };
    }
    return [
      entry.result.assessmentDate,
      entry.profile.name,
      entry.profile.employeeId,
      entry.profile.company,
      riskLabel[entry.result.overallRisk] ?? entry.result.overallRisk,
      domainMap['sleep']?.score ?? '',
      domainMap['sleep']?.risk ?? '',
      domainMap['stress']?.score ?? '',
      domainMap['stress']?.risk ?? '',
      domainMap['fatigue']?.score ?? '',
      domainMap['fatigue']?.risk ?? '',
      domainMap['diet']?.score ?? '',
      domainMap['diet']?.risk ?? '',
      domainMap['exercise']?.score ?? '',
      domainMap['exercise']?.risk ?? '',
      entry.result.referralRecommended ? 'あり' : 'なし',
      (entry.notes ?? '').replace(/"/g, '""'),
    ].map((v) => `"${v}"`).join(',');
  });

  return '\uFEFF' + [headers.join(','), ...rows].join('\n');
}

// --- Import / Clear ---

export function importData(json: string): { success: boolean; count: number } {
  try {
    const data = JSON.parse(json);
    if (data.profile) {
      saveProfile(data.profile);
    }
    if (Array.isArray(data.history)) {
      const existing = getHistory();
      const existingIds = new Set(existing.map((e) => e.id));
      const newEntries = data.history.filter((e: StoredAssessment) => !existingIds.has(e.id));
      const merged = [...existing, ...newEntries].slice(-MAX_HISTORY);
      write(KEYS.history, merged);
      return { success: true, count: newEntries.length };
    }
    return { success: true, count: 0 };
  } catch {
    return { success: false, count: 0 };
  }
}

export function clearAllData(): void {
  if (typeof window === 'undefined') return;
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}

export function deleteAssessment(assessmentId: string): void {
  const history = getHistory();
  const filtered = history.filter((a) => a.id !== assessmentId);
  write(KEYS.history, filtered);
  // Also clean up action progress
  const all = read<Record<string, Record<string, boolean>>>(KEYS.actionProgress) ?? {};
  delete all[assessmentId];
  write(KEYS.actionProgress, all);
}
