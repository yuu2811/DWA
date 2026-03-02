import { FatigueAnswers, DomainResult } from '../types';

export function scoreFatigue(answers: FatigueAnswers): DomainResult {
  const score = answers.items.reduce((sum, val) => sum + val, 0);

  let riskLevel: DomainResult['riskLevel'];
  let interpretation: string;
  let referralNeeded: boolean;
  let referralDetail: string;
  let recommendations: string[];

  if (score <= 4) {
    riskLevel = 'low';
    interpretation =
      '疲労の蓄積度は低いと考えられます（0〜4点）。良好な状態です。';
    referralNeeded = false;
    referralDetail = '';
    recommendations = [
      '現在の生活リズムと休息パターンを維持しましょう',
      '乗務前後の適切な休息を引き続き心がけましょう',
      '定期的なセルフチェックを続けましょう',
    ];
  } else if (score <= 14) {
    riskLevel = 'moderate';
    interpretation =
      '疲労がやや蓄積していると考えられます（5〜14点）。運転業務における注意力低下のリスクがあり、休息の取り方や勤務状況の見直しが推奨されます。';
    referralNeeded = false;
    referralDetail =
      '産業医面談でのフォローアップを推奨します。勤務状況（拘束時間・運転時間）の確認と改善指導を検討してください。';
    recommendations = [
      '十分な睡眠時間（7〜8時間）を確保しましょう',
      '連続運転を避け、こまめに休憩を取りましょう',
      '休日はしっかり休息を取り、疲労回復に充てましょう',
      '疲労が取れにくい場合は、産業医・保健師に相談しましょう',
    ];
  } else {
    riskLevel = 'high';
    interpretation =
      '疲労が高度に蓄積していると考えられます（15点以上）。安全運転に支障をきたす恐れがあり、早急な対応が必要です。背景に疾患（睡眠障害、うつ病等）が隠れている可能性も考慮してください。';
    referralNeeded = true;
    referralDetail =
      '産業医面談を早急に実施し、勤務状況の是正と受診の必要性を判断してください。過重労働面談（長時間労働者への面接指導）の対象として対応を検討してください。';
    recommendations = [
      '産業医面談を早急に受けてください',
      '勤務時間・運転時間の見直しを事業者と相談してください',
      '背景に病気が隠れている可能性があるため、医療機関の受診を検討してください',
      '十分な休養を確保し、無理な運転を避けてください',
      '改善が見られない場合は一時的な業務軽減を検討してください',
    ];
  }

  return {
    domain: 'fatigue',
    domainLabel: '疲労',
    scaleName: '疲労蓄積度チェックリスト（厚生労働省）',
    score,
    maxScore: 39,
    scoreUnit: '点',
    riskLevel,
    interpretation,
    recommendations,
    referralNeeded,
    referralDetail,
  };
}
