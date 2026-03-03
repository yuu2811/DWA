import {
  AssessmentResult,
  DomainResult,
  ActionItem,
  ActionPlan,
} from '@/lib/types';

let actionIdCounter = 0;
function nextId(): string {
  return `action-${++actionIdCounter}`;
}

function sleepActions(d: DomainResult): ActionItem[] {
  const actions: ActionItem[] = [];

  if (d.riskLevel === 'high') {
    actions.push({
      id: nextId(),
      priority: 'urgent',
      category: 'medical_referral',
      title: 'SAS精密検査（PSG／簡易モニター）の実施',
      description:
        'ESS 16点以上は重度の日中傾眠を示します。閉塞性睡眠時無呼吸症候群（OSAS）の可能性が高く、終夜睡眠ポリグラフ検査（PSG）または簡易モニター検査を至急実施してください。',
      actor: 'specialist',
      actorLabel: '睡眠専門医／呼吸器内科',
      relatedDomains: ['sleep'],
      timeline: '2週間以内',
      checklist: [
        '睡眠専門外来または呼吸器内科への紹介状作成',
        'PSG検査または簡易モニター検査の予約',
        '検査結果に基づくCPAP適応判定',
        '検査結果を産業医へ共有',
      ],
    });
    actions.push({
      id: nextId(),
      priority: 'urgent',
      category: 'consultation',
      title: '産業医面談：運転業務の就業判定',
      description:
        '重度の眠気は居眠り運転リスクに直結します。検査結果が出るまでの間、運転業務の制限や配置転換を含む就業上の措置を検討してください。',
      actor: 'occupational_physician',
      actorLabel: '産業医',
      relatedDomains: ['sleep'],
      timeline: '1週間以内',
      checklist: [
        '就業制限の要否判定',
        '一時的な運転業務制限の検討',
        'CPAP導入後の就業復帰基準の設定',
      ],
    });
  } else if (d.riskLevel === 'moderate') {
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'screening',
      title: 'SASスクリーニング検査の実施',
      description:
        'ESS 11〜15点は日中の過度な眠気を示し、SASの可能性があります。簡易型SASスクリーニング（パルスオキシメトリ等）の実施を推奨します。',
      actor: 'occupational_physician',
      actorLabel: '産業医',
      relatedDomains: ['sleep'],
      timeline: '1ヶ月以内',
      checklist: [
        '簡易パルスオキシメトリ検査の実施',
        'AHI（無呼吸低呼吸指数）の確認',
        '異常値の場合は専門医紹介',
      ],
    });
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'lifestyle_guidance',
      title: '睡眠衛生指導',
      description:
        '就寝・起床時間の固定、寝室環境の最適化、乗務前の仮眠活用について具体的な指導を行います。',
      actor: 'public_health_nurse',
      actorLabel: '保健師',
      relatedDomains: ['sleep'],
      timeline: '次回面談時',
      checklist: [
        '睡眠日誌の記入開始',
        '就寝前のカフェイン・アルコール制限の指導',
        '15〜20分の戦略的仮眠の活用法',
        '寝室の遮光・温度管理のアドバイス',
      ],
    });
  } else {
    actions.push({
      id: nextId(),
      priority: 'optional',
      category: 'self_care',
      title: '良好な睡眠習慣の維持',
      description:
        '現在の睡眠状態は良好です。引き続き7〜8時間の睡眠を確保し、乗務前の十分な休息を維持してください。',
      actor: 'driver',
      actorLabel: '本人',
      relatedDomains: ['sleep'],
      timeline: '継続',
    });
  }

  return actions;
}

function stressActions(d: DomainResult): ActionItem[] {
  const actions: ActionItem[] = [];

  if (d.riskLevel === 'high') {
    actions.push({
      id: nextId(),
      priority: 'urgent',
      category: 'medical_referral',
      title: '心療内科／精神科への受診勧奨',
      description:
        'K6 13点以上は重度の心理的苦痛を示し、うつ病や不安障害の可能性が高い状態です。速やかに専門医の受診を勧奨してください。',
      actor: 'specialist',
      actorLabel: '心療内科医／精神科医',
      relatedDomains: ['stress'],
      timeline: '2週間以内',
      checklist: [
        '心療内科または精神科への紹介状作成',
        '自殺念慮の有無の確認（PHQ-9 Item 9等）',
        '受診までの経過観察体制の確保',
        '受診結果の産業医への共有',
      ],
    });
    actions.push({
      id: nextId(),
      priority: 'urgent',
      category: 'consultation',
      title: '産業医面談：就業上の配慮検討',
      description:
        '精神的健康状態が乗務の安全性に影響する可能性があります。就業制限や業務負荷軽減について検討してください。',
      actor: 'occupational_physician',
      actorLabel: '産業医',
      relatedDomains: ['stress'],
      timeline: '1週間以内',
      checklist: [
        '就業可否の判定',
        '時間外労働の制限検討',
        '業務負荷軽減措置の検討',
        '定期フォローアップの設定',
      ],
    });
  } else if (d.riskLevel === 'moderate') {
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'consultation',
      title: '保健師によるストレスケア面談',
      description:
        'K6 5〜12点は一定の心理的ストレスを示します。ストレス要因の特定と対処法について保健師面談を実施してください。',
      actor: 'public_health_nurse',
      actorLabel: '保健師',
      relatedDomains: ['stress'],
      timeline: '2週間以内',
      checklist: [
        'ストレス要因の聞き取り（職場・家庭）',
        'セルフケア技法の指導（呼吸法・リラクゼーション）',
        'EAP（従業員支援プログラム）の案内',
        '1ヶ月後のフォローアップ面談設定',
      ],
    });
  } else {
    actions.push({
      id: nextId(),
      priority: 'optional',
      category: 'self_care',
      title: 'セルフケアの継続',
      description:
        'メンタルヘルスは良好な状態です。趣味・運動・休息を通じた現在のストレスコーピングを継続してください。',
      actor: 'driver',
      actorLabel: '本人',
      relatedDomains: ['stress'],
      timeline: '継続',
    });
  }

  return actions;
}

function fatigueActions(d: DomainResult): ActionItem[] {
  const actions: ActionItem[] = [];

  if (d.riskLevel === 'high') {
    actions.push({
      id: nextId(),
      priority: 'urgent',
      category: 'consultation',
      title: '産業医面談：労働時間・運転時間の見直し',
      description:
        '疲労蓄積度が高い状態です。改善基準告示に基づく拘束時間・運転時間の遵守状況を確認し、勤務スケジュールの見直しを行ってください。',
      actor: 'occupational_physician',
      actorLabel: '産業医',
      relatedDomains: ['fatigue'],
      timeline: '1週間以内',
      checklist: [
        '月間時間外労働時間の確認',
        '連続運転時間と休憩の実態確認',
        '勤務間インターバル（11時間以上）の確保状況',
        '必要に応じ事業主への勧告書作成',
      ],
    });
    actions.push({
      id: nextId(),
      priority: 'urgent',
      category: 'screening',
      title: '健康診断結果の再確認・追加検査',
      description:
        '高度の疲労蓄積は潜在的な疾患（貧血、甲状腺機能低下、睡眠障害、うつ病等）を反映している場合があります。直近の健診結果を再確認し、必要に応じ追加検査を実施してください。',
      actor: 'occupational_physician',
      actorLabel: '産業医',
      relatedDomains: ['fatigue'],
      timeline: '2週間以内',
      checklist: [
        '直近の定期健診結果レビュー',
        '血液検査（CBC, TSH, HbA1c）の追加検討',
        '睡眠障害・うつ病のスクリーニング結果との照合',
      ],
    });
  } else if (d.riskLevel === 'moderate') {
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'consultation',
      title: '保健師面談：休養・休日の取り方指導',
      description:
        '中程度の疲労蓄積が見られます。休日の過ごし方、睡眠時間の確保、乗務間の休息方法について指導を行ってください。',
      actor: 'public_health_nurse',
      actorLabel: '保健師',
      relatedDomains: ['fatigue'],
      timeline: '次回面談時',
      checklist: [
        '1日の休息時間と睡眠時間の確認',
        '休日の過ごし方（アクティブレスト）の提案',
        '疲労のセルフモニタリング方法の指導',
        '2週間後のフォローアップ設定',
      ],
    });
  } else {
    actions.push({
      id: nextId(),
      priority: 'optional',
      category: 'self_care',
      title: '現行の勤務・休養パターンの維持',
      description:
        '疲労蓄積度は低い状態です。現在の勤務体制と休養パターンを維持してください。',
      actor: 'driver',
      actorLabel: '本人',
      relatedDomains: ['fatigue'],
      timeline: '継続',
    });
  }

  return actions;
}

function dietActions(d: DomainResult): ActionItem[] {
  const actions: ActionItem[] = [];

  if (d.riskLevel === 'high') {
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'medical_referral',
      title: '管理栄養士による個別食事指導',
      description:
        '食習慣に大きな課題があり、生活習慣病リスクが高い状態です。管理栄養士による個別の栄養指導を実施してください。',
      actor: 'nutritionist',
      actorLabel: '管理栄養士',
      relatedDomains: ['diet'],
      timeline: '1ヶ月以内',
      checklist: [
        '3日間の食事記録の作成依頼',
        '管理栄養士面談の予約',
        '個別の食事改善プランの作成',
        '1ヶ月後のフォローアップ面談設定',
      ],
    });
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'screening',
      title: '特定保健指導の受講勧奨',
      description:
        'メタボリックシンドロームのリスク該当の場合、特定保健指導（積極的支援または動機付け支援）の受講を促してください。',
      actor: 'public_health_nurse',
      actorLabel: '保健師',
      relatedDomains: ['diet'],
      timeline: '次回健診後',
      checklist: [
        '特定健診結果の確認（腹囲・BMI・血圧・血糖・脂質）',
        '該当する場合は特定保健指導プログラムへの登録',
        '通院・服薬中の場合は主治医への情報共有',
      ],
    });
  } else if (d.riskLevel === 'moderate') {
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'lifestyle_guidance',
      title: '保健師による食事改善ガイダンス',
      description:
        '食生活に改善の余地があります。ドライバーの勤務実態に合わせた実践的な食事アドバイスを行ってください。',
      actor: 'public_health_nurse',
      actorLabel: '保健師',
      relatedDomains: ['diet'],
      timeline: '次回面談時',
      checklist: [
        '朝食欠食の有無と対策の相談',
        '運転中の水分補給方法の確認',
        'コンビニ・SA/PAでの食事選択のアドバイス',
        '夜食・間食の見直し',
      ],
    });
  } else {
    actions.push({
      id: nextId(),
      priority: 'optional',
      category: 'self_care',
      title: '現在の食習慣の維持',
      description:
        '食習慣は良好です。引き続きバランスの良い食事と十分な水分補給を継続してください。',
      actor: 'driver',
      actorLabel: '本人',
      relatedDomains: ['diet'],
      timeline: '継続',
    });
  }

  return actions;
}

function exerciseActions(d: DomainResult): ActionItem[] {
  const actions: ActionItem[] = [];

  if (d.riskLevel === 'high') {
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'lifestyle_guidance',
      title: '運動指導プログラムの開始',
      description:
        '身体活動量が大幅に不足しています。健康運動指導士または理学療法士による運動処方を含む段階的な運動プログラムを開始してください。',
      actor: 'exercise_instructor',
      actorLabel: '健康運動指導士',
      relatedDomains: ['exercise'],
      timeline: '1ヶ月以内',
      checklist: [
        '運動開始前のメディカルチェック（既往歴・服薬確認）',
        '個人に合わせた運動処方の作成（種類・頻度・時間・強度）',
        '1日15分のウォーキングからの段階的開始',
        '乗務前後のストレッチ習慣の導入',
      ],
    });
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'follow_up',
      title: '通院中の場合：主治医への運動可否確認',
      description:
        '循環器疾患、糖尿病等で通院・服薬中の場合は、運動開始前に主治医へ運動可否と注意事項を確認してください。',
      actor: 'occupational_physician',
      actorLabel: '産業医',
      relatedDomains: ['exercise'],
      timeline: '運動開始前',
      checklist: [
        '通院・服薬状況の確認',
        '該当する場合は主治医への情報提供書作成',
        '運動時の注意事項（血糖管理・血圧管理等）の伝達',
      ],
    });
  } else if (d.riskLevel === 'moderate') {
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'lifestyle_guidance',
      title: '保健師による運動アドバイス',
      description:
        '身体活動量は基準を満たしていますが、さらなる増加が推奨されます。日常生活に組み込める運動を提案してください。',
      actor: 'public_health_nurse',
      actorLabel: '保健師',
      relatedDomains: ['exercise'],
      timeline: '次回面談時',
      checklist: [
        '歩行量を1日30分以上に増やす目標設定',
        '休憩時のストレッチ・体操の導入',
        '階段利用や駐車場での歩行距離増加',
      ],
    });
  } else {
    actions.push({
      id: nextId(),
      priority: 'optional',
      category: 'self_care',
      title: '現在の運動習慣の維持',
      description:
        '十分な身体活動量が確保されています。引き続き現在の運動習慣を維持してください。',
      actor: 'driver',
      actorLabel: '本人',
      relatedDomains: ['exercise'],
      timeline: '継続',
    });
  }

  return actions;
}

function crossDomainActions(result: AssessmentResult): ActionItem[] {
  const actions: ActionItem[] = [];
  const highDomains = result.domains.filter((d) => d.riskLevel === 'high');
  const moderateDomains = result.domains.filter((d) => d.riskLevel === 'moderate');

  // Multiple high-risk domains → comprehensive review
  if (highDomains.length >= 2) {
    actions.push({
      id: nextId(),
      priority: 'urgent',
      category: 'consultation',
      title: '産業医による総合健康レビュー',
      description: `${highDomains.map((d) => d.domainLabel).join('・')}の${highDomains.length}領域で高リスクと判定されました。総合的な健康状態の評価と就業判定の見直しを行ってください。`,
      actor: 'occupational_physician',
      actorLabel: '産業医',
      relatedDomains: highDomains.map((d) => d.domain),
      timeline: '1週間以内',
      checklist: [
        '全領域の評価結果の総合レビュー',
        '就業適性判定の再検討',
        '必要な専門医受診の優先順位付け',
        '事業者への意見書作成（就業上の措置）',
        '1ヶ月後の再評価日程の設定',
      ],
    });
  }

  // Sleep high + Fatigue moderate/high → combined concern
  const sleepResult = result.domains.find((d) => d.domain === 'sleep');
  const fatigueResult = result.domains.find((d) => d.domain === 'fatigue');
  if (
    sleepResult &&
    fatigueResult &&
    sleepResult.riskLevel !== 'low' &&
    fatigueResult.riskLevel !== 'low' &&
    !(sleepResult.riskLevel === 'moderate' && fatigueResult.riskLevel === 'moderate')
  ) {
    actions.push({
      id: nextId(),
      priority: 'urgent',
      category: 'screening',
      title: '居眠り運転リスクの総合評価',
      description:
        '睡眠と疲労の両方に問題が認められます。居眠り運転事故のリスクが高まっている状態です。運転適性の総合評価を実施してください。',
      actor: 'occupational_physician',
      actorLabel: '産業医',
      relatedDomains: ['sleep', 'fatigue'],
      timeline: '1週間以内',
      checklist: [
        '過去のヒヤリ・ハット事例の聞き取り',
        '運転中の眠気の頻度・状況の確認',
        '連続運転時間と休憩パターンの見直し',
        'SAS検査結果との照合',
      ],
    });
  }

  // Moderate-only: multiple domains → periodic follow-up
  if (highDomains.length === 0 && moderateDomains.length >= 2) {
    actions.push({
      id: nextId(),
      priority: 'recommended',
      category: 'follow_up',
      title: '保健師による定期フォローアップの設定',
      description: `${moderateDomains.map((d) => d.domainLabel).join('・')}の${moderateDomains.length}領域で要改善と判定されました。定期的なフォローアップを通じて改善状況を確認してください。`,
      actor: 'public_health_nurse',
      actorLabel: '保健師',
      relatedDomains: moderateDomains.map((d) => d.domain),
      timeline: '1ヶ月以内',
      checklist: [
        '月1回のフォローアップ面談の設定',
        '各領域の改善目標の設定',
        '3ヶ月後の再評価の実施',
      ],
    });
  }

  // All low → maintenance
  if (highDomains.length === 0 && moderateDomains.length === 0) {
    actions.push({
      id: nextId(),
      priority: 'optional',
      category: 'follow_up',
      title: '次回定期健診・問診の実施',
      description:
        '全領域で良好な状態です。現在の健康状態を維持し、次回の定期健診時に再評価を行ってください。',
      actor: 'public_health_nurse',
      actorLabel: '保健師',
      relatedDomains: ['sleep', 'stress', 'fatigue', 'diet', 'exercise'],
      timeline: '次回定期健診時',
    });
  }

  return actions;
}

const priorityOrder: Record<string, number> = { urgent: 0, recommended: 1, optional: 2 };

export function generateActionPlan(result: AssessmentResult): ActionPlan {
  actionIdCounter = 0;

  const domainFns = [sleepActions, stressActions, fatigueActions, dietActions, exerciseActions];
  const allActions: ActionItem[] = [];

  // Generate domain-specific actions
  for (const domainResult of result.domains) {
    const fn = domainFns.find((_, i) => {
      const domainOrder = ['sleep', 'stress', 'fatigue', 'diet', 'exercise'];
      return domainOrder[i] === domainResult.domain;
    });
    if (fn) {
      allActions.push(...fn(domainResult));
    }
  }

  // Generate cross-domain actions
  allActions.push(...crossDomainActions(result));

  // Sort: urgent → recommended → optional
  allActions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  return {
    actions: allActions,
    generatedDate: result.assessmentDate,
  };
}
