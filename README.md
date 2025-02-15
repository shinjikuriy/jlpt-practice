# JLPT Practice Application

JLPTの「文字・語彙・文法」分野に特化した練習問題システムです。教師が生徒に対して練習問題をアサインし、学習進捗を管理できます。

## システム概要
JLPTの「文字・語彙・文法」分野に特化した練習問題システム

## 技術仕様
### バックエンド
- ランタイム：Bun
- フレームワーク：Hono
- データベース：SQLite（bun:sqlite）

### フロントエンド
- フレームワーク：Hono + hono-react
- UIライブラリ：最小限（できるだけピュアなHTML/CSSを使用）

## 問題形式
- 4択の択一問題
- 各問題には以下の情報を格納
  - 問題文
  - 解答選択肢（1つの正答と3つの誤答）
  - メタ情報
    - 問題カテゴリ
    - 問題タイプ
    - 出題項目
    - 誤答タイプ

## ユーザー機能
### 共通機能
- ログイン機能
  - メールアドレスとパスワードによる認証

### 教師向け機能
- 生徒の回答閲覧
- 問題作成
- 練習セット作成
- 生徒への練習アサイン

### 生徒向け機能
- アサインされた練習の受講
- 練習問題への回答

## 練習仕様
- 1練習は複数の問題で構成
- 制限時間：60分
- 記録データ
  - 回答内容
  - 回答日時
  - 解答所要時間

## 機能一覧

### メール通知機能 🔔
- ユーザーごとのメール通知設定
  - 練習セットのアサイン通知
  - 期限切れ警告通知
  - システムメンテナンス通知
- 通知頻度の設定
- HTMLメール対応
- 多言語テンプレート対応

## 環境変数

### メール設定
```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
MAIL_FROM=noreply@example.com
```

## 開発環境のセットアップ
（追加予定）

## セットアップ手順

### メール通知のセットアップ
1. `.env`ファイルにSMTP設定を追加
2. メールテンプレートの配置
   ```bash
   cp templates/mail/* src/templates/mail/
   ```
3. メール通知設定の確認
   ```bash
   npm run check-mail-config
   ```

### データベースの再作成
If you need to recreate the database due to schema changes during development, follow these steps:

```bash
# 1. Stop the application

# 2. Delete the database file
rm server/data/db/practice_app.db

# 3. Start the application
# (The database will be automatically created with the new schema)
bun run dev

# 4. Seed initial data (if needed)
bun run setup-db
```

**Important Notes:**
- This operation will delete all data in the database
- Only perform this in development environment
- Make sure to notify team members when database recreation is required

## ライセンス
（追加予定）
