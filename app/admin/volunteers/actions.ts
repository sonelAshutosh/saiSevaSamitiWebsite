'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import Volunteer from '@/models/Volunteers'

interface VolunteerResponse {
  id: string
  name: string
  email: string
  phone: string
  role?: string
  joiningDate?: string
  image?: string
  dateOfBirth?: string
  fbURL?: string
  instaURL?: string
  twitterURL?: string
  linkedinURL?: string
  showInList: boolean
  isActive: boolean
}

export async function getAllVolunteers(): Promise<{
  success: boolean
  volunteers?: VolunteerResponse[]
  message?: string
}> {
  try {
    await dbConnect()

    const volunteers = await Volunteer.find({}).sort({ _id: 1 }).lean()

    return {
      success: true,
      volunteers: volunteers.map((volunteer) => ({
        id: volunteer._id.toString(),
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        role: volunteer.role,
        joiningDate: volunteer.joiningDate?.toString(),
        image: volunteer.image,
        dateOfBirth: volunteer.dateOfBirth?.toString(),
        fbURL: volunteer.fbURL,
        instaURL: volunteer.instaURL,
        twitterURL: volunteer.twitterURL,
        linkedinURL: volunteer.linkedinURL,
        showInList: volunteer.showInList,
        isActive: volunteer.isActive,
      })),
    }
  } catch (error) {
    console.error('Get all volunteers error:', error)
    return {
      success: false,
      message: 'Failed to fetch volunteers',
    }
  }
}

export async function getVolunteersPaginated(
  page: number = 1,
  limit: number = 4,
  activeOnly: boolean = true,
  showInListOnly: boolean = true
): Promise<{
  success: boolean
  volunteers?: VolunteerResponse[]
  totalCount?: number
  totalPages?: number
  currentPage?: number
  message?: string
}> {
  try {
    await dbConnect()

    const skip = (page - 1) * limit
    const query: { isActive?: boolean; showInList?: boolean } = {}
    if (activeOnly) query.isActive = true
    if (showInListOnly) query.showInList = true

    const [volunteers, totalCount] = await Promise.all([
      Volunteer.find(query).sort({ _id: 1 }).skip(skip).limit(limit).lean(),
      Volunteer.countDocuments(query),
    ])

    return {
      success: true,
      volunteers: volunteers.map((volunteer) => ({
        id: volunteer._id.toString(),
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        role: volunteer.role,
        joiningDate: volunteer.joiningDate?.toString(),
        image: volunteer.image,
        dateOfBirth: volunteer.dateOfBirth?.toString(),
        fbURL: volunteer.fbURL,
        instaURL: volunteer.instaURL,
        twitterURL: volunteer.twitterURL,
        linkedinURL: volunteer.linkedinURL,
        showInList: volunteer.showInList,
        isActive: volunteer.isActive,
      })),
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    }
  } catch (error) {
    console.error('Get paginated volunteers error:', error)
    return {
      success: false,
      message: 'Failed to fetch volunteers',
    }
  }
}

export async function createVolunteer(data: {
  name: string
  email: string
  phone: string
  role?: string
  image?: string
  dateOfBirth?: string
  fbURL?: string
  instaURL?: string
  twitterURL?: string
  linkedinURL?: string
  showInList?: boolean
  isActive?: boolean
}): Promise<{
  success: boolean
  message: string
  volunteer?: VolunteerResponse
}> {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.phone) {
      return {
        success: false,
        message: 'Name, email, and phone are required',
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

    await dbConnect()

    // Check if volunteer with email already exists
    const existingVolunteer = await Volunteer.findOne({
      email: data.email.toLowerCase(),
    })
    if (existingVolunteer) {
      return {
        success: false,
        message: 'Volunteer with this email already exists',
      }
    }

    // Create new volunteer
    const newVolunteer = await Volunteer.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      role: data.role?.trim() || '',
      image: data.image || '',
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
      fbURL: data.fbURL?.trim() || '',
      instaURL: data.instaURL?.trim() || '',
      twitterURL: data.twitterURL?.trim() || '',
      linkedinURL: data.linkedinURL?.trim() || '',
      showInList: data.showInList ?? true,
      isActive: data.isActive ?? true,
    })

    revalidatePath('/admin/volunteers')
    revalidatePath('/about-us') // Revalidate about us page

    return {
      success: true,
      message: 'Volunteer created successfully',
      volunteer: {
        id: newVolunteer.id,
        name: newVolunteer.name,
        email: newVolunteer.email,
        phone: newVolunteer.phone,
        role: newVolunteer.role,
        joiningDate: newVolunteer.joiningDate?.toString(),
        image: newVolunteer.image,
        dateOfBirth: newVolunteer.dateOfBirth?.toString(),
        fbURL: newVolunteer.fbURL,
        instaURL: newVolunteer.instaURL,
        twitterURL: newVolunteer.twitterURL,
        linkedinURL: newVolunteer.linkedinURL,
        showInList: newVolunteer.showInList,
        isActive: newVolunteer.isActive,
      },
    }
  } catch (error) {
    console.error('Create volunteer error:', error)
    return {
      success: false,
      message: 'An error occurred while creating the volunteer',
    }
  }
}

export async function updateVolunteer(
  volunteerId: string,
  data: {
    name: string
    phone: string
    role?: string
    image?: string
    dateOfBirth?: string
    fbURL?: string
    instaURL?: string
    twitterURL?: string
    linkedinURL?: string
    showInList?: boolean
    isActive?: boolean
  }
): Promise<{
  success: boolean
  message: string
  volunteer?: VolunteerResponse
}> {
  try {
    // Validate input
    if (!volunteerId || !data.name || !data.phone) {
      return {
        success: false,
        message: 'Volunteer ID, name, and phone are required',
      }
    }

    await dbConnect()

    // Find and update volunteer
    const volunteer = await Volunteer.findById(volunteerId)
    if (!volunteer) {
      return {
        success: false,
        message: 'Volunteer not found',
      }
    }

    // Update fields
    volunteer.name = data.name.trim()
    volunteer.phone = data.phone.trim()
    if (data.role !== undefined) volunteer.role = data.role.trim()
    if (data.image !== undefined) volunteer.image = data.image
    if (data.dateOfBirth !== undefined)
      volunteer.dateOfBirth = data.dateOfBirth
        ? new Date(data.dateOfBirth)
        : undefined
    if (data.fbURL !== undefined) volunteer.fbURL = data.fbURL.trim()
    if (data.instaURL !== undefined) volunteer.instaURL = data.instaURL.trim()
    if (data.twitterURL !== undefined)
      volunteer.twitterURL = data.twitterURL.trim()
    if (data.linkedinURL !== undefined)
      volunteer.linkedinURL = data.linkedinURL.trim()
    if (data.showInList !== undefined) volunteer.showInList = data.showInList
    if (data.isActive !== undefined) volunteer.isActive = data.isActive

    await volunteer.save()

    revalidatePath('/admin/volunteers')
    revalidatePath('/about-us') // Revalidate about us page

    return {
      success: true,
      message: 'Volunteer updated successfully',
      volunteer: {
        id: volunteer.id,
        name: volunteer.name,
        email: volunteer.email,
        phone: volunteer.phone,
        role: volunteer.role,
        joiningDate: volunteer.joiningDate?.toString(),
        image: volunteer.image,
        dateOfBirth: volunteer.dateOfBirth?.toString(),
        fbURL: volunteer.fbURL,
        instaURL: volunteer.instaURL,
        twitterURL: volunteer.twitterURL,
        linkedinURL: volunteer.linkedinURL,
        showInList: volunteer.showInList,
        isActive: volunteer.isActive,
      },
    }
  } catch (error) {
    console.error('Update volunteer error:', error)
    return {
      success: false,
      message: 'An error occurred while updating the volunteer',
    }
  }
}

export async function deleteVolunteer(volunteerId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (!volunteerId) {
      return {
        success: false,
        message: 'Volunteer ID is required',
      }
    }

    await dbConnect()

    const deletedVolunteer = await Volunteer.findByIdAndDelete(volunteerId)

    if (!deletedVolunteer) {
      return {
        success: false,
        message: 'Volunteer not found',
      }
    }

    revalidatePath('/admin/volunteers')
    revalidatePath('/about-us') // Revalidate about us page

    return {
      success: true,
      message: 'Volunteer deleted successfully',
    }
  } catch (error) {
    console.error('Delete volunteer error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the volunteer',
    }
  }
}
