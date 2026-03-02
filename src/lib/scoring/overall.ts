import { DomainResult, AssessmentResult, AllAnswers } from '../types';
import { scoreSleep } from './sleep';
import { scoreStress } from './stress';
import { scoreFatigue } from './fatigue';
import { scoreDiet } from './diet';
import { scoreExercise } from './exercise';

export function calculateOverallResult(answers: AllAnswers): AssessmentResult {
  const domains: DomainResult[] = [
    scoreSleep(answers.sleep),
    scoreStress(answers.stress),
    scoreFatigue(answers.fatigue),
    scoreDiet(answers.diet),
    scoreExercise(answers.exercise),
  ];

  const highCount = domains.filter((d) => d.riskLevel === 'high').length;
  const moderateCount = domains.filter((d) => d.riskLevel === 'moderate').length;

  let overallRisk: AssessmentResult['overallRisk'];
  let overallSummary: string;

  if (highCount >= 1) {
    overallRisk = 'high';
    const highDomains = domains
      .filter((d) => d.riskLevel === 'high')
      .map((d) => d.domainLabel)
      .join('、');
    overallSummary = `${highDomains}の領域で要注意の結果が出ています。医療機関の受診や専門家への相談を強くお勧めします。`;
  } else if (moderateCount >= 2) {
    overallRisk = 'moderate';
    overallSummary =
      '複数の領域で改善が望まれる結果です。生活習慣の見直しと、産業医・保健師との定期的な面談をお勧めします。';
  } else {
    overallRisk = 'low';
    overallSummary =
      '全体的に良好な状態です。現在の生活習慣を維持し、定期的な健康チェックを続けましょう。';
  }

  const referralRecommended = domains.some((d) => d.referralNeeded);

  return {
    domains,
    overallRisk,
    assessmentDate: new Date().toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
    referralRecommended,
    overallSummary,
  };
}
