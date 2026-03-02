import { SleepAnswers, DomainResult } from '../types';

export function scoreSleep(answers: SleepAnswers): DomainResult {
  const score = answers.items.reduce((sum, val) => sum + val, 0);

  let riskLevel: DomainResult['riskLevel'];
  let interpretation: string;
  let referralNeeded: boolean;
  let referralDetail: string;
  let recommendations: string[];

  if (score <= 10) {
    riskLevel = 'low';
    interpretation =
      '日中の眠気は正常範囲内です。現在の睡眠習慣を維持してください。';
    referralNeeded = false;
    referralDetail = '';
    recommendations = [
      '現在の睡眠時間（7〜8時間）を維持しましょう',
      '就寝・起床時刻を一定に保ちましょう',
      '運転前の十分な睡眠を心がけましょう',
    ];
  } else if (score <= 15) {
    riskLevel = 'moderate';
    interpretation =
      '過度の日中眠気が認められます（ESS 11〜15点）。睡眠時無呼吸症候群（SAS）などの睡眠障害の可能性があり、医療機関での検査をお勧めします。';
    referralNeeded = true;
    referralDetail =
      '睡眠外来または呼吸器内科での睡眠時無呼吸症候群（SAS）スクリーニング検査を推奨します。';
    recommendations = [
      '睡眠外来の受診を検討してください',
      '就寝前のカフェイン・アルコールを控えましょう',
      '寝室環境（温度・光・騒音）を整えましょう',
      '日中に強い眠気を感じた場合は、安全な場所で15〜20分の仮眠をとりましょう',
    ];
  } else {
    riskLevel = 'high';
    interpretation =
      '重度の日中眠気が認められます（ESS 16点以上）。運転中の居眠り事故のリスクが非常に高い状態です。早急に医療機関を受診してください。';
    referralNeeded = true;
    referralDetail =
      '睡眠外来での精密検査（終夜睡眠ポリグラフ検査等）が必要です。SAS陽性の場合はCPAP治療等の開始を検討してください。';
    recommendations = [
      '早急に睡眠外来を受診してください',
      '精密検査（PSG検査）を受けてください',
      '検査結果が出るまでは長距離運転を控えることを検討してください',
      '日中の眠気が強い場合は運転業務の一時的な制限を産業医と相談してください',
    ];
  }

  return {
    domain: 'sleep',
    domainLabel: '睡眠',
    scaleName: 'ESS（エプワース眠気尺度）',
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
