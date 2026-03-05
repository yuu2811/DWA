'use client';

import { DriverProfile, StoredAssessment, AssessmentResult, ActionPlan, AllAnswers, RiskLevel, DomainType, VehicleType } from './types';

const KEYS = {
  profile: 'dwa-profile',
  history: 'dwa-history',
  draft: 'dwa-draft',
  actionProgress: 'dwa-action-progress',
} as const;

const MAX_HISTORY = 50;
const MAX_IMPORT_SIZE = 1024 * 1024; // 1MB

// --- Validation helpers ---

const VALID_RISK_LEVELS: RiskLevel[] = ['low', 'moderate', 'high'];
const VALID_DOMAINS: DomainType[] = ['sleep', 'stress', 'fatigue', 'diet', 'exercise'];
const VALID_VEHICLE_TYPES: VehicleType[] = ['truck', 'bus', 'taxi', 'other'];

function sanitizeString(value: unknown, maxLength = 500): string {
  if (typeof value !== 'string') return '';
  return value.slice(0, maxLength).trim();
}

function isValidProfile(data: unknown): data is DriverProfile {
  if (!data || typeof data !== 'object') return false;
  const d = data as Record<string, unknown>;
  if (typeof d.name !== 'string' || d.name.trim().length === 0) return false;
  if (typeof d.employeeId !== 'string') return false;
  if (typeof d.company !== 'string') return false;
  if (d.age !== null && typeof d.age !== 'number') return false;
  if (d.yearsOfService !== null && typeof d.yearsOfService !== 'number') return false;
  if (!VALID_VEHICLE_TYPES.includes(d.vehicleType as VehicleType)) return false;
  return true;
}

function sanitizeProfile(data: Record<string, unknown>): DriverProfile {
  return {
    name: sanitizeString(data.name, 100),
    employeeId: sanitizeString(data.employeeId, 50),
    company: sanitizeString(data.company, 200),
    age: typeof data.age === 'number' && data.age >= 0 && data.age <= 150 ? Math.floor(data.age) : null,
    yearsOfService: typeof data.yearsOfService === 'number' && data.yearsOfService >= 0 && data.yearsOfService <= 100 ? Math.floor(data.yearsOfService) : null,
    vehicleType: VALID_VEHICLE_TYPES.includes(data.vehicleType as VehicleType) ? (data.vehicleType as VehicleType) : 'other',
  };
}

function isValidAssessmentEntry(entry: unknown): entry is StoredAssessment {
  if (!entry || typeof entry !== 'object') return false;
  const e = entry as Record<string, unknown>;
  if (typeof e.id !== 'string' || e.id.length === 0 || e.id.length > 100) return false;
  if (typeof e.date !== 'string') return false;
  if (!isValidProfile(e.profile)) return false;
  if (!e.result || typeof e.result !== 'object') return false;
  const result = e.result as Record<string, unknown>;
  if (!Array.isArray(result.domains)) return false;
  for (const domain of result.domains) {
    if (!domain || typeof domain !== 'object') return false;
    const d = domain as Record<string, unknown>;
    if (!VALID_DOMAINS.includes(d.domain as DomainType)) return false;
    if (typeof d.score !== 'number') return false;
    if (!VALID_RISK_LEVELS.includes(d.riskLevel as RiskLevel)) return false;
  }
  if (!VALID_RISK_LEVELS.includes(result.overallRisk as RiskLevel)) return false;
  if (typeof result.assessmentDate !== 'string') return false;
  if (!e.actionPlan || typeof e.actionPlan !== 'object') return false;
  return true;
}

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
  const sanitized: DriverProfile = {
    name: sanitizeString(profile.name, 100),
    employeeId: sanitizeString(profile.employeeId, 50),
    company: sanitizeString(profile.company, 200),
    age: typeof profile.age === 'number' && profile.age >= 0 && profile.age <= 150 ? Math.floor(profile.age) : null,
    yearsOfService: typeof profile.yearsOfService === 'number' && profile.yearsOfService >= 0 && profile.yearsOfService <= 100 ? Math.floor(profile.yearsOfService) : null,
    vehicleType: VALID_VEHICLE_TYPES.includes(profile.vehicleType) ? profile.vehicleType : 'other',
  };
  write(KEYS.profile, sanitized);
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
  history[idx].notes = sanitizeString(notes, 5000);
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

function csvSafeString(value: string): string {
  // Escape double quotes for CSV
  let safe = value.replace(/"/g, '""');
  // Prevent CSV formula injection (=, +, -, @, \t, \r)
  if (/^[=+\-@\t\r]/.test(safe)) {
    safe = "'" + safe;
  }
  return safe;
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
      csvSafeString(entry.profile.name),
      csvSafeString(entry.profile.employeeId),
      csvSafeString(entry.profile.company),
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
      csvSafeString(entry.notes ?? ''),
    ].map((v) => `"${v}"`).join(',');
  });

  return '\uFEFF' + [headers.join(','), ...rows].join('\n');
}

// --- Import / Clear ---

export function importData(json: string): { success: boolean; count: number; error?: string } {
  try {
    // File size check
    if (json.length > MAX_IMPORT_SIZE) {
      return { success: false, count: 0, error: 'ファイルサイズが上限（1MB）を超えています' };
    }

    const data = JSON.parse(json);

    if (typeof data !== 'object' || data === null) {
      return { success: false, count: 0, error: '不正なデータ形式です' };
    }

    // Validate and sanitize profile before saving
    if (data.profile) {
      if (!isValidProfile(data.profile)) {
        return { success: false, count: 0, error: 'プロフィールデータが不正です' };
      }
      saveProfile(sanitizeProfile(data.profile as Record<string, unknown>));
    }

    if (Array.isArray(data.history)) {
      // Limit number of entries to prevent abuse
      if (data.history.length > MAX_HISTORY) {
        data.history = data.history.slice(-MAX_HISTORY);
      }

      const existing = getHistory();
      const existingIds = new Set(existing.map((e) => e.id));

      // Validate each entry before accepting
      const validEntries: StoredAssessment[] = [];
      for (const entry of data.history) {
        if (!existingIds.has(entry?.id) && isValidAssessmentEntry(entry)) {
          // Sanitize text fields within validated entries
          entry.profile = sanitizeProfile(entry.profile as unknown as Record<string, unknown>);
          if (entry.notes !== undefined) {
            entry.notes = sanitizeString(entry.notes, 5000);
          }
          if (entry.followUpDate !== undefined) {
            entry.followUpDate = sanitizeString(entry.followUpDate, 20);
          }
          validEntries.push(entry);
        }
      }

      const merged = [...existing, ...validEntries].slice(-MAX_HISTORY);
      write(KEYS.history, merged);
      return { success: true, count: validEntries.length };
    }
    return { success: true, count: 0 };
  } catch {
    return { success: false, count: 0, error: 'ファイルの読み込みに失敗しました' };
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
