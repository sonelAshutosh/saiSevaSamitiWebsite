'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Loader2, Megaphone, Edit, Upload, X } from 'lucide-react'
import { getAllCampaigns, createCampaign, updateCampaign, deleteCampaign } from './actions'
import { handleImageUpload } from '@/lib/imageUtils'
import Image from 'next/image'

interface Campaign {
  id: string
  name: string
  description: string
  image: string
  date: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [campaignToDelete, setCampaignToDelete] = useState<Campaign | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit state
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editCampaign, setEditCampaign] = useState<Campaign | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form state for create
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
  })

  // Form state for edit
  const [editFormData, setEditFormData] = useState({
    name: '',
    description: '',
    date: '',
    image: '',
  })

  const [imagePreview, setImagePreview] = useState<string>('')
  const [editImagePreview, setEditImagePreview] = useState<string>('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const fetchCampaigns = async () => {
    setIsLoading(true)
    try {
      const result = await getAllCampaigns()
      if (result.success && result.campaigns) {
        setCampaigns(result.campaigns)
      } else {
        toast.error('Failed to load campaigns', {
          description: result.message || 'An error occurred',
        })
      }
    } catch (error) {
      toast.error('Failed to load campaigns', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCampaigns()
  }, [])

  const handleImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    isEdit: boolean = false
  ) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploadingImage(true)
    try {
      const base64 = await handleImageUpload(file)

      if (isEdit) {
        setEditFormData({ ...editFormData, image: base64 })
        setEditImagePreview(base64)
      } else {
        setFormData({ ...formData, image: base64 })
        setImagePreview(base64)
      }

      toast.success('Image uploaded successfully')
    } catch (error) {
      toast.error('Failed to upload image', {
        description: error instanceof Error ? error.message : 'Please try again',
      })
    } finally {
      setIsUploadingImage(false)
    }
  }

  const removeImage = (isEdit: boolean = false) => {
    if (isEdit) {
      setEditFormData({ ...editFormData, image: '' })
      setEditImagePreview('')
    } else {
      setFormData({ ...formData, image: '' })
      setImagePreview('')
    }
  }

  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      toast.loading('Creating campaign...', { id: 'create-campaign' })

      const result = await createCampaign(formData)

      if (result.success) {
        toast.success('Campaign created successfully', {
          id: 'create-campaign',
          description: `${formData.name} has been added to the system`,
        })

        // Reset form and close sheet
        setFormData({
          name: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          image: '',
        })
        setImagePreview('')
        setIsSheetOpen(false)

        // Refresh campaigns list
        await fetchCampaigns()
      } else {
        toast.error('Failed to create campaign', {
          id: 'create-campaign',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to create campaign', {
        id: 'create-campaign',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRowClick = (campaign: Campaign) => {
    setEditCampaign(campaign)
    setEditFormData({
      name: campaign.name,
      description: campaign.description,
      date: campaign.date
        ? new Date(campaign.date).toISOString().split('T')[0]
        : '',
      image: campaign.image,
    })
    setEditImagePreview(campaign.image)
    setIsEditSheetOpen(true)
  }

  const handleUpdateCampaign = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editCampaign || !editFormData.name || !editFormData.image) {
      toast.error('Name and image are required')
      return
    }

    setIsUpdating(true)
    try {
      toast.loading('Updating campaign...', { id: 'update-campaign' })

      const result = await updateCampaign(editCampaign.id, editFormData)

      if (result.success) {
        toast.success('Campaign updated successfully', {
          id: 'update-campaign',
        })

        // Reset and close
        setEditFormData({
          name: '',
          description: '',
          date: '',
          image: '',
        })
        setEditImagePreview('')
        setIsEditSheetOpen(false)
        setEditCampaign(null)

        // Refresh campaigns list
        await fetchCampaigns()
      } else {
        toast.error('Failed to update campaign', {
          id: 'update-campaign',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to update campaign', {
        id: 'update-campaign',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteClick = (campaign: Campaign) => {
    setCampaignToDelete(campaign)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!campaignToDelete) return

    setIsDeleting(true)
    try {
      toast.loading('Deleting campaign...', { id: 'delete-campaign' })

      const result = await deleteCampaign(campaignToDelete.id)

      if (result.success) {
        toast.success('Campaign deleted successfully', {
          id: 'delete-campaign',
          description: `${campaignToDelete.name} has been removed`,
        })

        await fetchCampaigns()
      } else {
        toast.error('Failed to delete campaign', {
          id: 'delete-campaign',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to delete campaign', {
        id: 'delete-campaign',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setCampaignToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Campaigns Management
          </h1>
          <p className="text-muted-foreground">
            Manage ongoing and past campaigns
          </p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="cursor-pointer" suppressHydrationWarning>
              <Plus className="mr-2 h-4 w-4" />
              Add New Campaign
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Megaphone className="h-6 w-6" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">Create New Campaign</SheetTitle>
                    <SheetDescription className="mt-1">
                      Add a new campaign or initiative
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <form
                onSubmit={handleCreateCampaign}
                className="flex-1 flex flex-col px-6 pt-6"
              >
                <div className="flex-1 space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Campaign Image *
                    </Label>
                    <div className="flex items-center gap-4">
                      {imagePreview ? (
                        <div className="relative">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={120}
                            height={120}
                            className="rounded-lg object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 cursor-pointer"
                            onClick={() => removeImage(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center w-28 h-28 border-2 border-dashed rounded-lg">
                          <Upload className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, false)}
                          disabled={isCreating || isUploadingImage}
                          className="cursor-pointer"
                          required
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Max 5MB. Will be compressed to 50KB.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Campaign Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Tree Plantation Drive 2024"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        disabled={isCreating}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium">
                        Campaign Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) =>
                          setFormData({ ...formData, date: e.target.value })
                        }
                        disabled={isCreating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description" className="text-sm font-medium">
                        Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Describe the campaign objectives, activities, and impact..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        disabled={isCreating}
                        rows={6}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Provide details about the campaign
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 py-6 border-t mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSheetOpen(false)}
                    disabled={isCreating}
                    className="cursor-pointer h-11 text-base sm:flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="cursor-pointer h-11 text-base sm:flex-1"
                    disabled={isCreating || isUploadingImage}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating Campaign...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Create Campaign
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Edit Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Edit className="h-6 w-6" />
                </div>
                <div>
                  <SheetTitle className="text-xl">Edit Campaign</SheetTitle>
                  <SheetDescription className="mt-1">
                    Update campaign information
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <form
              onSubmit={handleUpdateCampaign}
              className="flex-1 flex flex-col px-6 pt-6"
            >
              <div className="flex-1 space-y-6">
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Campaign Image *
                  </Label>
                  <div className="flex items-center gap-4">
                    {editImagePreview ? (
                      <div className="relative">
                        <Image
                          src={editImagePreview}
                          alt="Preview"
                          width={120}
                          height={120}
                          className="rounded-lg object-cover"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6 cursor-pointer"
                          onClick={() => removeImage(true)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center w-28 h-28 border-2 border-dashed rounded-lg">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleImageChange(e, true)}
                        disabled={isUpdating || isUploadingImage}
                        className="cursor-pointer"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Max 5MB. Will be compressed to 50KB.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-medium">
                      Campaign Name *
                    </Label>
                    <Input
                      id="edit-name"
                      placeholder="Tree Plantation Drive 2024"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, name: e.target.value })
                      }
                      disabled={isUpdating}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-date" className="text-sm font-medium">
                      Campaign Date
                    </Label>
                    <Input
                      id="edit-date"
                      type="date"
                      value={editFormData.date}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, date: e.target.value })
                      }
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description" className="text-sm font-medium">
                      Description
                    </Label>
                    <Textarea
                      id="edit-description"
                      placeholder="Describe the campaign objectives, activities, and impact..."
                      value={editFormData.description}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          description: e.target.value,
                        })
                      }
                      disabled={isUpdating}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide details about the campaign
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 py-6 border-t mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditSheetOpen(false)}
                  disabled={isUpdating}
                  className="cursor-pointer h-11 text-base sm:flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="cursor-pointer h-11 text-base sm:flex-1"
                  disabled={isUpdating || isUploadingImage}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating Campaign...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-5 w-5" />
                      Update Campaign
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </SheetContent>
      </Sheet>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">All Campaigns</h2>
          <Badge variant="secondary" className="ml-2">
            {campaigns.length} {campaigns.length === 1 ? 'campaign' : 'campaigns'}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-md border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border bg-card">
            <Megaphone className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No campaigns found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by adding your first campaign
            </p>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow
                    key={campaign.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(campaign)}
                  >
                    <TableCell>
                      <Image
                        src={campaign.image}
                        alt={campaign.name}
                        width={60}
                        height={60}
                        className="rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs">
                      <p className="text-sm text-muted-foreground truncate">
                        {campaign.description || '-'}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(campaign.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(campaign)
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="ml-2 hidden sm:inline">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the campaign{' '}
              <span className="font-semibold">{campaignToDelete?.name}</span>. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Campaign'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
