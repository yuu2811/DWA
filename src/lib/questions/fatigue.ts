import { QuestionSection } from '../types';

const fatigueOptions = [
  { value: 0, label: 'ほとんどない' },
  { value: 1, label: 'ときどきある' },
  { value: 2, label: 'よくある' },
  { value: 3, label: 'いつもある' },
];

export const fatigueSection: QuestionSection = {
  domain: 'fatigue',
  title: '疲労',
  description:
    '最近1ヶ月の状態についてお答えください。乗務中・乗務後の状態を思い浮かべてください。',
  scaleName: '疲労蓄積度自己診断チェックリスト（厚生労働省）',
  questions: [
    {
      id: 'fatigue-1',
      text: 'イライラする',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-2',
      text: '不安だ',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-3',
      text: '落ち着かない',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-4',
      text: 'ゆううつだ',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-5',
      text: 'よく眠れない',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-6',
      text: '体の調子が悪い',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-7',
      text: '物事に集中できない',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-8',
      text: 'することに間違いが多い',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-9',
      text: '仕事中、強い眠気に襲われる',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-10',
      text: 'やる気が出ない',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-11',
      text: 'へとへとだ（身体的に）',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-12',
      text: '朝、起きた時にぐったりした疲れを感じる',
      options: fatigueOptions,
    },
    {
      id: 'fatigue-13',
      text: '以前と比べて、疲れやすい',
      options: fatigueOptions,
    },
  ],
};
