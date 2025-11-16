'use server'

import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/Users'

interface UserResponse {
  id: string
  name: string
  email: string
  createdAt?: string
}

export async function getAllUsers(): Promise<{
  success: boolean
  users?: UserResponse[]
  message?: string
}> {
  try {
    await dbConnect()

    const users = await User.find({}).sort({ _id: 1 }).lean()

    return {
      success: true,
      users: users.map((user) => ({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        createdAt: user.createdAt?.toString(),
      })),
    }
  } catch (error) {
    console.error('Get all users error:', error)
    return {
      success: false,
      message: 'Failed to fetch users',
    }
  }
}

export async function createUser(
  name: string,
  email: string,
  password: string
): Promise<{
  success: boolean
  message: string
  user?: UserResponse
}> {
  try {
    // Validate input
    if (!name || !email || !password) {
      return {
        success: false,
        message: 'All fields are required',
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

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() })
    if (existingUser) {
      return {
        success: false,
        message: 'User with this email already exists',
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create new user
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
    })

    revalidatePath('/admin/users')

    return {
      success: true,
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    }
  } catch (error) {
    console.error('Create user error:', error)
    return {
      success: false,
      message: 'An error occurred while creating the user',
    }
  }
}

export async function updateUser(
  userId: string,
  name: string,
  password?: string
): Promise<{
  success: boolean
  message: string
  user?: UserResponse
}> {
  try {
    // Validate input
    if (!userId || !name) {
      return {
        success: false,
        message: 'User ID and name are required',
      }
    }

    await dbConnect()

    // Check if user exists
    const user = await User.findById(userId)
    if (!user) {
      return {
        success: false,
        message: 'User not found',
      }
    }

    // Update name
    user.name = name.trim()

    // Update password if provided
    if (password && password.trim()) {
      const hashedPassword = await bcrypt.hash(password, 10)
      user.password = hashedPassword
    }

    await user.save()

    revalidatePath('/admin/users')

    return {
      success: true,
      message: password
        ? 'User updated successfully with new password'
        : 'User updated successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    }
  } catch (error) {
    console.error('Update user error:', error)
    return {
      success: false,
      message: 'An error occurred while updating the user',
    }
  }
}

export async function deleteUser(userId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (!userId) {
      return {
        success: false,
        message: 'User ID is required',
      }
    }

    await dbConnect()

    const deletedUser = await User.findByIdAndDelete(userId)

    if (!deletedUser) {
      return {
        success: false,
        message: 'User not found',
      }
    }

    revalidatePath('/admin/users')

    return {
      success: true,
      message: 'User deleted successfully',
    }
  } catch (error) {
    console.error('Delete user error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the user',
    }
  }
}
