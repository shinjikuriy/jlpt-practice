import { Database } from "bun:sqlite";
import { join } from "node:path";

// データベースのパスを設定
const DB_PATH = join(__dirname, "jlpt_practice.db");

async function setup() {
  const db = new Database(DB_PATH);

  // トランザクション開始
  db.run("BEGIN TRANSACTION");

  try {
    // ユーザーテーブルの作成
    db.run(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 問題テーブルの作成
    db.run(`
      CREATE TABLE IF NOT EXISTS questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT NOT NULL,
        category TEXT NOT NULL,
        question_text TEXT NOT NULL,
        correct_answer TEXT NOT NULL,
        explanation TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // 選択肢テーブルの作成
    db.run(`
      CREATE TABLE IF NOT EXISTS choices (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER NOT NULL,
        choice_text TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        FOREIGN KEY (question_id) REFERENCES questions(id)
      )
    `);

    // 学習履歴テーブルの作成
    db.run(`
      CREATE TABLE IF NOT EXISTS study_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        question_id INTEGER NOT NULL,
        is_correct BOOLEAN NOT NULL,
        answered_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (question_id) REFERENCES questions(id)
      )
    `);

    // トランザクションのコミット
    db.run("COMMIT");
    console.log(`データベースを作成しました: ${DB_PATH}`);
  } catch (error) {
    // エラー時はロールバック
    db.run("ROLLBACK");
    console.error("データベースの初期化に失敗しました:", error);
    throw error;
  } finally {
    // データベース接続のクローズ
    db.close();
  }
}

setup().catch(console.error);