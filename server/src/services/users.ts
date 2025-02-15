import { Database } from 'bun:sqlite'

import { getDatabase } from '../db/schema'
import { generateId } from '../services/base'
import { User } from '../types'

export class UserService {
  private static instance: UserService
  private db!: Database
  private initialized = false

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  public async initDatabase() {
    if (!this.initialized) {
      this.db = await getDatabase()
      this.initialized = true
    }
  }

  private handleDatabaseError(error: unknown, operation: string): never {
    console.error(`Database error during ${operation}:`, error)
    throw new Error(`Failed to ${operation}`)
  }

  async createUser(
    data: Omit<User, 'id' | 'created_at' | 'login_attempts' | 'last_attempt_time' | 'locked_until'>
  ): Promise<User> {
    try {
      const id = generateId()
      const now = new Date().toISOString()

      const user: User = {
        id,
        ...data,
        created_at: now,
        login_attempts: 0,
        last_attempt_time: null,
        locked_until: null,
      }

      this.db
        .query(
          `
          INSERT INTO users (
            id, email, password_hash, role, created_at,
            login_attempts, last_attempt_time, locked_until
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `
        )
        .run(
          user.id,
          user.email,
          user.password_hash,
          user.role,
          user.created_at,
          user.login_attempts,
          user.last_attempt_time,
          user.locked_until
        )

      return user
    } catch (error) {
      this.handleDatabaseError(error, 'create user')
    }
  }

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return this.db.query('SELECT * FROM users WHERE email = ?').get(email) as User | null
    } catch (error) {
      this.handleDatabaseError(error, 'get user by email')
    }
  }

  async getUserById(id: string): Promise<User | null> {
    try {
      return this.db.query('SELECT * FROM users WHERE id = ?').get(id) as User | null
    } catch (error) {
      this.handleDatabaseError(error, 'get user by id')
    }
  }

  async incrementLoginAttempts(email: string): Promise<void> {
    try {
      this.db
        .query(
          `
          UPDATE users 
          SET login_attempts = login_attempts + 1,
              last_attempt_time = ?
          WHERE email = ?
        `
        )
        .run(new Date().toISOString(), email)
    } catch (error) {
      this.handleDatabaseError(error, 'increment login attempts')
    }
  }

  async resetLoginAttempts(email: string): Promise<void> {
    try {
      this.db
        .query(
          `
          UPDATE users 
          SET login_attempts = 0,
              last_attempt_time = NULL,
              locked_until = NULL
          WHERE email = ?
        `
        )
        .run(email)
    } catch (error) {
      this.handleDatabaseError(error, 'reset login attempts')
    }
  }

  async lockAccount(email: string, lockedUntil: Date): Promise<void> {
    try {
      this.db
        .query(
          `
          UPDATE users 
          SET locked_until = ?,
              login_attempts = 0,
              last_attempt_time = NULL
          WHERE email = ?
        `
        )
        .run(lockedUntil.toISOString(), email)
    } catch (error) {
      this.handleDatabaseError(error, 'lock account')
    }
  }

  async updatePassword(userId: string, newPasswordHash: string): Promise<void> {
    try {
      this.db
        .query(
          `
          UPDATE users 
          SET password_hash = ?
          WHERE id = ?
        `
        )
        .run(newPasswordHash, userId)
    } catch (error) {
      this.handleDatabaseError(error, 'update password')
    }
  }
}
