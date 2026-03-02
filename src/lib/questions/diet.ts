import { QuestionSection } from '../types';

export const dietSection: QuestionSection = {
  domain: 'diet',
  title: '食事・栄養',
  description:
    'ふだんの食生活についてお答えください。乗務日の食事パターンを中心にお考えください。',
  scaleName: '食事評価（特定健診質問票・MLIT健康管理マニュアル準拠）',
  questions: [
    {
      id: 'diet-1',
      text: '朝食を毎日食べていますか（早朝出発の日も含めて）',
      options: [
        { value: 0, label: 'ほとんど食べない' },
        { value: 1, label: '週に2〜3回食べる' },
        { value: 2, label: '週に4〜5回食べる' },
        { value: 3, label: '毎日食べる' },
        { value: 4, label: '毎日バランスよく食べる' },
      ],
    },
    {
      id: 'diet-2',
      text: '1日に野菜料理を何皿程度食べますか（小鉢1つ=1皿）',
      options: [
        { value: 0, label: 'ほとんど食べない' },
        { value: 1, label: '1皿程度' },
        { value: 2, label: '2皿程度' },
        { value: 3, label: '3皿程度' },
        { value: 4, label: '4皿以上' },
      ],
    },
    {
      id: 'diet-3',
      text: '1日の水分摂取量（水・お茶）はどのくらいですか（運転中の摂取も含む）',
      options: [
        { value: 0, label: '500ml未満' },
        { value: 1, label: '500ml〜1L' },
        { value: 2, label: '1L〜1.5L' },
        { value: 3, label: '1.5L〜2L' },
        { value: 4, label: '2L以上' },
      ],
    },
    {
      id: 'diet-4',
      text: '夕食後に間食（3食以外の夜食含む）をとることがありますか',
      options: [
        { value: 4, label: 'ほとんどない' },
        { value: 3, label: '月に数回程度' },
        { value: 2, label: '週に2〜3回程度' },
        { value: 1, label: 'ほぼ毎日' },
        { value: 0, label: '毎日、量も多い' },
      ],
    },
    {
      id: 'diet-5',
      text: '食事の時間は規則的ですか（シフト勤務・長距離運転の影響も含めて）',
      options: [
        { value: 0, label: '非常に不規則' },
        { value: 1, label: 'やや不規則' },
        { value: 2, label: 'どちらともいえない' },
        { value: 3, label: 'おおむね規則的' },
        { value: 4, label: 'とても規則的' },
      ],
    },
    {
      id: 'diet-6',
      text: '塩辛い食品（漬物・味噌汁・加工食品など）を好んで食べますか',
      options: [
        { value: 4, label: 'あまり食べない' },
        { value: 3, label: '控えめにしている' },
        { value: 2, label: '普通' },
        { value: 1, label: 'やや多い' },
        { value: 0, label: '非常に多い' },
      ],
    },
    {
      id: 'diet-7',
      text: 'お酒を飲む頻度と量について',
      options: [
        { value: 4, label: '飲まない' },
        { value: 3, label: '週1〜2回・適量' },
        { value: 2, label: '週3〜4回・適量' },
        { value: 1, label: 'ほぼ毎日・適量を超える' },
        { value: 0, label: '毎日・多量に飲む' },
      ],
    },
    {
      id: 'diet-8',
      text: 'カフェイン飲料（コーヒー・エナジードリンク等）の1日の摂取量は（眠気覚まし目的を含む）',
      options: [
        { value: 4, label: '飲まないか1杯以下' },
        { value: 3, label: '2杯程度' },
        { value: 2, label: '3〜4杯' },
        { value: 1, label: '5〜6杯' },
        { value: 0, label: '7杯以上' },
      ],
    },
  ],
};
