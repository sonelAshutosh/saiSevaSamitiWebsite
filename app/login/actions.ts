'use server'

import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/Users'

interface LoginResult {
  success: boolean
  message: string
  user?: {
    id: string
    name: string
    email: string
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResult> {
  try {
    // Validate input
    if (!email || !password) {
      return {
        success: false,
        message: 'Email and password are required',
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return {
        success: false,
        message: 'Invalid email address',
      }
    }

    // Connect to database
    await dbConnect()

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() })

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Invalid email or password',
      }
    }

    // Get JWT secret
    const jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET
    if (!jwtSecret) {
      console.error('JWT_ACCESS_TOKEN_SECRET is not defined')
      return {
        success: false,
        message: 'Server configuration error',
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
      },
      jwtSecret,
      {
        expiresIn: '7d', // Token expires in 7 days
      }
    )

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    return {
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again.',
    }
  }
}

export async function logoutUser(): Promise<{ success: boolean }> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('auth-token')

    return {
      success: true,
    }
  } catch (error) {
    console.error('Logout error:', error)
    return {
      success: false,
    }
  }
}

export async function getCurrentUser(): Promise<{
  success: boolean
  user?: {
    id: string
    name: string
    email: string
  }
}> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')

    if (!token) {
      return {
        success: false,
      }
    }

    const jwtSecret = process.env.JWT_ACCESS_TOKEN_SECRET
    if (!jwtSecret) {
      return {
        success: false,
      }
    }

    const decoded = jwt.verify(token.value, jwtSecret) as {
      userId: string
      email: string
      name: string
    }

    return {
      success: true,
      user: {
        id: decoded.userId,
        name: decoded.name,
        email: decoded.email,
      },
    }
  } catch (error) {
    console.error('Get current user error:', error)
    return {
      success: false,
    }
  }
}
