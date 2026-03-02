import { QuestionSection } from '../types';

const dayOptions = [
  { value: 0, label: '0日（していない）' },
  { value: 1, label: '1日' },
  { value: 2, label: '2日' },
  { value: 3, label: '3日' },
  { value: 4, label: '4日' },
  { value: 5, label: '5日' },
  { value: 6, label: '6日' },
  { value: 7, label: '7日（毎日）' },
];

const minuteOptions = [
  { value: 0, label: 'していない' },
  { value: 10, label: '約10分' },
  { value: 20, label: '約20分' },
  { value: 30, label: '約30分' },
  { value: 45, label: '約45分' },
  { value: 60, label: '約1時間' },
  { value: 90, label: '約1時間30分' },
  { value: 120, label: '2時間以上' },
];

const sittingOptions = [
  { value: 2, label: '2時間未満' },
  { value: 3, label: '2〜4時間' },
  { value: 5, label: '4〜6時間' },
  { value: 7, label: '6〜8時間' },
  { value: 9, label: '8〜10時間' },
  { value: 11, label: '10〜12時間' },
  { value: 13, label: '12時間以上' },
];

export const exerciseSection: QuestionSection = {
  domain: 'exercise',
  title: '運動・身体活動',
  description:
    '過去7日間の身体活動についてお答えください。仕事中の活動（荷物の積み降ろし、車両点検作業等）も含みます。',
  scaleName: 'IPAQ-SF（国際標準化身体活動質問票 短縮版）',
  questions: [
    {
      id: 'exercise-vigorous-days',
      text: '激しい身体活動（重い荷物の積み降ろし、ランニング、激しいスポーツなど）を行った日数',
      options: dayOptions,
    },
    {
      id: 'exercise-vigorous-minutes',
      text: '上記の激しい身体活動を行った日の、1日あたりの平均時間',
      options: minuteOptions,
    },
    {
      id: 'exercise-moderate-days',
      text: '中程度の身体活動（軽い荷物の運搬、車両点検作業、通常速度の自転車など）を行った日数',
      options: dayOptions,
    },
    {
      id: 'exercise-moderate-minutes',
      text: '上記の中程度の身体活動を行った日の、1日あたりの平均時間',
      options: minuteOptions,
    },
    {
      id: 'exercise-walking-days',
      text: '10分以上続けて歩いた日数（休憩中の散歩、業務中の歩行等を含む）',
      options: dayOptions,
    },
    {
      id: 'exercise-walking-minutes',
      text: '上記の歩行を行った日の、1日あたりの平均歩行時間',
      options: minuteOptions,
    },
    {
      id: 'exercise-sitting-hours',
      text: '平日に座って過ごす1日の平均時間（運転中の座位時間を含む）',
      options: sittingOptions,
    },
  ],
};
