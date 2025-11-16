'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import ContactUs from '@/models/ContactUs'

interface ContactUsResponse {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
}

export async function getAllContactSubmissions(): Promise<{
  success: boolean
  submissions?: ContactUsResponse[]
  message?: string
}> {
  try {
    await dbConnect()

    const submissions = await ContactUs.find({}).sort({ date: -1 }).lean()

    return {
      success: true,
      submissions: submissions.map((submission) => ({
        id: submission._id.toString(),
        name: submission.name,
        email: submission.email,
        subject: submission.subject,
        message: submission.message,
        date: submission.date.toString(),
      })),
    }
  } catch (error) {
    console.error('Get all contact submissions error:', error)
    return {
      success: false,
      message: 'Failed to fetch contact submissions',
    }
  }
}

export async function createContactSubmission(data: {
  name: string
  email: string
  subject: string
  message: string
  date: string
}): Promise<{
  success: boolean
  message: string
  submission?: ContactUsResponse
}> {
  try {
    // Validate required fields
    if (!data.name || !data.email || !data.subject || !data.message) {
      return {
        success: false,
        message: 'All fields are required',
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

    // Create new contact submission
    const newSubmission = await ContactUs.create({
      name: data.name.trim(),
      email: data.email.toLowerCase().trim(),
      subject: data.subject.trim(),
      message: data.message.trim(),
      date: data.date ? new Date(data.date) : new Date(),
    })

    revalidatePath('/admin/contact-us')

    return {
      success: true,
      message: 'Contact submission created successfully',
      submission: {
        id: newSubmission.id,
        name: newSubmission.name,
        email: newSubmission.email,
        subject: newSubmission.subject,
        message: newSubmission.message,
        date: newSubmission.date.toString(),
      },
    }
  } catch (error) {
    console.error('Create contact submission error:', error)
    return {
      success: false,
      message: 'An error occurred while creating the contact submission',
    }
  }
}

export async function updateContactSubmission(
  submissionId: string,
  data: {
    name: string
    email: string
    subject: string
    message: string
    date: string
  }
): Promise<{
  success: boolean
  message: string
  submission?: ContactUsResponse
}> {
  try {
    // Validate input
    if (
      !submissionId ||
      !data.name ||
      !data.email ||
      !data.subject ||
      !data.message
    ) {
      return {
        success: false,
        message: 'All fields are required',
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

    // Find and update contact submission
    const submission = await ContactUs.findById(submissionId)
    if (!submission) {
      return {
        success: false,
        message: 'Contact submission not found',
      }
    }

    // Update fields
    submission.name = data.name.trim()
    submission.email = data.email.toLowerCase().trim()
    submission.subject = data.subject.trim()
    submission.message = data.message.trim()
    submission.date = data.date ? new Date(data.date) : submission.date

    await submission.save()

    revalidatePath('/admin/contact-us')

    return {
      success: true,
      message: 'Contact submission updated successfully',
      submission: {
        id: submission.id,
        name: submission.name,
        email: submission.email,
        subject: submission.subject,
        message: submission.message,
        date: submission.date.toString(),
      },
    }
  } catch (error) {
    console.error('Update contact submission error:', error)
    return {
      success: false,
      message: 'An error occurred while updating the contact submission',
    }
  }
}

export async function deleteContactSubmission(submissionId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (!submissionId) {
      return {
        success: false,
        message: 'Submission ID is required',
      }
    }

    await dbConnect()

    const deletedSubmission = await ContactUs.findByIdAndDelete(submissionId)

    if (!deletedSubmission) {
      return {
        success: false,
        message: 'Contact submission not found',
      }
    }

    revalidatePath('/admin/contact-us')

    return {
      success: true,
      message: 'Contact submission deleted successfully',
    }
  } catch (error) {
    console.error('Delete contact submission error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the contact submission',
    }
  }
}
