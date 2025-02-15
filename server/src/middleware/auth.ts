import { Context, Next } from 'hono'

import { HTTPException } from 'hono/http-exception'

import { verifyToken } from '../services/auth'
import { UserService } from '../services/users'

export async function authMiddleware(c: Context, next: Next) {
  const auth = c.req.header('Authorization')
  if (!auth || !auth.startsWith('Bearer ')) {
    throw new HTTPException(401, { message: 'Authentication required' })
  }

  const token = auth.split(' ')[1]
  try {
    const payload = await verifyToken(token)
    const userService = UserService.getInstance()
    await userService.initDatabase()
    const user = await userService.getUserById(payload.userId)
    if (!user) {
      throw new HTTPException(401, { message: 'Invalid token' })
    }
    c.set('user', user)
    await next()
  } catch (error) {
    throw new HTTPException(401, { message: 'Invalid token' })
  }
}
