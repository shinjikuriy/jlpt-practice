import { Database } from 'bun:sqlite'

import { Answer, Practice, Question, User } from '../types'

export function setupDatabase(db: Database): void {
  // トランザクションで全てのテーブルを作成
  db.transaction(() => {
    // ユーザーテーブル
    db.query(
      `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      role TEXT CHECK(role IN ('teacher', 'student')) NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
    ).run()

    // 問題テーブル
    db.query(
      `CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      category TEXT CHECK(category IN ('kanji', 'vocab', 'grammar')) NOT NULL,
      level INTEGER NOT NULL,
      question TEXT NOT NULL,
      options TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      explanation TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`
    ).run()

    // インデックスを追加
    db.query(`CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category)`).run()
    db.query(`CREATE INDEX IF NOT EXISTS idx_questions_level ON questions(level)`).run()

    // 練習セッションテーブル
    db.query(
      `CREATE TABLE IF NOT EXISTS practices (
      id TEXT PRIMARY KEY,
      student_id TEXT NOT NULL,
      question_ids TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      is_completed BOOLEAN NOT NULL DEFAULT 0,
      FOREIGN KEY (student_id) REFERENCES users(id)
    )`
    ).run()

    // 解答履歴テーブル
    db.query(
      `CREATE TABLE IF NOT EXISTS answers (
      id TEXT PRIMARY KEY,
      practice_id TEXT NOT NULL,
      question_id TEXT NOT NULL,
      selected_choice INTEGER NOT NULL,
      is_correct BOOLEAN NOT NULL,
      answered_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (practice_id) REFERENCES practices(id),
      FOREIGN KEY (question_id) REFERENCES questions(id)
    )`
    ).run()

    // インデックスの作成
    db.query(`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`).run()
    db.query(`CREATE INDEX IF NOT EXISTS idx_practices_student ON practices(student_id)`).run()
    db.query(`CREATE INDEX IF NOT EXISTS idx_answers_practice ON answers(practice_id)`).run()
  })()
}

// データベース接続のシングルトンインスタンス
let db: Database | null = null

export function getDatabase(): Database {
  if (!db) {
    db = new Database('practice_app.db')
    setupDatabase(db)
  }
  return db
}
