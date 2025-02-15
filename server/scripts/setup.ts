import { mkdir } from 'node:fs/promises'

import { getDatabase } from '../src/db/schema'
import { generateId } from '../src/utils/id'

async function setup() {
  // データディレクトリの作成
  await mkdir('server/data/db', { recursive: true })
  console.log('Directory structure created successfully')

  try {
    const db = await getDatabase()
    console.log('データベースの初期化が完了しました')

    // 初期データの投入（オプション）
    db.transaction(() => {
      db.query(
        `
        INSERT OR IGNORE INTO users (id, email, password_hash, role)
        VALUES (
          ?,
          'admin@example.com',
          '$2b$10$xxxxx',
          'teacher'
        )
      `
      ).run(generateId())
    })()

    console.log('初期データの投入が完了しました')
  } catch (error) {
    console.error('データベースの初期化中にエラーが発生しました: ', error)
    process.exit(1)
  }
}

setup().catch(console.error)
