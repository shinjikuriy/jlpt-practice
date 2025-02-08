# エラー仕様

## エラーレスポンス形式
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": {} // 追加情報（オプション）
  }
}
```

### エラーコード一覧
| コード | HTTPステータス | 説明 |
|--------|---------------|------|
| AUTH_REQUIRED | 401 | 認証が必要 |
| INVALID_CREDENTIALS | 401 | 認証情報が無効 |
| FORBIDDEN | 403 | アクセス権限なし |
| NOT_FOUND | 404 | リソースが存在しない |
| VALIDATION_ERROR | 400 | リクエストデータが不正 |
| INTERNAL_ERROR | 500 | サーバー内部エラー |
| ROLE_REQUIRED | 403 | 必要な役割（教師/生徒）がない |
| SESSION_EXPIRED | 401 | 練習セッションが期限切れ |
| PRACTICE_NOT_ASSIGNED | 403 | アサインされていない練習 |
| TIME_LIMIT_EXCEEDED | 400 | 制限時間超過 |
| INVALID_QUESTION_FORMAT | 400 | 問題フォーマットが不正 |
| DUPLICATE_ASSIGNMENT | 400 | 重複する練習アサイン |

## 機能別エラー
### 認証関連
- AUTH_REQUIRED: ログインが必要な操作
- INVALID_CREDENTIALS: メールアドレスまたはパスワードが不正

### 教師機能
- ROLE_REQUIRED: 教師権限が必要な操作
- INVALID_QUESTION_FORMAT: 問題作成時のフォーマットエラー
- DUPLICATE_ASSIGNMENT: 同一生徒への重複アサイン

### 生徒機能
- PRACTICE_NOT_ASSIGNED: 未アサインの練習へのアクセス
- SESSION_EXPIRED: 練習セッション期限切れ
- TIME_LIMIT_EXCEEDED: 制限時間（60分）超過

## クライアントエラー表示
### 表示方式
- バリデーションエラー：フォーム項目直下に赤文字で表示
- システムエラー：画面上部にトースト通知
- 致命的エラー：エラーページに遷移

### エラーメッセージ指針
- 具体的な対処方法を含める
- 技術的な詳細は非表示
- 日本語で分かりやすく表示