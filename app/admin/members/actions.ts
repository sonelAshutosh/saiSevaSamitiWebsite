'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import Member from '@/models/Members'

interface MemberResponse {
  id: string
  name: string
  email: string
  phone: string
  image?: string
  joiningDate?: string
  designation?: string
  fbURL?: string
  instaURL?: string
  twitterURL?: string
  linkedinURL?: string
  isActive: boolean
  priority: number
}

export async function getAllMembers(): Promise<{
  success: boolean
  members?: MemberResponse[]
  message?: string
}> {
  try {
    await dbConnect()

    const members = await Member.find({}).sort({ priority: 1, _id: 1 }).lean()

    return {
      success: true,
      members: members.map((member) => ({
        id: member._id.toString(),
        name: member.name,
        email: member.email,
        phone: member.phone,
        image: member.image,
        joiningDate: member.joiningDate?.toString(),
        designation: member.designation,
        fbURL: member.fbURL,
        instaURL: member.instaURL,
        twitterURL: member.twitterURL,
        linkedinURL: member.linkedinURL,
        isActive: member.isActive,
        priority: member.priority,
      })),
    }
  } catch (error) {
    console.error('Get all members error:', error)
    return {
      success: false,
      message: 'Failed to fetch members',
    }
  }
}

export async function createMember(data: {
  name: string
  email: string
  phone: string
  image?: string
  designation?: string
  fbURL?: string
  instaURL?: string
  twitterURL?: string
  linkedinURL?: string
  isActive?: boolean
  priority?: number
}): Promise<{
  success: boolean
  message: string
  member?: MemberResponse
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

    // Check if member with email already exists
    const existingMember = await Member.findOne({
      email: data.email.toLowerCase(),
    })
    if (existingMember) {
      return {
        success: false,
        message: 'Member with this email already exists',
      }
    }

    // Create new member
    const newMember = await Member.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      image: data.image || '',
      designation: data.designation?.trim() || '',
      fbURL: data.fbURL?.trim() || '',
      instaURL: data.instaURL?.trim() || '',
      twitterURL: data.twitterURL?.trim() || '',
      linkedinURL: data.linkedinURL?.trim() || '',
      isActive: data.isActive ?? true,
      priority: data.priority || 1000,
    })

    revalidatePath('/admin/members')

    return {
      success: true,
      message: 'Member created successfully',
      member: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone,
        image: newMember.image,
        designation: newMember.designation,
        fbURL: newMember.fbURL,
        instaURL: newMember.instaURL,
        twitterURL: newMember.twitterURL,
        linkedinURL: newMember.linkedinURL,
        isActive: newMember.isActive,
        priority: newMember.priority,
      },
    }
  } catch (error) {
    console.error('Create member error:', error)
    return {
      success: false,
      message: 'An error occurred while creating the member',
    }
  }
}

export async function updateMember(
  memberId: string,
  data: {
    name: string
    phone: string
    image?: string
    designation?: string
    fbURL?: string
    instaURL?: string
    twitterURL?: string
    linkedinURL?: string
    isActive?: boolean
    priority?: number
  }
): Promise<{
  success: boolean
  message: string
  member?: MemberResponse
}> {
  try {
    // Validate input
    if (!memberId || !data.name || !data.phone) {
      return {
        success: false,
        message: 'Member ID, name, and phone are required',
      }
    }

    await dbConnect()

    // Find and update member
    const member = await Member.findById(memberId)
    if (!member) {
      return {
        success: false,
        message: 'Member not found',
      }
    }

    // Update fields
    member.name = data.name.trim()
    member.phone = data.phone.trim()
    if (data.image !== undefined) member.image = data.image
    if (data.designation !== undefined)
      member.designation = data.designation.trim()
    if (data.fbURL !== undefined) member.fbURL = data.fbURL.trim()
    if (data.instaURL !== undefined) member.instaURL = data.instaURL.trim()
    if (data.twitterURL !== undefined)
      member.twitterURL = data.twitterURL.trim()
    if (data.linkedinURL !== undefined)
      member.linkedinURL = data.linkedinURL.trim()
    if (data.isActive !== undefined) member.isActive = data.isActive
    if (data.priority !== undefined) member.priority = data.priority

    await member.save()

    revalidatePath('/admin/members')

    return {
      success: true,
      message: 'Member updated successfully',
      member: {
        id: member.id,
        name: member.name,
        email: member.email,
        phone: member.phone,
        image: member.image,
        designation: member.designation,
        fbURL: member.fbURL,
        instaURL: member.instaURL,
        twitterURL: member.twitterURL,
        linkedinURL: member.linkedinURL,
        isActive: member.isActive,
        priority: member.priority,
      },
    }
  } catch (error) {
    console.error('Update member error:', error)
    return {
      success: false,
      message: 'An error occurred while updating the member',
    }
  }
}

export async function deleteMember(memberId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (!memberId) {
      return {
        success: false,
        message: 'Member ID is required',
      }
    }

    await dbConnect()

    const deletedMember = await Member.findByIdAndDelete(memberId)

    if (!deletedMember) {
      return {
        success: false,
        message: 'Member not found',
      }
    }

    revalidatePath('/admin/members')

    return {
      success: true,
      message: 'Member deleted successfully',
    }
  } catch (error) {
    console.error('Delete member error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the member',
    }
  }
}
