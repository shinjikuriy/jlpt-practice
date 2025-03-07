# セキュリティ仕様

## 認証・認可
### 認証方式
- メールアドレス/パスワード認証
- パスワード要件
  - 最小8文字
  - 英数字混在
  - 特殊文字推奨
- セッション管理
  - トークン有効期限：15分
  - アイドルタイムアウト：60分

### 権限管理
- ロールベースアクセス制御（RBAC）
  - 管理者：全機能
  - 教師：問題作成、練習アサイン、進捗確認
  - 生徒：練習実施、自身の進捗確認

## データ保護
### 個人情報保護
- パスワード：bcryptによるハッシュ化
- メールアドレス：暗号化保存
- 学習データ：ユーザーIDによる分離

### データベースセキュリティ
- SQLiteアクセス制限
  - ファイルパーミッション設定
  - プリペアドステートメントの使用
  - バックアップの暗号化

## 通信セキュリティ
### API通信
- 全エンドポイントをHTTPS対応
- クロスオリジン制限
- リクエスト制限
  - レート制限：60リクエスト/分
  - ペイロードサイズ制限：1MB

### 入力検証
- XSS対策
  - HTMLエスケープ処理
  - CSPヘッダー設定
- CSRF対策
  - トークン検証
  - SameSite Cookie設定

### メールセキュリティ
- SMTPサーバー認証
- メール送信制限
  - 送信頻度制限
  - 送信先ドメイン制限
- センシティブ情報の暗号化

## 監視・監査
### セキュリティログ
- 認証試行
- 権限変更
- データアクセス
- エラー発生

### インシデント対応
- 不正アクセス検知
- アカウントロック（5回失敗）
- セッション強制終了
- 管理者通知

## 開発・運用セキュリティ
### 開発環境
- 本番環境との分離
- テストデータの匿名化
- 依存パッケージの脆弱性チェック

### 運用管理
- 定期的なセキュリティアップデート
- アクセス権限の定期レビュー
- インシデント報告体制
