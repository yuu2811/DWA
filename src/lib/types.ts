export type RiskLevel = 'low' | 'moderate' | 'high';

export type DomainType = 'sleep' | 'stress' | 'diet' | 'exercise';

export interface Question {
  id: string;
  text: string;
  options: { value: number; label: string }[];
}

export interface NumericQuestion {
  id: string;
  text: string;
  unit: string;
  min: number;
  max: number;
  step?: number;
}

export interface QuestionSection {
  domain: DomainType;
  title: string;
  description: string;
  scaleName: string;
  questions: Question[];
  numericQuestions?: NumericQuestion[];
}

export interface SleepAnswers {
  items: number[];
}

export interface StressAnswers {
  items: number[];
}

export interface DietAnswers {
  items: number[];
}

export interface ExerciseAnswers {
  vigorousDays: number;
  vigorousMinutes: number;
  moderateDays: number;
  moderateMinutes: number;
  walkingDays: number;
  walkingMinutes: number;
  sittingHours: number;
}

export interface AllAnswers {
  sleep: SleepAnswers;
  stress: StressAnswers;
  diet: DietAnswers;
  exercise: ExerciseAnswers;
}

export interface DomainResult {
  domain: DomainType;
  domainLabel: string;
  scaleName: string;
  score: number;
  maxScore: number | null;
  scoreUnit: string;
  riskLevel: RiskLevel;
  interpretation: string;
  recommendations: string[];
  referralNeeded: boolean;
  referralDetail: string;
}

export interface AssessmentResult {
  domains: DomainResult[];
  overallRisk: RiskLevel;
  assessmentDate: string;
  referralRecommended: boolean;
  overallSummary: string;
}

export interface AcademicReference {
  id: string;
  domain: DomainType;
  authors: string;
  title: string;
  journal: string;
  year: number;
  volume?: string;
  pages?: string;
  doi?: string;
  note?: string;
}
