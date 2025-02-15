import { sign, verify } from 'hono/jwt'

// Password validation constants
const PASSWORD_MIN_LENGTH = 8
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/

// JWT configuration
export const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const TOKEN_EXPIRES_IN = 15 * 60 // 15 minutes in seconds

export interface TokenPayload {
  userId: string
  role: 'teacher' | 'student'
  exp: number
  [key: string]: string | number | boolean | null
}

// Validate password against security requirements
export function validatePassword(password: string): boolean {
  return password.length >= PASSWORD_MIN_LENGTH && PASSWORD_REGEX.test(password)
}

// Hash password using bcrypt (Bun built-in)
export async function hashPassword(password: string): Promise<string> {
  if (!validatePassword(password)) {
    throw new Error('Password requirements not met')
  }
  return await Bun.password.hash(password)
}

// Verify password against stored hash
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await Bun.password.verify(password, hash)
}

// Generate JWT token for authenticated user
export async function generateToken(user: {
  id: string
  role: 'teacher' | 'student'
}): Promise<string> {
  const payload: TokenPayload = {
    userId: user.id,
    role: user.role,
    exp: Math.floor(Date.now() / 1000) + TOKEN_EXPIRES_IN, // 現在時刻 + 15分
  }

  return await sign(payload, JWT_SECRET)
}

// Verify and decode JWT token
export async function verifyToken(token: string): Promise<TokenPayload> {
  try {
    const payload = await verify(token, JWT_SECRET)
    return payload as unknown as TokenPayload
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('expired')) {
      throw new Error('Token expired')
    }
    throw new Error('Invalid token')
  }
}
