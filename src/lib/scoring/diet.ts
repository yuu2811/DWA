import { DietAnswers, DomainResult } from '../types';

export function scoreDiet(answers: DietAnswers): DomainResult {
  const score = answers.items.reduce((sum, val) => sum + val, 0);

  let riskLevel: DomainResult['riskLevel'];
  let interpretation: string;
  let referralNeeded: boolean;
  let referralDetail: string;
  let recommendations: string[];

  if (score >= 20) {
    riskLevel = 'low';
    interpretation =
      '食生活はおおむね良好です（20〜32点）。バランスの取れた食事が実践できています。';
    referralNeeded = false;
    referralDetail = '';
    recommendations = [
      '現在の良好な食習慣を維持しましょう',
      '季節の野菜や果物を積極的に取り入れましょう',
      '水分補給を忘れずに行いましょう',
    ];
  } else if (score >= 12) {
    riskLevel = 'moderate';
    interpretation =
      '食生活に改善の余地があります（12〜19点）。いくつかの食習慣の見直しが推奨されます。';
    referralNeeded = false;
    referralDetail =
      '特定保健指導の対象に該当する可能性があります。保健師による食事指導を検討してください。';
    recommendations = generateDietRecommendations(answers, 'moderate');
  } else {
    riskLevel = 'high';
    interpretation =
      '食生活に大きな課題があります（0〜11点）。生活習慣病のリスクが高まっている可能性があり、栄養指導の受講をお勧めします。';
    referralNeeded = true;
    referralDetail =
      '管理栄養士による個別栄養指導、または特定保健指導（積極的支援）の受講を勧奨します。';
    recommendations = generateDietRecommendations(answers, 'high');
  }

  return {
    domain: 'diet',
    domainLabel: '食事・栄養',
    scaleName: '食事評価（特定健診質問票準拠）',
    score,
    maxScore: 32,
    scoreUnit: '点',
    riskLevel,
    interpretation,
    recommendations,
    referralNeeded,
    referralDetail,
  };
}

function generateDietRecommendations(
  answers: DietAnswers,
  level: 'moderate' | 'high'
): string[] {
  const recs: string[] = [];
  const items = answers.items;

  // 朝食 (index 0)
  if (items[0] <= 1) {
    recs.push(
      level === 'high'
        ? '朝食を毎日とる習慣をつけましょう。おにぎり1個やバナナ1本からでも始められます'
        : '朝食をとる回数を増やしましょう'
    );
  }

  // 野菜 (index 1)
  if (items[1] <= 1) {
    recs.push('野菜の摂取量を増やしましょう。1日350g（小鉢5皿程度）が目標です');
  }

  // 水分 (index 2)
  if (items[2] <= 1) {
    recs.push(
      '水分摂取量を増やしましょう。運転中もこまめな水分補給を心がけてください'
    );
  }

  // 夜食 (index 3)
  if (items[3] <= 1) {
    recs.push('夜食・間食を控えましょう。夕食後の飲食は肥満や睡眠の質低下につながります');
  }

  // 食事時間 (index 4)
  if (items[4] <= 1) {
    recs.push('できるだけ決まった時間に食事をとりましょう。シフト勤務でも食事時間の目安を決めておくことが大切です');
  }

  // 塩分 (index 5)
  if (items[5] <= 1) {
    recs.push('塩分の摂取を控えましょう。高血圧予防のため、減塩食品を活用してください');
  }

  // 飲酒 (index 6)
  if (items[6] <= 1) {
    recs.push(
      '飲酒量を見直しましょう。適正飲酒量はビール中瓶1本（500ml）程度です。週に2日は休肝日を設けましょう'
    );
  }

  // カフェイン (index 7)
  if (items[7] <= 1) {
    recs.push(
      'カフェインの過剰摂取に注意してください。1日400mg（コーヒー約4杯）以内が推奨されています'
    );
  }

  if (recs.length === 0) {
    recs.push('全体的な食事バランスの改善を心がけましょう');
  }

  return recs;
}
