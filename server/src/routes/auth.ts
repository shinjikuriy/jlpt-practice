import { Hono } from 'hono'

import { LOCK_DURATION, MAX_LOGIN_ATTEMPTS } from '../../config'
import { authMiddleware } from '../middleware/auth'
import { generateToken, hashPassword, validatePassword, verifyPassword } from '../services/auth'
import { UserService } from '../services/users'
import { User } from '../types'

const auth = new Hono()
const userService = UserService.getInstance()

// 初期化関数
auth.use('*', async (c, next) => {
  await userService.initDatabase()
  await next()
})

// Middleware
auth.use('/change-password', authMiddleware)

// Error response helper
const errorResponse = (message: string, status: number) => ({
  error: { message },
  status,
})

// Success response helper
const successResponse = (data: Record<string, unknown>) => ({
  ...data,
  status: 200,
})

// Routes
auth.post('/login', async c => {
  const { email, password } = await c.req.json()

  if (!email || !password) {
    return c.json(errorResponse('Email and password are required', 400), 400)
  }

  try {
    const user = await userService.getUserByEmail(email)
    if (!user) {
      return c.json(errorResponse('Invalid credentials', 401), 401)
    }

    if (user.locked_until && new Date(user.locked_until) > new Date()) {
      return c.json(errorResponse('Account is locked. Please try again later', 401), 401)
    }

    const isValid = await verifyPassword(password, user.password_hash)
    if (!isValid) {
      await userService.incrementLoginAttempts(email)

      if (user.login_attempts + 1 >= MAX_LOGIN_ATTEMPTS) {
        const lockedUntil = new Date(Date.now() + LOCK_DURATION)
        await userService.lockAccount(email, lockedUntil)
        return c.json(
          errorResponse('Account has been locked due to too many failed attempts', 401),
          401
        )
      }

      return c.json(errorResponse('Invalid credentials', 401), 401)
    }

    await userService.resetLoginAttempts(email)
    const token = await generateToken({
      id: user.id,
      role: user.role,
    })

    return c.json(
      successResponse({
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      })
    )
  } catch (error) {
    console.error('Login error:', error)
    return c.json(errorResponse('Internal server error', 500), 500)
  }
})

auth.post('/register', async c => {
  try {
    const { email, password, role } = await c.req.json()

    if (!email || !password || !role) {
      return c.json(errorResponse('Email, password and role are required', 400), 400)
    }

    if (!validatePassword(password)) {
      return c.json(errorResponse('Password requirements not met', 400), 400)
    }

    const existingUser = await userService.getUserByEmail(email)
    if (existingUser) {
      return c.json(errorResponse('Email already registered', 409), 409)
    }

    const hashedPassword = await hashPassword(password)
    const user = await userService.createUser({
      email,
      password_hash: hashedPassword,
      role: role as 'teacher' | 'student',
    })

    return c.json(
      successResponse({
        message: 'User registered successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      })
    )
  } catch (error) {
    console.error('Registration error:', error)
    return c.json(errorResponse('Internal server error', 500), 500)
  }
})

auth.post('/change-password', async c => {
  const { currentPassword, newPassword } = await c.req.json()
  const user = c.get('user') as User
  const userId = user.id

  try {
    const user = await userService.getUserById(userId)
    if (!user) {
      return c.json(errorResponse('User not found', 404), 404)
    }

    const isValid = await verifyPassword(currentPassword, user.password_hash)
    if (!isValid) {
      return c.json(errorResponse('Current password is incorrect', 401), 401)
    }

    const hashedPassword = await hashPassword(newPassword)
    await userService.updatePassword(userId, hashedPassword)

    return c.json(successResponse({ message: 'Password updated successfully' }))
  } catch (error) {
    console.error('Password change error:', error)
    return c.json(errorResponse('Internal server error', 500), 500)
  }
})

export default auth
