import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { join } from 'path'

import { getDatabase } from '../db/schema'
import { generateId } from '../services/base'
import { QuestionCSV } from '../types'

console.log('開発用データの投入を開始します...')

try {
  const db = getDatabase()

  // CSVファイルの読み込み
  const questionsFile = readFileSync(join(import.meta.dir, '../../data/questions.csv'), 'utf-8')

  const questions = parse(questionsFile, {
    columns: true,
    skip_empty_lines: true,
  }) as QuestionCSV[]

  db.transaction(() => {
    // 既存データのクリア
    db.query('DELETE FROM questions').run()

    // CSVからのデータ投入
    for (const q of questions) {
      const options = [q.option1, q.option2, q.option3, q.option4]

      db.query(
        `
        INSERT INTO questions (
          id,
          category,
          level,
          question,
          options,
          correct_index,
          explanation
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `
      ).run(
        generateId(),
        q.category,
        parseInt(q.level, 10),
        q.question,
        JSON.stringify(options),
        parseInt(q.correct_index, 10),
        q.explanation || null
      )
    }
  })()

  console.log(`${questions.length}件の問題データを投入しました`)
} catch (error) {
  console.error('データ投入中にエラーが発生しました:', error)
  process.exit(1)
}
