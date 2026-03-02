import { AcademicReference } from './types';

export const academicReferences: AcademicReference[] = [
  {
    id: 'ess-original',
    domain: 'sleep',
    authors: 'Johns MW',
    title:
      'A new method for measuring daytime sleepiness: the Epworth sleepiness scale',
    journal: 'Sleep',
    year: 1991,
    volume: '14(6)',
    pages: '540-545',
    doi: '10.1093/sleep/14.6.540',
  },
  {
    id: 'jess-validation',
    domain: 'sleep',
    authors: 'Takegami M, Suzukamo Y, Wakita T, et al.',
    title:
      'Development of a Japanese version of the Epworth Sleepiness Scale (JESS) based on Item Response Theory',
    journal: 'Sleep Med',
    year: 2009,
    volume: '10(5)',
    pages: '556-565',
    doi: '10.1016/j.sleep.2008.04.015',
  },
  {
    id: 'ess-japanese-drivers',
    domain: 'sleep',
    authors: 'Asaoka S, Noda A, Inoue Y',
    title:
      'Investigation of obstructive sleep apnea and excessive daytime sleepiness in professional Japanese truck drivers',
    journal: 'Sleep Biol Rhythms',
    year: 2010,
    volume: '8(1)',
    pages: '21-29',
    note:
      '日本人大型トラック運転者を対象にESSの有用性を検証',
  },
  {
    id: 'k6-original',
    domain: 'stress',
    authors: 'Kessler RC, Andrews G, Colpe LJ, et al.',
    title:
      'Short screening scales to monitor population prevalences and trends in non-specific psychological distress',
    journal: 'Psychol Med',
    year: 2002,
    volume: '32(6)',
    pages: '959-976',
    doi: '10.1017/S0033291702006074',
  },
  {
    id: 'k6-japanese',
    domain: 'stress',
    authors: 'Furukawa TA, Kawakami N, Saitoh M, et al.',
    title:
      'The performance of the Japanese version of the K6 and K10 in the World Mental Health Survey Japan',
    journal: 'Int J Methods Psychiatr Res',
    year: 2008,
    volume: '17(3)',
    pages: '152-158',
    doi: '10.1002/mpr.257',
    note:
      'WMH-J調査（n=2,436）でK6日本語版の妥当性を検証。AUC 0.94',
  },
  {
    id: 'k6-cutoff',
    domain: 'stress',
    authors: 'Sakurai K, Nishi A, Kondo K, et al.',
    title:
      'Screening performance of K6/K10 and other screening instruments for mood and anxiety disorders in Japan',
    journal: 'Psychiatry Clin Neurosci',
    year: 2011,
    volume: '65(5)',
    pages: '434-441',
    doi: '10.1111/j.1440-1819.2011.02236.x',
  },
  {
    id: 'fatigue-mhlw',
    domain: 'fatigue',
    authors: '厚生労働省',
    title: '労働者の疲労蓄積度自己診断チェックリスト',
    journal: '厚生労働省 労働基準局',
    year: 2023,
    note:
      '過重労働による健康障害防止のための総合対策に基づく自己診断ツール。2023年改正版',
  },
  {
    id: 'fatigue-overwork',
    domain: 'fatigue',
    authors: '厚生労働省',
    title: '過重労働による健康障害防止のための総合対策について',
    journal: '厚生労働省 基発',
    year: 2020,
    note:
      '長時間労働者への面接指導制度の根拠通達。疲労蓄積度チェックリストの活用を推奨',
  },
  {
    id: 'fatigue-drivers',
    domain: 'fatigue',
    authors: 'Useche SA, Ortiz VG, Cendales BE',
    title:
      'Stress-related psychosocial factors at work, fatigue, and risky driving behavior in bus rapid transport (BRT) drivers',
    journal: 'Accid Anal Prev',
    year: 2017,
    volume: '104',
    pages: '106-114',
    doi: '10.1016/j.aap.2017.04.023',
    note:
      'バスドライバーにおける疲労蓄積と危険運転行動の関連を検証',
  },
  {
    id: 'tokutei-kenshin',
    domain: 'diet',
    authors: '厚生労働省',
    title: '標準的な健診・保健指導プログラム【令和6年度版】',
    journal: '厚生労働省 健康局',
    year: 2024,
    note: '特定健診における食生活に関する質問票項目を参考に構成',
  },
  {
    id: 'mlit-manual',
    domain: 'diet',
    authors: '国土交通省',
    title: '事業用自動車の運転者の健康管理マニュアル',
    journal: '国土交通省 自動車局',
    year: 2022,
    note:
      'ドライバーの食生活・飲酒・カフェイン摂取に関する指導事項を参考に構成',
  },
  {
    id: 'ipaq-original',
    domain: 'exercise',
    authors: 'Craig CL, Marshall AL, Sjöström M, et al.',
    title:
      'International physical activity questionnaire: 12-country reliability and validity',
    journal: 'Med Sci Sports Exerc',
    year: 2003,
    volume: '35(8)',
    pages: '1381-1395',
    doi: '10.1249/01.MSS.0000078924.61453.FB',
  },
  {
    id: 'ipaq-scoring',
    domain: 'exercise',
    authors: 'IPAQ Research Committee',
    title:
      'Guidelines for Data Processing and Analysis of the International Physical Activity Questionnaire (IPAQ) – Short and Long Forms',
    journal: 'IPAQ',
    year: 2005,
    note: 'IPAQ-SF の公式スコアリングガイドライン',
  },
  {
    id: 'sedentary-drivers',
    domain: 'exercise',
    authors: 'Varela-Mato V, Cancela JM, Ayan C, et al.',
    title:
      'Lifestyle and health among Spanish transportation drivers: a systematic review',
    journal: 'Int J Environ Res Public Health',
    year: 2017,
    volume: '14(5)',
    pages: '547',
    doi: '10.3390/ijerph14050547',
    note: '運輸業ドライバーの座位行動と健康リスクに関するシステマティックレビュー',
  },
];
