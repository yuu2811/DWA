import { ExerciseAnswers, DomainResult } from '../types';

export function scoreExercise(answers: ExerciseAnswers): DomainResult {
  const vigorousMET = 8.0 * answers.vigorousMinutes * answers.vigorousDays;
  const moderateMET = 4.0 * answers.moderateMinutes * answers.moderateDays;
  const walkingMET = 3.3 * answers.walkingMinutes * answers.walkingDays;
  const totalMET = vigorousMET + moderateMET + walkingMET;

  const score = Math.round(totalMET);
  const sittingWarning = answers.sittingHours >= 8;

  let riskLevel: DomainResult['riskLevel'];
  let interpretation: string;
  let referralNeeded: boolean;
  let referralDetail: string;
  let recommendations: string[];

  if (totalMET > 3000) {
    riskLevel = 'low';
    interpretation = `身体活動量は十分です（${score} MET-分/週）。高い活動レベルが維持されています。`;
    referralNeeded = false;
    referralDetail = '';
    recommendations = ['現在の運動習慣を維持しましょう'];
    if (sittingWarning) {
      recommendations.push(
        `座位時間が${answers.sittingHours}時間/日と長めです。運転の合間に30分〜1時間ごとにストレッチや軽い体操を行いましょう`
      );
    }
  } else if (totalMET >= 600) {
    riskLevel = 'moderate';
    interpretation = `身体活動量は中程度です（${score} MET-分/週）。もう少し運動量を増やすことが推奨されます。`;
    referralNeeded = false;
    referralDetail =
      '保健師による運動指導を検討してください。';
    recommendations = [
      'ウォーキングの時間を増やしましょう（1日30分以上が目標です）',
      '休憩時間にストレッチや軽い体操を取り入れましょう',
      'エレベーターの代わりに階段を使うなど、日常生活で体を動かす工夫をしましょう',
    ];
    if (sittingWarning) {
      recommendations.push(
        `座位時間が${answers.sittingHours}時間/日と長いため、1時間ごとに立ち上がって体を動かしましょう`
      );
    }
  } else {
    riskLevel = 'high';
    interpretation = `身体活動量が不足しています（${score} MET-分/週）。運動不足は生活習慣病のリスクを高めます。運動習慣の確立が必要です。`;
    referralNeeded = true;
    referralDetail =
      '運動指導・生活習慣改善のための保健指導、または特定保健指導の受講を勧奨します。';
    recommendations = [
      'まず1日15分のウォーキングから始めましょう',
      '休憩時間に5分間のストレッチを日課にしましょう',
      '週に2〜3日は意識的に体を動かす時間を作りましょう',
      '運動が難しい場合は、保健師に相談して無理のない運動プランを立てましょう',
    ];
    if (sittingWarning) {
      recommendations.push(
        `座位時間が${answers.sittingHours}時間/日と非常に長い状態です。長時間の座位はエコノミークラス症候群のリスクがあります。最低でも2時間ごとに休憩を取りましょう`
      );
    }
  }

  return {
    domain: 'exercise',
    domainLabel: '運動・身体活動',
    scaleName: 'IPAQ-SF（国際標準化身体活動質問票）',
    score,
    maxScore: null,
    scoreUnit: 'MET-分/週',
    riskLevel,
    interpretation,
    recommendations,
    referralNeeded,
    referralDetail,
  };
}
