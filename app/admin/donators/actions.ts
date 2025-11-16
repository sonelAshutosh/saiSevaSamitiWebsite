'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import Donators from '@/models/Donators'

interface DonatorResponse {
  id: string
  name: string
  email: string
  phone?: string
  amount: number
  paymentMode?: string
  transactionId: string
  date: string
  isVerified: boolean
}

export async function getAllDonators(): Promise<{
  success: boolean
  donators?: DonatorResponse[]
  message?: string
}> {
  try {
    await dbConnect()

    const donators = await Donators.find({}).sort({ date: -1 }).lean()

    return {
      success: true,
      donators: donators.map((donator) => ({
        id: donator._id.toString(),
        name: donator.name,
        email: donator.email,
        phone: donator.phone,
        amount: donator.amount,
        paymentMode: donator.paymentMode,
        transactionId: donator.transactionId,
        date: donator.date.toString(),
        isVerified: donator.isVerified,
      })),
    }
  } catch (error) {
    console.error('Get all donators error:', error)
    return {
      success: false,
      message: 'Failed to fetch donators',
    }
  }
}

export async function createDonator(data: {
  name: string
  email: string
  phone?: string
  amount: number
  paymentMode?: string
  transactionId: string
  date: string
  isVerified?: boolean
}): Promise<{
  success: boolean
  message: string
  donator?: DonatorResponse
}> {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.amount || !data.transactionId) {
      return {
        success: false,
        message: 'Name, email, amount, and transaction ID are required',
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: 'Invalid email address',
      }
    }

    // Amount validation
    if (data.amount <= 0) {
      return {
        success: false,
        message: 'Amount must be greater than zero',
      }
    }

    await dbConnect()

    // Create new donator
    const newDonator = await Donators.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone?.trim() || '',
      amount: data.amount,
      paymentMode: data.paymentMode?.trim() || '',
      transactionId: data.transactionId.trim(),
      date: data.date ? new Date(data.date) : new Date(),
      isVerified: data.isVerified ?? false,
    })

    revalidatePath('/admin/donators')
    revalidatePath('/donate')

    return {
      success: true,
      message: 'Donator created successfully',
      donator: {
        id: newDonator.id,
        name: newDonator.name,
        email: newDonator.email,
        phone: newDonator.phone,
        amount: newDonator.amount,
        paymentMode: newDonator.paymentMode,
        transactionId: newDonator.transactionId,
        date: newDonator.date.toString(),
        isVerified: newDonator.isVerified,
      },
    }
  } catch (error) {
    console.error('Create donator error:', error)
    return {
      success: false,
      message: 'An error occurred while creating the donator',
    }
  }
}

export async function updateDonator(
  donatorId: string,
  data: {
    name: string
    email: string
    phone?: string
    amount: number
    paymentMode?: string
    transactionId: string
    date: string
    isVerified?: boolean
  }
): Promise<{
  success: boolean
  message: string
  donator?: DonatorResponse
}> {
  try {
    // Validate input
    if (!donatorId || !data.name || !data.email || !data.amount || !data.transactionId) {
      return {
        success: false,
        message: 'All required fields must be provided',
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      return {
        success: false,
        message: 'Invalid email address',
      }
    }

    // Amount validation
    if (data.amount <= 0) {
      return {
        success: false,
        message: 'Amount must be greater than zero',
      }
    }

    await dbConnect()

    // Find and update donator
    const donator = await Donators.findById(donatorId)
    if (!donator) {
      return {
        success: false,
        message: 'Donator not found',
      }
    }

    // Update fields
    donator.name = data.name.trim()
    donator.email = data.email.toLowerCase().trim()
    donator.phone = data.phone?.trim() || ''
    donator.amount = data.amount
    donator.paymentMode = data.paymentMode?.trim() || ''
    donator.transactionId = data.transactionId.trim()
    donator.date = data.date ? new Date(data.date) : donator.date
    if (data.isVerified !== undefined) donator.isVerified = data.isVerified

    await donator.save()

    revalidatePath('/admin/donators')
    revalidatePath('/donate')

    return {
      success: true,
      message: 'Donator updated successfully',
      donator: {
        id: donator.id,
        name: donator.name,
        email: donator.email,
        phone: donator.phone,
        amount: donator.amount,
        paymentMode: donator.paymentMode,
        transactionId: donator.transactionId,
        date: donator.date.toString(),
        isVerified: donator.isVerified,
      },
    }
  } catch (error) {
    console.error('Update donator error:', error)
    return {
      success: false,
      message: 'An error occurred while updating the donator',
    }
  }
}

export async function deleteDonator(donatorId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (!donatorId) {
      return {
        success: false,
        message: 'Donator ID is required',
      }
    }

    await dbConnect()

    const deletedDonator = await Donators.findByIdAndDelete(donatorId)

    if (!deletedDonator) {
      return {
        success: false,
        message: 'Donator not found',
      }
    }

    revalidatePath('/admin/donators')
    revalidatePath('/donate')

    return {
      success: true,
      message: 'Donator deleted successfully',
    }
  } catch (error) {
    console.error('Delete donator error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the donator',
    }
  }
}
