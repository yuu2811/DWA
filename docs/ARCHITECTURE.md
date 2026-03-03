# DWA アーキテクチャ設計書

## 1. プロジェクト概要

**DWA（Driver Wellness Assessment）** は、産業医・保健師がドライバー（トラック・バス・タクシー等）の健康面談で使用する Web ベースの健康スクリーニング＆継続管理プラットフォームです。

### 1.1 目的

- 学術的に妥当性が検証された尺度を用いた、標準化された健康評価
- スコアリングに基づくリスク分類と、具体的な受診勧奨・アクションプランの自動生成
- 診断履歴の蓄積と経時変化の可視化による継続的な健康管理
- 産業医がそのまま活用できるレポート形式（画面表示＋印刷対応）

### 1.2 対象ユーザー

| 役割 | 利用場面 |
|------|----------|
| **産業医** | 面談時の問診実施、結果に基づく就業判定・受診勧奨、所見メモの記録 |
| **保健師** | 健診後の保健指導、定期フォローアップ、履歴に基づく傾向分析 |
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

- **バックエンド不要**: 全データはブラウザ内（`localStorage`）で完結
- **外部 API 依存なし**: オフライン環境でも動作可能（PWA 対応）
- **印刷対応**: `@media print` によるライトテーマ自動切替、A4 レポート形式
- **ゼロ依存ポリシー**: React/Next.js/Tailwind 以外のランタイムライブラリなし

---

## 3. ディレクトリ構造

```
src/
├── app/                              # Next.js App Router
│   ├── globals.css                   # デザインシステム（CSS カスタムプロパティ）
│   ├── layout.tsx                    # ルートレイアウト（Navigation 配置）
│   ├── manifest.ts                   # PWA マニフェスト
│   ├── page.tsx                      # ランディングページ
│   ├── assessment/
│   │   └── page.tsx                  # 問診ページ
│   ├── results/
│   │   └── page.tsx                  # 結果ページ
│   ├── history/
│   │   └── page.tsx                  # 履歴ページ
│   └── settings/
│       └── page.tsx                  # 設定ページ
│
├── hooks/                            # カスタムフック
│   └── useCountUp.ts                # スコアカウントアップアニメーション
│
├── lib/                              # ビジネスロジック（純粋関数）
│   ├── types.ts                      # 全型定義
│   ├── constants.ts                  # 共通定数（リスク設定、ドメイン色、改善方向）
│   ├── storage.ts                    # localStorage 抽象化レイヤー
│   ├── references.ts                 # 学術文献データ
│   ├── questions/                    # 各領域の質問票定義
│   │   ├── sleep.ts                  # ESS 8 項目
│   │   ├── stress.ts                 # K6 6 項目
│   │   ├── fatigue.ts                # 疲労蓄積度 CL 13 項目
│   │   ├── diet.ts                   # 食事評価 8 項目
│   │   └── exercise.ts              # IPAQ-SF 7 項目
│   └── scoring/                      # スコアリング・判定ロジック
│       ├── sleep.ts                  # ESS スコアリング
│       ├── stress.ts                 # K6 スコアリング
│       ├── fatigue.ts                # 疲労蓄積度スコアリング
│       ├── diet.ts                   # 食事スコアリング（項目別推奨生成）
│       ├── exercise.ts              # IPAQ-SF MET 計算
│       ├── overall.ts               # 総合判定ロジック
│       └── actionPlan.ts            # アクションプラン生成
│
└── components/                       # UI コンポーネント
    ├── shared/                       # 共通コンポーネント
    │   └── Navigation.tsx            # レスポンシブナビゲーション
    ├── profile/                      # プロフィール
    │   └── DriverProfileForm.tsx     # プロフィール入力フォーム
    ├── assessment/                   # 問診画面
    │   ├── QuestionnaireWizard.tsx   # ステップウィザード（自動保存・途中再開）
    │   ├── ProgressBar.tsx           # 進捗バー
    │   ├── LikertScale.tsx           # 選択肢コンポーネント
    │   ├── SleepSection.tsx          # 睡眠セクション
    │   ├── StressSection.tsx         # ストレスセクション
    │   ├── FatigueSection.tsx        # 疲労セクション
    │   ├── DietSection.tsx           # 食事セクション
    │   └── ExerciseSection.tsx       # 運動セクション
    └── results/                      # 結果画面
        ├── ResultsDashboard.tsx      # ダッシュボード（全体構成）
        ├── KeyFindingsSummary.tsx    # 重要所見サマリー
        ├── RadarChart.tsx            # 5 角形レーダーチャート（SVG、前回比較）
        ├── TrendChart.tsx            # 履歴トレンドチャート（SVG 折れ線）
        ├── RiskBadge.tsx             # リスクレベルバッジ
        ├── DomainScoreCard.tsx       # 領域別スコアカード（アニメーション付き）
        ├── ActionPlanPanel.tsx       # アクションプランパネル（進捗トラッキング）
        ├── DoctorNotesPanel.tsx      # 産業医所見メモパネル
        ├── PrintReport.tsx           # 印刷専用レポート（A4、署名欄）
        └── AcademicReferences.tsx    # 学術的根拠（アコーディオン）
```

---

## 4. データフロー

```
┌──────────────┐   localStorage    ┌──────────────┐   localStorage
│  Landing     │ ──── Profile ───▶ │  Assessment  │ ──── Draft ───▶ (自動保存)
│  Page (/)    │                   │  Page        │
└──────────────┘                   └──────┬───────┘
                                          │ 完了時
                                          ▼
                                   ┌──────────────┐
                                   │ saveAssessment│ → localStorage (dwa-history)
                                   └──────┬───────┘
                                          │
                                          ▼
                                   ┌──────────────┐
                                   │  Results     │ ← getAssessmentById()
                                   │  Page        │ ← getPreviousAssessment()
                                   └──────────────┘
```

### 4.1 Storage API

| 関数 | 用途 |
|------|------|
| `getProfile()` / `saveProfile()` | プロフィール CRUD |
| `getHistory()` / `saveAssessment()` | 診断履歴の読み書き（最大 50 件） |
| `getAssessmentById()` / `getPreviousAssessment()` | 個別/前回取得 |
| `getActionProgress()` / `toggleActionComplete()` | アクション進捗 |
| `saveDraft()` / `getDraft()` / `clearDraft()` | 下書き管理 |
| `saveNotes()` / `saveFollowUpDate()` | 所見メモ・フォローアップ日 |
| `exportHistoryJSON()` / `exportHistoryCSV()` | データエクスポート |
| `importData()` / `clearAllData()` / `deleteAssessment()` | データ管理 |

### 4.2 localStorage キー

| キー | データ型 | 説明 |
|------|---------|------|
| `dwa-profile` | `DriverProfile` | ドライバー基本情報 |
| `dwa-history` | `StoredAssessment[]` | 診断履歴（最大 50 件） |
| `dwa-action-progress` | `Record<id, Record<actionId, boolean>>` | アクション進捗 |
| `dwa-draft` | `DraftData` | 問診の途中保存 |

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

### 5.2 共有定数 (`lib/constants.ts`)

| 定数 | 説明 |
|------|------|
| `DOMAIN_COLORS` | 5 ドメインの色コード（`sleep: '#638cff'` 等） |
| `RISK_CONFIG` | リスクレベルごとのテキスト・色・背景・ボーダー |
| `LOWER_IS_BETTER_DOMAINS` | スコアが低いほど良好なドメイン（`['sleep', 'stress', 'fatigue']`） |

### 5.3 主要コンポーネントスタイル

- **`.glass`**: `backdrop-filter: blur(24px)` + 半透明背景によるグラスモーフィズム
- **`.gradient-text`**: blue→purple→emerald のグラデーションテキスト
- **`.glow-{color}`**: `box-shadow` による発光エフェクト
- **`.score-ring`**: SVG 円形プログレスバー
- **`.radar-polygon`**: SVG レーダーチャートのデータ多角形
- **`.safe-area-bottom`**: モバイルボトムナビの safe area 対応

### 5.4 印刷対応

`@media print` で CSS カスタムプロパティを上書きし、白背景・黒文字に自動切替：
- `.no-print`: 画面専用要素を非表示
- `.print-break`: 改ページ挿入
- グラスモーフィズム → 白背景＋ボーダー
- A4 ページサイズ、15mm マージン

---

## 6. 評価領域一覧

| # | 領域 | 使用尺度 | 項目数 | スコア範囲 | 単位 | 改善方向 |
|---|------|----------|--------|-----------|------|---------|
| 1 | 睡眠 | ESS（エプワース眠気尺度） | 8 | 0〜24 | 点 | 低い方が良好 |
| 2 | ストレス | K6（ケスラー心理的苦痛尺度） | 6 | 0〜24 | 点 | 低い方が良好 |
| 3 | 疲労 | 疲労蓄積度自己診断チェックリスト（厚生労働省） | 13 | 0〜39 | 点 | 低い方が良好 |
| 4 | 食事・栄養 | 食事評価（特定健診質問票・MLIT マニュアル準拠） | 8 | 0〜32 | 点 | 高い方が良好 |
| 5 | 運動・身体活動 | IPAQ-SF（国際標準化身体活動質問票 短縮版） | 7 | 0〜∞ | MET-分/週 | 高い方が良好 |

**合計質問数: 42 項目**（所要時間: 約 10〜15 分）

---

## 7. ページ構成

### 7.1 ランディングページ (`/`)

- リピーター: 「お帰りなさい」カード + 前回結果サマリー
- 新規ユーザー: プロフィールフォーム → 診断開始
- 5 領域紹介カード、免責事項

### 7.2 問診ページ (`/assessment`)

- 5 ステップウィザード形式（睡眠 → ストレス → 疲労 → 食事 → 運動）
- 途中保存 & 再開ダイアログ、全問バリデーション
- 完了時に結果ページへ自動遷移

### 7.3 結果ページ (`/results`)

- キーファインディングスサマリー
- 総合判定カード + レーダーチャート（前回比較、2 カラム）
- トレンドチャート、受診勧奨バナー
- アクションプランパネル（進捗トラッキング）
- 領域別スコアカード（アニメーション + デルタ表示）
- 産業医所見メモ（自動保存）
- 学術的根拠、印刷レポート、免責事項

### 7.4 履歴ページ (`/history`)

- 統計サマリーカード
- CSV / JSON エクスポート
- 時系列一覧（デルタ付き）
- 総合判定推移チャート

### 7.5 設定ページ (`/settings`)

- プロフィール編集
- データ管理（バックアップ出力/復元/全削除）
- アプリ情報
