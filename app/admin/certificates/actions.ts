'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import Certificate from '@/models/Certificates'

interface CertificateResponse {
  id: string
  name: string
  issuedBy: string
  image: string
}

export async function getAllCertificates(): Promise<{
  success: boolean
  certificates?: CertificateResponse[]
  message?: string
}> {
  try {
    await dbConnect()

    const certificates = await Certificate.find({}).sort({ _id: -1 }).lean()

    return {
      success: true,
      certificates: certificates.map((certificate) => ({
        id: certificate._id.toString(),
        name: certificate.name,
        issuedBy: certificate.issuedBy,
        image: certificate.image,
      })),
    }
  } catch (error) {
    console.error('Get all certificates error:', error)
    return {
      success: false,
      message: 'Failed to fetch certificates',
    }
  }
}

export async function createCertificate(data: {
  name: string
  issuedBy: string
  image: string
}): Promise<{
  success: boolean
  message: string
  certificate?: CertificateResponse
}> {
  try {
    // Validate required fields
    if (!data.name || !data.image) {
      return {
        success: false,
        message: 'Name and image are required',
      }
    }

    await dbConnect()

    // Create new certificate
    const newCertificate = await Certificate.create({
      name: data.name.trim(),
      issuedBy: data.issuedBy?.trim() || '',
      image: data.image,
    })

    revalidatePath('/admin/certificates')

    return {
      success: true,
      message: 'Certificate created successfully',
      certificate: {
        id: newCertificate.id,
        name: newCertificate.name,
        issuedBy: newCertificate.issuedBy,
        image: newCertificate.image,
      },
    }
  } catch (error) {
    console.error('Create certificate error:', error)
    return {
      success: false,
      message: 'An error occurred while creating the certificate',
    }
  }
}

export async function updateCertificate(
  certificateId: string,
  data: {
    name: string
    issuedBy: string
    image: string
  }
): Promise<{
  success: boolean
  message: string
  certificate?: CertificateResponse
}> {
  try {
    // Validate input
    if (!certificateId || !data.name || !data.image) {
      return {
        success: false,
        message: 'Certificate ID, name, and image are required',
      }
    }

    await dbConnect()

    // Find and update certificate
    const certificate = await Certificate.findById(certificateId)
    if (!certificate) {
      return {
        success: false,
        message: 'Certificate not found',
      }
    }

    // Update fields
    certificate.name = data.name.trim()
    certificate.issuedBy = data.issuedBy?.trim() || ''
    certificate.image = data.image

    await certificate.save()

    revalidatePath('/admin/certificates')

    return {
      success: true,
      message: 'Certificate updated successfully',
      certificate: {
        id: certificate.id,
        name: certificate.name,
        issuedBy: certificate.issuedBy,
        image: certificate.image,
      },
    }
  } catch (error) {
    console.error('Update certificate error:', error)
    return {
      success: false,
      message: 'An error occurred while updating the certificate',
    }
  }
}

export async function deleteCertificate(certificateId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (!certificateId) {
      return {
        success: false,
        message: 'Certificate ID is required',
      }
    }

    await dbConnect()

    const deletedCertificate = await Certificate.findByIdAndDelete(certificateId)

    if (!deletedCertificate) {
      return {
        success: false,
        message: 'Certificate not found',
      }
    }

    revalidatePath('/admin/certificates')

    return {
      success: true,
      message: 'Certificate deleted successfully',
    }
  } catch (error) {
    console.error('Delete certificate error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the certificate',
    }
  }
}
