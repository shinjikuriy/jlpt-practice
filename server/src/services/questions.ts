import { Database } from 'bun:sqlite'

import { getDatabase } from '../db/schema'
import { Question } from '../types'
import { generateId } from '../utils/id'

export class QuestionService {
  private db!: Database
  private initialized = false

  private async init() {
    if (!this.initialized) {
      this.db = await getDatabase()
      this.initialized = true
    }
  }

  private async ensureInitialized() {
    await this.init()
  }

  async getQuestions(params: {
    category?: string
    level?: number
    limit?: number
    offset?: number
  }): Promise<Question[]> {
    await this.ensureInitialized()
    const { category, level, limit = 10, offset = 0 } = params

    let query = 'SELECT * FROM questions'
    const conditions: string[] = []
    const values: any[] = []

    if (category) {
      conditions.push('category = ?')
      values.push(category)
    }

    if (level) {
      conditions.push('level = ?')
      values.push(level)
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }

    query += ' LIMIT ? OFFSET ?'
    values.push(limit, offset)

    const result = this.db.query(query).all(...values) as any[]

    return result.map(row => ({
      ...row,
      options: JSON.parse(row.options),
    }))
  }

  async getQuestionById(id: string): Promise<Question | null> {
    await this.ensureInitialized()
    const result = this.db.query('SELECT * FROM questions WHERE id = ?').get(id) as any

    if (!result) return null

    return {
      ...result,
      options: JSON.parse(result.options),
    }
  }

  async createQuestion(data: Omit<Question, 'id' | 'created_at'>): Promise<Question> {
    await this.ensureInitialized()
    const id = generateId()
    const now = new Date().toISOString()

    const question = {
      id,
      ...data,
      created_at: now,
    }

    this.db
      .query(
        `
      INSERT INTO questions (
        id, category, level, question, options, 
        correct_index, explanation, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        question.id,
        question.category,
        question.level,
        question.question,
        JSON.stringify(question.options),
        question.correct_index,
        question.explanation,
        question.created_at
      )

    return question
  }
}
