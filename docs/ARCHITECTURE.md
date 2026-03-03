# DWA アーキテクチャ設計書

## 1. プロジェクト概要

**DWA（Driver Wellness Assessment）** は、産業医・保健師がドライバー（トラック・バス・タクシー等）の健康面談で使用する Web ベースの健康スクリーニングツールです。

### 1.1 目的

- 学術的に妥当性が検証された尺度を用いた、標準化された健康評価
- スコアリングに基づくリスク分類と、具体的な受診勧奨・アクションプランの自動生成
- 産業医がそのまま活用できるレポート形式（画面表示＋印刷対応）

### 1.2 対象ユーザー

| 役割 | 利用場面 |
|------|----------|
| **産業医** | 面談時の問診実施、結果に基づく就業判定・受診勧奨 |
| **保健師** | 健診後の保健指導、定期フォローアップ |
| **ドライバー本人** | 問診への回答（産業医/保健師の立会いのもと） |

---

## 2. 技術スタック

| 技術 | バージョン | 用途 |
|------|-----------|------|
| **Next.js** | 14.2.35 (App Router) | フレームワーク |
| **React** | 18.x | UI ライブラリ |
| **TypeScript** | 5.x | 型安全性 |
| **Tailwind CSS** | 3.4.x | スタイリング |
| **PostCSS** | 8.x | CSS 処理 |

### 2.1 設計方針

- **バックエンド不要**: 全データはブラウザ内（`sessionStorage`）で完結
- **外部 API 依存なし**: オフライン環境でも動作可能
- **印刷対応**: `@media print` によるライトテーマ自動切替
- **ゼロ依存ポリシー**: React/Next.js/Tailwind 以外のランタイムライブラリなし

---

## 3. ディレクトリ構造

```
src/
├── app/                          # Next.js App Router
│   ├── globals.css               # デザインシステム（CSS カスタムプロパティ）
│   ├── layout.tsx                # ルートレイアウト
│   ├── page.tsx                  # ランディングページ
│   ├── assessment/
│   │   └── page.tsx              # 問診ページ
│   └── results/
│       └── page.tsx              # 結果ページ
│
├── lib/                          # ビジネスロジック（純粋関数）
│   ├── types.ts                  # 全型定義
│   ├── references.ts             # 学術文献データ
│   ├── questions/                # 各領域の質問票定義
│   │   ├── sleep.ts              # ESS 8項目
│   │   ├── stress.ts             # K6 6項目
│   │   ├── fatigue.ts            # 疲労蓄積度CL 13項目
│   │   ├── diet.ts               # 食事評価 8項目
│   │   └── exercise.ts           # IPAQ-SF 7項目
│   └── scoring/                  # スコアリング・判定ロジック
│       ├── sleep.ts              # ESS スコアリング
│       ├── stress.ts             # K6 スコアリング
│       ├── fatigue.ts            # 疲労蓄積度スコアリング
│       ├── diet.ts               # 食事スコアリング（項目別推奨生成）
│       ├── exercise.ts           # IPAQ-SF MET 計算
│       ├── overall.ts            # 総合判定ロジック
│       └── actionPlan.ts         # アクションプラン生成
│
└── components/                   # UI コンポーネント
    ├── assessment/               # 問診画面
    │   ├── QuestionnaireWizard.tsx  # ステップウィザード
    │   ├── ProgressBar.tsx          # 進捗バー
    │   ├── LikertScale.tsx          # 選択肢コンポーネント
    │   ├── SleepSection.tsx         # 睡眠セクション
    │   ├── StressSection.tsx        # ストレスセクション
    │   ├── FatigueSection.tsx       # 疲労セクション
    │   ├── DietSection.tsx          # 食事セクション
    │   └── ExerciseSection.tsx      # 運動セクション
    └── results/                  # 結果画面
        ├── ResultsDashboard.tsx     # ダッシュボード（全体構成）
        ├── RadarChart.tsx           # 5角形レーダーチャート（SVG）
        ├── RiskBadge.tsx            # リスクレベルバッジ
        ├── DomainScoreCard.tsx      # 領域別スコアカード
        ├── ActionPlanPanel.tsx      # アクションプランパネル
        └── AcademicReferences.tsx   # 学術的根拠（アコーディオン）
```

---

## 4. データフロー

```
┌─────────────┐     sessionStorage      ┌──────────────┐
│  Assessment  │ ──── AllAnswers ─────▶ │   Results    │
│    Page      │     (JSON文字列)        │     Page     │
└─────────────┘                         └──────────────┘
       │                                        │
       ▼                                        ▼
┌─────────────┐                         ┌──────────────┐
│ Questionnaire│                        │calculateOverall│
│   Wizard     │                        │   Result()    │
│              │                        │               │
│ Step 1: 睡眠 │                        │  ┌──────────┐ │
│ Step 2: ストレス│                      │  │scoreSleep│ │
│ Step 3: 疲労 │                        │  │scoreStress│ │
│ Step 4: 食事 │                        │  │scoreFatigue││
│ Step 5: 運動 │                        │  │scoreDiet  │ │
└─────────────┘                         │  │scoreExercise│
                                        │  └──────────┘ │
                                        │       │       │
                                        │       ▼       │
                                        │ AssessmentResult│
                                        │       │       │
                                        │       ▼       │
                                        │ generateAction │
                                        │   Plan()      │
                                        └──────────────┘
                                                │
                                                ▼
                                        ┌──────────────┐
                                        │ ResultsDashboard│
                                        │ ├─ RadarChart │
                                        │ ├─ ActionPlan │
                                        │ ├─ ScoreCards │
                                        │ └─ References │
                                        └──────────────┘
```

### 4.1 データの保存と受け渡し

1. **問診ページ**: `QuestionnaireWizard` が各ステップの回答を `state` で管理
2. **完了時**: `AllAnswers` オブジェクトを `sessionStorage` に `dwa-answers` キーで保存
3. **結果ページ**: `sessionStorage` から回答を取り出し、`calculateOverallResult()` で計算
4. **表示**: `AssessmentResult` を `ResultsDashboard` に渡して描画
5. **アクションプラン**: `generateActionPlan(result)` で結果からアクション群を導出

---

## 5. デザインシステム

### 5.1 カラーパレット

| トークン | 値 | 用途 |
|---------|-----|------|
| `--bg-primary` | `#0a0f1e` | メイン背景 |
| `--bg-secondary` | `#111827` | セカンダリ背景 |
| `--bg-card` | `#1a2035` | カード背景 |
| `--accent-blue` | `#638cff` | 睡眠・プライマリアクセント |
| `--accent-purple` | `#a78bfa` | ストレス |
| `--accent-rose` | `#fb7185` | 疲労・危険 |
| `--accent-emerald` | `#34d399` | 食事・良好 |
| `--accent-amber` | `#fbbf24` | 運動・注意 |

### 5.2 主要コンポーネントスタイル

- **`.glass`**: `backdrop-filter: blur(24px)` + 半透明背景によるグラスモーフィズム
- **`.gradient-text`**: blue→purple→emerald のグラデーションテキスト
- **`.glow-{color}`**: `box-shadow` による発光エフェクト
- **`.score-ring`**: SVG 円形プログレスバー
- **`.radar-polygon`**: SVG レーダーチャートのデータ多角形

### 5.3 印刷対応

`@media print` で CSS カスタムプロパティを上書きし、白背景・黒文字に自動切替：
- `.no-print`: 画面専用要素を非表示
- `.print-break`: 改ページ挿入
- グラスモーフィズム → 白背景＋ボーダー
- グラデーションテキスト → 黒文字

---

## 6. 評価領域一覧

| # | 領域 | 使用尺度 | 項目数 | スコア範囲 | 単位 |
|---|------|----------|--------|-----------|------|
| 1 | 睡眠 | ESS（エプワース眠気尺度） | 8 | 0〜24 | 点 |
| 2 | ストレス | K6（ケスラー心理的苦痛尺度） | 6 | 0〜24 | 点 |
| 3 | 疲労 | 疲労蓄積度自己診断チェックリスト（厚生労働省） | 13 | 0〜39 | 点 |
| 4 | 食事・栄養 | 食事評価（特定健診質問票・MLIT マニュアル準拠） | 8 | 0〜32 | 点 |
| 5 | 運動・身体活動 | IPAQ-SF（国際標準化身体活動質問票 短縮版） | 7 | 0〜∞ | MET-分/週 |

**合計質問数: 42項目**（所要時間: 約10〜15分）

---

## 7. ページ構成

### 7.1 ランディングページ (`/`)

- プロジェクト概要、5領域の紹介カード
- 診断開始CTA
- 免責事項

### 7.2 問診ページ (`/assessment`)

- 5ステップウィザード形式
- ステップ順: 睡眠 → ストレス → 疲労 → 食事 → 運動
- 全問回答でバリデーション、未回答時はエラー表示
- 完了時に結果ページへ自動遷移

### 7.3 結果ページ (`/results`)

- 総合判定カード + レーダーチャート（2カラム）
- 受診勧奨バナー（該当時のみ表示）
- アクションプランパネル（優先度別グループ）
- 領域別スコアカード（5枚、スコアリング可視化付き）
- 学術的根拠（アコーディオン、印刷時は全展開）
- 免責事項
- 印刷ボタン / 再診断ボタン
