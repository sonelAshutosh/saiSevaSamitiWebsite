'use server'

import { revalidatePath } from 'next/cache'
import dbConnect from '@/lib/dbConnect'
import Campaign from '@/models/Campaigns'

interface CampaignResponse {
  id: string
  name: string
  description: string
  image: string
  date: string
}

export async function getAllCampaigns(): Promise<{
  success: boolean
  campaigns?: CampaignResponse[]
  message?: string
}> {
  try {
    await dbConnect()

    const campaigns = await Campaign.find({}).sort({ date: -1 }).lean()

    return {
      success: true,
      campaigns: campaigns.map((campaign) => ({
        id: campaign._id.toString(),
        name: campaign.name,
        description: campaign.description,
        image: campaign.image,
        date: campaign.date.toString(),
      })),
    }
  } catch (error) {
    console.error('Get all campaigns error:', error)
    return {
      success: false,
      message: 'Failed to fetch campaigns',
    }
  }
}

export async function getCampaignById(campaignId: string): Promise<{
  success: boolean
  campaign?: CampaignResponse
  message?: string
}> {
  try {
    await dbConnect()

    const campaign = await Campaign.findById(campaignId).lean()

    if (!campaign) {
      return {
        success: false,
        message: 'Campaign not found',
      }
    }

    return {
      success: true,
      campaign: {
        id: campaign._id.toString(),
        name: campaign.name,
        description: campaign.description,
        image: campaign.image,
        date: campaign.date.toString(),
      },
    }
  } catch (error) {
    console.error('Get campaign by ID error:', error)
    return {
      success: false,
      message: 'Failed to fetch campaign',
    }
  }
}

export async function createCampaign(data: {
  name: string
  description: string
  image: string
  date: string
}): Promise<{
  success: boolean
  message: string
  campaign?: CampaignResponse
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

    // Create new campaign
    const newCampaign = await Campaign.create({
      name: data.name.trim(),
      description: data.description?.trim() || '',
      image: data.image,
      date: data.date ? new Date(data.date) : new Date(),
    })

    revalidatePath('/admin/campaigns')
    revalidatePath('/') // Revalidate homepage

    return {
      success: true,
      message: 'Campaign created successfully',
      campaign: {
        id: newCampaign.id,
        name: newCampaign.name,
        description: newCampaign.description,
        image: newCampaign.image,
        date: newCampaign.date.toString(),
      },
    }
  } catch (error) {
    console.error('Create campaign error:', error)
    return {
      success: false,
      message: 'An error occurred while creating the campaign',
    }
  }
}

export async function updateCampaign(
  campaignId: string,
  data: {
    name: string
    description: string
    image: string
    date: string
  }
): Promise<{
  success: boolean
  message: string
  campaign?: CampaignResponse
}> {
  try {
    // Validate input
    if (!campaignId || !data.name || !data.image) {
      return {
        success: false,
        message: 'Campaign ID, name, and image are required',
      }
    }

    await dbConnect()

    // Find and update campaign
    const campaign = await Campaign.findById(campaignId)
    if (!campaign) {
      return {
        success: false,
        message: 'Campaign not found',
      }
    }

    // Update fields
    campaign.name = data.name.trim()
    campaign.description = data.description?.trim() || ''
    campaign.image = data.image
    campaign.date = data.date ? new Date(data.date) : campaign.date

    await campaign.save()

    revalidatePath('/admin/campaigns')
    revalidatePath('/') // Revalidate homepage

    return {
      success: true,
      message: 'Campaign updated successfully',
      campaign: {
        id: campaign.id,
        name: campaign.name,
        description: campaign.description,
        image: campaign.image,
        date: campaign.date.toString(),
      },
    }
  } catch (error) {
    console.error('Update campaign error:', error)
    return {
      success: false,
      message: 'An error occurred while updating the campaign',
    }
  }
}

export async function deleteCampaign(campaignId: string): Promise<{
  success: boolean
  message: string
}> {
  try {
    if (!campaignId) {
      return {
        success: false,
        message: 'Campaign ID is required',
      }
    }

    await dbConnect()

    const deletedCampaign = await Campaign.findByIdAndDelete(campaignId)

    if (!deletedCampaign) {
      return {
        success: false,
        message: 'Campaign not found',
      }
    }

    revalidatePath('/admin/campaigns')
    revalidatePath('/') // Revalidate homepage

    return {
      success: true,
      message: 'Campaign deleted successfully',
    }
  } catch (error) {
    console.error('Delete campaign error:', error)
    return {
      success: false,
      message: 'An error occurred while deleting the campaign',
    }
  }
}
