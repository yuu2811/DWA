import { StressAnswers, DomainResult } from '../types';

export function scoreStress(answers: StressAnswers): DomainResult {
  const score = answers.items.reduce((sum, val) => sum + val, 0);

  let riskLevel: DomainResult['riskLevel'];
  let interpretation: string;
  let referralNeeded: boolean;
  let referralDetail: string;
  let recommendations: string[];

  if (score <= 4) {
    riskLevel = 'low';
    interpretation =
      '心理的苦痛は正常範囲内です（K6 0〜4点）。良好な状態が維持されています。';
    referralNeeded = false;
    referralDetail = '';
    recommendations = [
      'ストレス対処法（趣味、運動、休息）を継続しましょう',
      '困ったことがあれば気軽に相談できる体制を確認しておきましょう',
      '定期的なセルフチェックを続けましょう',
    ];
  } else if (score <= 12) {
    riskLevel = 'moderate';
    interpretation =
      '心理的苦痛が認められます（K6 5〜12点）。ストレスへの対処が必要な状態です。セルフケアの実践と、必要に応じて専門家への相談をお勧めします。';
    referralNeeded = false;
    referralDetail =
      '産業医面談でのフォローアップを推奨します。改善がみられない場合は心療内科への紹介を検討してください。';
    recommendations = [
      'ストレスの原因を具体的に把握し、対処法を考えましょう',
      '十分な睡眠と休息をとりましょう',
      '一人で抱え込まず、周囲の人や産業医・保健師に相談しましょう',
      'リラクゼーション法（深呼吸、ストレッチ等）を日常に取り入れましょう',
    ];
  } else {
    riskLevel = 'high';
    interpretation =
      '重度の心理的苦痛が認められます（K6 13点以上）。うつ病や不安障害などの精神疾患の可能性があり、専門医への受診が必要です。';
    referralNeeded = true;
    referralDetail =
      '心療内科または精神科への受診を強く勧奨します。必要に応じて就業制限の検討も行ってください。';
    recommendations = [
      '心療内科または精神科を受診してください',
      '産業医に現状を報告し、就業上の配慮について相談してください',
      '信頼できる人に今の気持ちを話しましょう',
      '無理をせず、十分な休養をとってください',
    ];
  }

  return {
    domain: 'stress',
    domainLabel: 'ストレス',
    scaleName: 'K6（ケスラー心理的苦痛尺度）',
    score,
    maxScore: 24,
    scoreUnit: '点',
    riskLevel,
    interpretation,
    recommendations,
    referralNeeded,
    referralDetail,
  };
}
