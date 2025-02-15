import { Database } from 'bun:sqlite'
import { beforeAll, beforeEach, describe, expect, test } from 'bun:test'
import { Hono } from 'hono'

import { MAX_LOGIN_ATTEMPTS } from '../../config'
import { getDatabase } from '../db/schema'
import { UserService } from '../services/users'
import auth from './auth'

describe('Auth Routes', () => {
  const app = new Hono().route('/auth', auth)
  let db: Database
  const userService = UserService.getInstance()

  beforeAll(async () => {
    db = await getDatabase()
    await userService.initDatabase()
  })

  // テストユーザーデータ
  const testUser = {
    email: 'test@example.com',
    password: 'TestPass123!',
    role: 'teacher' as const,
  }

  beforeEach(async () => {
    // テストデータベースのセットアップ
    db.transaction(() => {
      db.query('DELETE FROM users').run()
    })()
  })

  describe('POST /auth/register', () => {
    test('should register a new user successfully', async () => {
      const res = await app.request('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.user.email).toBe(testUser.email)
      expect(data.user.role).toBe(testUser.role)
    })

    test('should reject invalid password format', async () => {
      const res = await app.request('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...testUser,
          password: 'weak',
        }),
      })

      expect(res.status).toBe(400)
      const data = await res.json()
      expect(data.error.message).toContain('Password requirements not met')
    })
  })

  describe('POST /auth/login', () => {
    beforeEach(async () => {
      // テストユーザーの作成
      await app.request('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      })
    })

    test('should login successfully with correct credentials', async () => {
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      })

      expect(res.status).toBe(200)
      const data = await res.json()
      expect(data.token).toBeDefined()
      expect(data.user.email).toBe(testUser.email)
    })

    test('should handle account locking after multiple failed attempts', async () => {
      // First, register a user
      await app.request('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      })

      // Attempt to login with wrong password multiple times
      for (let i = 0; i < MAX_LOGIN_ATTEMPTS; i++) {
        const res = await app.request('/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: testUser.email,
            password: 'WrongPass123!',
          }),
        })
      }

      // One more attempt should lock the account
      const res = await app.request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      })

      expect(res.status).toBe(401)
      const data = await res.json()
      expect(data.error.message).toContain('Account is locked.')
    })
  })

  describe('POST /auth/change-password', () => {
    let authToken: string

    beforeEach(async () => {
      // テストユーザーの作成とログイン
      await app.request('/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      })

      const loginRes = await app.request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: testUser.password,
        }),
      })

      const { token } = await loginRes.json()
      authToken = token
    })

    test('should change password successfully', async () => {
      const res = await app.request('/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          currentPassword: testUser.password,
          newPassword: 'NewPass456!',
        }),
      })

      expect(res.status).toBe(200)

      // 新しいパスワードでログインできることを確認
      const loginRes = await app.request('/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: testUser.email,
          password: 'NewPass456!',
        }),
      })

      expect(loginRes.status).toBe(200)
    })
  })
})
