import { getDatabase } from '../db/schema'
import { generateId } from '../services/base'

console.log('データベースの初期化を開始します...')

try {
  const db = getDatabase()
  console.log('データベースの初期化が完了しました')

  // 初期データの投入（オプション）
  db.transaction(() => {
    // 管理者ユーザーの作成
    db.query(
      `
      INSERT OR IGNORE INTO users (id, email, password_hash, role)
      VALUES (
        ?,
        'admin@example.com',
        '$2b$10$xxxxx', -- 実際のハッシュ値に置き換え
        'teacher'
      )
    `
    ).run(generateId())
  })()

  console.log('初期データの投入が完了しました')
} catch (error) {
  console.error('データベースの初期化中にエラーが発生しました:', error)
  process.exit(1)
}
