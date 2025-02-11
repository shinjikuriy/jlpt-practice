import { getDatabase } from '../db/schema'
import { generateId } from '../services/base'
import { Practice } from '../types'

export class PracticeService {
  private db = getDatabase()

  async createPractice(data: Omit<Practice, 'id' | 'created_at'>): Promise<Practice> {
    const id = generateId()
    const now = new Date().toISOString()

    const practice = {
      id,
      ...data,
      created_at: now,
    }

    this.db
      .query(
        `
      INSERT INTO practices (
        id, student_id, question_ids, start_time, 
        end_time, is_completed, created_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `
      )
      .run(
        practice.id,
        practice.student_id,
        JSON.stringify(practice.question_ids),
        practice.start_time,
        practice.end_time,
        practice.is_completed,
        practice.created_at
      )

    return practice
  }
}
