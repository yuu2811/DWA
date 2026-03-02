import { QuestionSection } from '../types';

const sleepOptions = [
  { value: 0, label: '眠くならない' },
  { value: 1, label: '少し眠くなる' },
  { value: 2, label: 'しばしば眠くなる' },
  { value: 3, label: 'よく眠くなる' },
];

export const sleepSection: QuestionSection = {
  domain: 'sleep',
  title: '睡眠',
  description:
    '以下の状況で居眠りをしたり、眠くなったりすることがありますか？最近の日常生活を思い浮かべてお答えください。',
  scaleName: 'ESS（エプワース眠気尺度 日本語版）',
  questions: [
    {
      id: 'sleep-1',
      text: '座って読書をしているとき',
      options: sleepOptions,
    },
    {
      id: 'sleep-2',
      text: 'テレビを見ているとき',
      options: sleepOptions,
    },
    {
      id: 'sleep-3',
      text: '会議、映画館、劇場などで静かに座っているとき',
      options: sleepOptions,
    },
    {
      id: 'sleep-4',
      text: '乗客として1時間続けて自動車に乗っているとき',
      options: sleepOptions,
    },
    {
      id: 'sleep-5',
      text: '午後に横になって休息をとっているとき',
      options: sleepOptions,
    },
    {
      id: 'sleep-6',
      text: '座って人と話をしているとき',
      options: sleepOptions,
    },
    {
      id: 'sleep-7',
      text: '昼食後（飲酒なし）に静かに座っているとき',
      options: sleepOptions,
    },
    {
      id: 'sleep-8',
      text: '自分で車を運転中に、信号や交通渋滞で数分間止まっているとき',
      options: sleepOptions,
    },
  ],
};
