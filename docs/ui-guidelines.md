# UIガイドライン

## デザイン原則

### 1. シンプルさと明確さ
- 学習に集中できる最小限のUI
- 明確な視覚的階層
- 一貫性のあるデザインパターン
- 不要な装飾を避ける

### 2. アクセシビリティ
- WAI-ARIA対応
- キーボード操作のサポート
- 適切なコントラスト比（WCAG AAA基準）
- スクリーンリーダー対応
- フォントサイズの調整可能性

### 3. レスポンシブデザイン
- ブレークポイント
  - モバイル: 〜767px
  - タブレット: 768px〜1023px
  - デスクトップ: 1024px〜
- モバイルファーストアプローチ

## デザインシステム

### 1. カラーパレット
:root {
  /* プライマリカラー（学習環境を意識した落ち着いた青） */
  --color-primary: #2563eb;
  --color-primary-light: #60a5fa;
  --color-primary-dark: #1e40af;

  /* セカンダリカラー（ニュートラルな印象のグレー） */
  --color-secondary: #64748b;
  --color-secondary-light: #94a3b8;
  --color-secondary-dark: #475569;

  /* アクセントカラー（注意喚起やハイライト用） */
  --color-accent: #f59e0b;
  
  /* テキストカラー */
  --color-text: #1f2937;
  --color-text-light: #6b7280;
  
  /* 背景色 */
  --color-background: #ffffff;
  --color-background-alt: #f3f4f6;
  
  /* ステータスカラー */
  --color-success: #10b981; /* 正解時 */
  --color-error: #ef4444;   /* 誤答時 */
  --color-warning: #f59e0b; /* 注意喚起 */
  --color-info: #3b82f6;    /* 情報表示 */
}

### 2. タイポグラフィ
:root {
  /* フォントファミリー */
  --font-family-sans: 'Noto Sans JP', sans-serif;
  --font-family-mono: 'Source Code Pro', monospace; /* 問題文のコード表示用 */
  
  /* フォントサイズ */
  --font-size-xs: 0.75rem;   /* 12px - 補足情報 */
  --font-size-sm: 0.875rem;  /* 14px - 一般テキスト */
  --font-size-base: 1rem;    /* 16px - 基本サイズ */
  --font-size-lg: 1.125rem;  /* 18px - 重要テキスト */
  --font-size-xl: 1.25rem;   /* 20px - 小見出し */
  --font-size-2xl: 1.5rem;   /* 24px - 見出し */
  
  /* 行の高さ */
  --line-height-tight: 1.25;   /* 見出し用 */
  --line-height-normal: 1.5;   /* 一般テキスト用 */
  --line-height-relaxed: 1.75; /* 長文用 */
}

### 3. スペーシング
:root {
  /* 基本スペーシング */
  --spacing-xs: 0.25rem;  /* 4px */
  --spacing-sm: 0.5rem;   /* 8px */
  --spacing-md: 1rem;     /* 16px */
  --spacing-lg: 1.5rem;   /* 24px */
  --spacing-xl: 2rem;     /* 32px */
  
  /* コンポーネント間のマージン */
  --margin-component: var(--spacing-lg);
}

## コンポーネント設計

### 1. 基本コンポーネント
- ボタン（プライマリ、セカンダリ、テキストリンク）
- フォーム要素（入力フィールド、ラジオボタン、チェックボックス）
- カード（問題表示、結果表示）
- モーダル（確認ダイアログ、エラー表示）
- アラート（フィードバック、通知）

### 2. 問題表示コンポーネント
- 問題文エリア
  - 明確な区分け
  - 十分な余白
  - 読みやすいフォントサイズ
- 選択肢エリア
  - クリック/タップしやすいサイズ
  - 選択状態の明確な表示
  - ホバー時の視覚的フィードバック

### 3. フィードバック表示
- 即時フィードバック
  - 正解/不正解の明確な表示
  - アニメーションの適度な使用
- 進捗表示
  - 残り問題数
  - 経過時間
  - スコア

## インタラクション設計

### 1. アニメーション
:root {
  /* トランジション */
  --transition-fast: 150ms;
  --transition-normal: 250ms;
  --transition-slow: 350ms;
  
  /* イージング */
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
}

### 2. ホバー状態
- ボタン：色の変化
- カード：軽いシャドウ効果
- リンク：下線の表示

### 3. フォーカス状態
- キーボードフォーカスの明確な表示
- フォーカスリング
- スキップリンク

## レスポンシブ対応
- モバイル
  - タップターゲットサイズ：最小48px
  - シングルカラムレイアウト
  - スワイプジェスチャー対応
- タブレット
  - 2カラムレイアウト
  - サイドバーナビゲーション
- デスクトップ
  - マルチカラムレイアウト
  - ホバー効果の活用
  - キーボードショートカット
