'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import ActivitiesNumber from '@/models/ActivitiesNumber'

interface ActivitiesNumberResponse {
  id: string
  happyPeople: number
  offices: number
  staff: number
  volunteers: number
}

export async function getActivitiesNumber(): Promise<{
  success: boolean
  data?: ActivitiesNumberResponse
  message?: string
}> {
  try {
    await dbConnect()

    // Get the first (and should be only) activities number record
    let activitiesNumber = await ActivitiesNumber.findOne({}).lean()

    // If no record exists, create one with default values
    if (!activitiesNumber) {
      await ActivitiesNumber.create({
        happyPeople: 0,
        offices: 0,
        staff: 0,
        volunteers: 0,
      })
      // Fetch the newly created record as a lean object
      activitiesNumber = await ActivitiesNumber.findOne({}).lean()
    }

    if (!activitiesNumber) {
      return {
        success: false,
        message: 'Failed to create activities numbers',
      }
    }

    return {
      success: true,
      data: {
        id: activitiesNumber._id.toString(),
        happyPeople: activitiesNumber.happyPeople,
        offices: activitiesNumber.offices,
        staff: activitiesNumber.staff,
        volunteers: activitiesNumber.volunteers,
      },
    }
  } catch (error) {
    console.error('Get activities number error:', error)
    return {
      success: false,
      message: 'Failed to fetch activities numbers',
    }
  }
}

export async function updateActivitiesNumber(data: {
  happyPeople: number
  offices: number
  staff: number
  volunteers: number
}): Promise<{
  success: boolean
  message: string
  data?: ActivitiesNumberResponse
}> {
  try {
    // Validate input - all must be non-negative numbers
    if (
      data.happyPeople < 0 ||
      data.offices < 0 ||
      data.staff < 0 ||
      data.volunteers < 0
    ) {
      return {
        success: false,
        message: 'All numbers must be non-negative',
      }
    }

    await dbConnect()

    // Get the first record or create if doesn't exist
    let activitiesNumber = await ActivitiesNumber.findOne({})

    if (!activitiesNumber) {
      // Create new record
      activitiesNumber = await ActivitiesNumber.create({
        happyPeople: data.happyPeople,
        offices: data.offices,
        staff: data.staff,
        volunteers: data.volunteers,
      })
    } else {
      // Update existing record
      activitiesNumber.happyPeople = data.happyPeople
      activitiesNumber.offices = data.offices
      activitiesNumber.staff = data.staff
      activitiesNumber.volunteers = data.volunteers
      await activitiesNumber.save()
    }

    revalidatePath('/admin/activities-number')
    revalidatePath('/') // Revalidate homepage

    return {
      success: true,
      message: 'Activities numbers updated successfully',
      data: {
        id: activitiesNumber.id,
        happyPeople: activitiesNumber.happyPeople,
        offices: activitiesNumber.offices,
        staff: activitiesNumber.staff,
        volunteers: activitiesNumber.volunteers,
      },
    }
  } catch (error) {
    console.error('Update activities number error:', error)
    return {
      success: false,
      message: 'An error occurred while updating activities numbers',
    }
  }
}
