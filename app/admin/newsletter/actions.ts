'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import NewsLetter from '@/models/NewsLetter'

interface NewsLetterResponse {
  id: string
  email: string
}

export async function getAllNewsLetterSubscriptions(): Promise<{
  success: boolean
  subscriptions?: NewsLetterResponse[]
  message?: string
}> {
  try {
    await dbConnect()

    const subscriptions = await NewsLetter.find({}).sort({ _id: -1 }).lean()

    return {
      success: true,
      subscriptions: subscriptions.map((subscription) => ({
        id: subscription._id.toString(),
        email: subscription.email,
      })),
    }
  } catch (error) {
    console.error('Get all NewsLetter subscriptions error:', error)
    return {
      success: false,
      message: 'Failed to fetch NewsLetter subscriptions',
    }
  }
}

export async function deleteNewsLetterSubscription(
  subscriptionId: string
): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (!subscriptionId) {
      return {
        success: false,
        message: 'Subscription ID is required',
      }
    }

    await dbConnect()

    const deletedSubscription = await NewsLetter.findByIdAndDelete(
      subscriptionId
    )

    if (!deletedSubscription) {
      return {
        success: false,
        message: 'NewsLetter subscription not found',
      }
    }

    revalidatePath('/admin/NewsLetter')

    return {
      success: true,
      message: 'NewsLetter subscription deleted successfully',
    }
  } catch (error) {
    console.error('Delete NewsLetter subscription error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the subscription',
    }
  }
}
