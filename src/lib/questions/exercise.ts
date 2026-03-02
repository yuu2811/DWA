import { QuestionSection, NumericQuestion } from '../types';

export const exerciseNumericQuestions: NumericQuestion[] = [
  {
    id: 'exercise-vigorous-days',
    text: '過去7日間で、激しい身体活動（重い荷物の運搬、ランニング、激しいスポーツなど）を行った日数',
    unit: '日/週',
    min: 0,
    max: 7,
    step: 1,
  },
  {
    id: 'exercise-vigorous-minutes',
    text: 'その激しい身体活動を行った日の、1日あたりの平均時間',
    unit: '分/日',
    min: 0,
    max: 480,
    step: 5,
  },
  {
    id: 'exercise-moderate-days',
    text: '過去7日間で、中程度の身体活動（軽い荷物の運搬、通常速度の自転車、軽いスポーツなど）を行った日数',
    unit: '日/週',
    min: 0,
    max: 7,
    step: 1,
  },
  {
    id: 'exercise-moderate-minutes',
    text: 'その中程度の身体活動を行った日の、1日あたりの平均時間',
    unit: '分/日',
    min: 0,
    max: 480,
    step: 5,
  },
  {
    id: 'exercise-walking-days',
    text: '過去7日間で、10分以上続けて歩いた日数',
    unit: '日/週',
    min: 0,
    max: 7,
    step: 1,
  },
  {
    id: 'exercise-walking-minutes',
    text: 'その歩行を行った日の、1日あたりの平均歩行時間',
    unit: '分/日',
    min: 0,
    max: 480,
    step: 5,
  },
  {
    id: 'exercise-sitting-hours',
    text: '平日に座って過ごす1日の平均時間（運転中を含む）',
    unit: '時間/日',
    min: 0,
    max: 24,
    step: 0.5,
  },
];

export const exerciseSection: QuestionSection = {
  domain: 'exercise',
  title: '運動・身体活動',
  description:
    '過去7日間の身体活動についてお答えください。仕事中の活動も含みます。',
  scaleName: 'IPAQ-SF（国際標準化身体活動質問票 短縮版）',
  questions: [],
  numericQuestions: exerciseNumericQuestions,
};
