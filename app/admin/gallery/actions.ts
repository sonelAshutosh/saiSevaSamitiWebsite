'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import Gallery from '@/models/Gallery'

interface GalleryResponse {
  id: string
  imgTitle: string
  description: string
  image: string
  date: string
}

export async function getAllGalleryImages(): Promise<{
  success: boolean
  images?: GalleryResponse[]
  message?: string
}> {
  try {
    await dbConnect()

    const images = await Gallery.find({}).sort({ date: -1 }).lean()

    return {
      success: true,
      images: images.map((image) => ({
        id: image._id.toString(),
        imgTitle: image.imgTitle,
        description: image.description,
        image: image.image,
        date: image.date.toString(),
      })),
    }
  } catch (error) {
    console.error('Get all gallery images error:', error)
    return {
      success: false,
      message: 'Failed to fetch gallery images',
    }
  }
}

export async function createGalleryImage(data: {
  imgTitle: string
  description: string
  image: string
  date: string
}): Promise<{
  success: boolean
  message: string
  image?: GalleryResponse
}> {
  try {
    // Validate required fields
    if (!data.imgTitle || !data.image) {
      return {
        success: false,
        message: 'Title and image are required',
      }
    }

    await dbConnect()

    // Create new gallery image
    const newImage = await Gallery.create({
      imgTitle: data.imgTitle.trim(),
      description: data.description?.trim() || '',
      image: data.image,
      date: data.date ? new Date(data.date) : new Date(),
    })

    revalidatePath('/admin/gallery')

    return {
      success: true,
      message: 'Gallery image created successfully',
      image: {
        id: newImage.id,
        imgTitle: newImage.imgTitle,
        description: newImage.description,
        image: newImage.image,
        date: newImage.date.toString(),
      },
    }
  } catch (error) {
    console.error('Create gallery image error:', error)
    return {
      success: false,
      message: 'An error occurred while creating the gallery image',
    }
  }
}

export async function updateGalleryImage(
  imageId: string,
  data: {
    imgTitle: string
    description: string
    image: string
    date: string
  }
): Promise<{
  success: boolean
  message: string
  image?: GalleryResponse
}> {
  try {
    // Validate input
    if (!imageId || !data.imgTitle || !data.image) {
      return {
        success: false,
        message: 'Image ID, title, and image are required',
      }
    }

    await dbConnect()

    // Find and update gallery image
    const image = await Gallery.findById(imageId)
    if (!image) {
      return {
        success: false,
        message: 'Gallery image not found',
      }
    }

    // Update fields
    image.imgTitle = data.imgTitle.trim()
    image.description = data.description?.trim() || ''
    image.image = data.image
    image.date = data.date ? new Date(data.date) : image.date

    await image.save()

    revalidatePath('/admin/gallery')

    return {
      success: true,
      message: 'Gallery image updated successfully',
      image: {
        id: image.id,
        imgTitle: image.imgTitle,
        description: image.description,
        image: image.image,
        date: image.date.toString(),
      },
    }
  } catch (error) {
    console.error('Update gallery image error:', error)
    return {
      success: false,
      message: 'An error occurred while updating the gallery image',
    }
  }
}

export async function deleteGalleryImage(imageId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (!imageId) {
      return {
        success: false,
        message: 'Image ID is required',
      }
    }

    await dbConnect()

    const deletedImage = await Gallery.findByIdAndDelete(imageId)

    if (!deletedImage) {
      return {
        success: false,
        message: 'Gallery image not found',
      }
    }

    revalidatePath('/admin/gallery')

    return {
      success: true,
      message: 'Gallery image deleted successfully',
    }
  } catch (error) {
    console.error('Delete gallery image error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the gallery image',
    }
  }
}
