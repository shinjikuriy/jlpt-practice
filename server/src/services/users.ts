import { getDatabase } from '../db/schema'
import { generateId } from '../services/base'
import { User } from '../types'

export class UserService {
  private db = getDatabase()

  async createUser(data: Omit<User, 'id' | 'created_at'>): Promise<User> {
    const id = generateId()
    const now = new Date().toISOString()

    const user = {
      id,
      ...data,
      created_at: now,
    }

    this.db
      .query(
        `
      INSERT INTO users (id, email, password_hash, role, created_at)
      VALUES (?, ?, ?, ?, ?)
    `
      )
      .run(user.id, user.email, user.password_hash, user.role, user.created_at)

    return user
  }
}
