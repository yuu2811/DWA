import { QuestionSection } from '../types';

const stressOptions = [
  { value: 0, label: 'まったくない' },
  { value: 1, label: '少しだけ' },
  { value: 2, label: 'ときどき' },
  { value: 3, label: 'たいてい' },
  { value: 4, label: 'いつも' },
];

export const stressSection: QuestionSection = {
  domain: 'stress',
  title: 'ストレス',
  description:
    '過去30日間に、以下の状態がどのくらいの頻度でありましたか？',
  scaleName: 'K6（ケスラー心理的苦痛尺度）',
  questions: [
    {
      id: 'stress-1',
      text: '神経過敏に感じましたか',
      options: stressOptions,
    },
    {
      id: 'stress-2',
      text: '絶望的だと感じましたか',
      options: stressOptions,
    },
    {
      id: 'stress-3',
      text: 'そわそわ、落ち着かなく感じましたか',
      options: stressOptions,
    },
    {
      id: 'stress-4',
      text: '気分が沈み込んで、何が起こっても気が晴れないように感じましたか',
      options: stressOptions,
    },
    {
      id: 'stress-5',
      text: '何をするのも骨折りだと感じましたか',
      options: stressOptions,
    },
    {
      id: 'stress-6',
      text: '自分は価値のない人間だと感じましたか',
      options: stressOptions,
    },
  ],
};
