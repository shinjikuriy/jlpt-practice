import { parse } from 'csv-parse/sync'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'

import { getDatabase } from '../src/db/schema'
import { QuestionCSV } from '../src/types'
import { generateId } from '../src/utils/id'

async function seedDb() {
  console.log('開発用データの投入を開始します...')
  try {
    const db = await getDatabase()

    // CSVファイルの読み込み
    const questionsFile = readFileSync(
      join(dirname(new URL(import.meta.url).pathname), '../data/questions.csv'),
      'utf-8'
    )

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
}

seedDb().catch(console.error)
