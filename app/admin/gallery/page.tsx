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
import { Plus, Trash2, Loader2, ImageIcon, Edit, Upload, X } from 'lucide-react'
import { getAllGalleryImages, createGalleryImage, updateGalleryImage, deleteGalleryImage } from './actions'
import { handleImageUpload } from '@/lib/imageUtils'
import Image from 'next/image'

interface GalleryImage {
  id: string
  imgTitle: string
  description: string
  image: string
  date: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<GalleryImage | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit state
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editImage, setEditImage] = useState<GalleryImage | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form state for create
  const [formData, setFormData] = useState({
    imgTitle: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    image: '',
  })

  // Form state for edit
  const [editFormData, setEditFormData] = useState({
    imgTitle: '',
    description: '',
    date: '',
    image: '',
  })

  const [imagePreview, setImagePreview] = useState<string>('')
  const [editImagePreview, setEditImagePreview] = useState<string>('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const fetchImages = async () => {
    setIsLoading(true)
    try {
      const result = await getAllGalleryImages()
      if (result.success && result.images) {
        setImages(result.images)
      } else {
        toast.error('Failed to load gallery images', {
          description: result.message || 'An error occurred',
        })
      }
    } catch (error) {
      toast.error('Failed to load gallery images', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
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

  const handleCreateImage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.imgTitle || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      toast.loading('Adding image to gallery...', { id: 'create-image' })

      const result = await createGalleryImage(formData)

      if (result.success) {
        toast.success('Image added to gallery successfully', {
          id: 'create-image',
          description: `${formData.imgTitle} has been added`,
        })

        // Reset form and close sheet
        setFormData({
          imgTitle: '',
          description: '',
          date: new Date().toISOString().split('T')[0],
          image: '',
        })
        setImagePreview('')
        setIsSheetOpen(false)

        // Refresh images list
        await fetchImages()
      } else {
        toast.error('Failed to add image', {
          id: 'create-image',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to add image', {
        id: 'create-image',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRowClick = (image: GalleryImage) => {
    setEditImage(image)
    setEditFormData({
      imgTitle: image.imgTitle,
      description: image.description,
      date: image.date
        ? new Date(image.date).toISOString().split('T')[0]
        : '',
      image: image.image,
    })
    setEditImagePreview(image.image)
    setIsEditSheetOpen(true)
  }

  const handleUpdateImage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editImage || !editFormData.imgTitle || !editFormData.image) {
      toast.error('Title and image are required')
      return
    }

    setIsUpdating(true)
    try {
      toast.loading('Updating image...', { id: 'update-image' })

      const result = await updateGalleryImage(editImage.id, editFormData)

      if (result.success) {
        toast.success('Image updated successfully', {
          id: 'update-image',
        })

        // Reset and close
        setEditFormData({
          imgTitle: '',
          description: '',
          date: '',
          image: '',
        })
        setEditImagePreview('')
        setIsEditSheetOpen(false)
        setEditImage(null)

        // Refresh images list
        await fetchImages()
      } else {
        toast.error('Failed to update image', {
          id: 'update-image',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to update image', {
        id: 'update-image',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteClick = (image: GalleryImage) => {
    setImageToDelete(image)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!imageToDelete) return

    setIsDeleting(true)
    try {
      toast.loading('Deleting image...', { id: 'delete-image' })

      const result = await deleteGalleryImage(imageToDelete.id)

      if (result.success) {
        toast.success('Image deleted successfully', {
          id: 'delete-image',
          description: `${imageToDelete.imgTitle} has been removed`,
        })

        await fetchImages()
      } else {
        toast.error('Failed to delete image', {
          id: 'delete-image',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to delete image', {
        id: 'delete-image',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setImageToDelete(null)
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
            Gallery Management
          </h1>
          <p className="text-muted-foreground">
            Manage images and media content
          </p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="cursor-pointer" suppressHydrationWarning>
              <Plus className="mr-2 h-4 w-4" />
              Add New Image
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <ImageIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">Add New Image</SheetTitle>
                    <SheetDescription className="mt-1">
                      Add a new image to the gallery
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <form
                onSubmit={handleCreateImage}
                className="flex-1 flex flex-col px-6 pt-6"
              >
                <div className="flex-1 space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Image *
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
                      <Label htmlFor="imgTitle" className="text-sm font-medium">
                        Image Title *
                      </Label>
                      <Input
                        id="imgTitle"
                        placeholder="Community Service Event 2024"
                        value={formData.imgTitle}
                        onChange={(e) =>
                          setFormData({ ...formData, imgTitle: e.target.value })
                        }
                        disabled={isCreating}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="date" className="text-sm font-medium">
                        Date
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
                        placeholder="Describe the image or event captured..."
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        disabled={isCreating}
                        rows={5}
                        className="resize-none"
                      />
                      <p className="text-xs text-muted-foreground">
                        Provide details about the image
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
                        Adding Image...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Add Image
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
                  <SheetTitle className="text-xl">Edit Image</SheetTitle>
                  <SheetDescription className="mt-1">
                    Update image information
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <form
              onSubmit={handleUpdateImage}
              className="flex-1 flex flex-col px-6 pt-6"
            >
              <div className="flex-1 space-y-6">
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Image *
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
                    <Label htmlFor="edit-imgTitle" className="text-sm font-medium">
                      Image Title *
                    </Label>
                    <Input
                      id="edit-imgTitle"
                      placeholder="Community Service Event 2024"
                      value={editFormData.imgTitle}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, imgTitle: e.target.value })
                      }
                      disabled={isUpdating}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-date" className="text-sm font-medium">
                      Date
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
                      placeholder="Describe the image or event captured..."
                      value={editFormData.description}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          description: e.target.value,
                        })
                      }
                      disabled={isUpdating}
                      rows={5}
                      className="resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide details about the image
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
                      Updating Image...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-5 w-5" />
                      Update Image
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
          <ImageIcon className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Gallery Images</h2>
          <Badge variant="secondary" className="ml-2">
            {images.length} {images.length === 1 ? 'image' : 'images'}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-md border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : images.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border bg-card">
            <ImageIcon className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No images found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by adding your first image to the gallery
            </p>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead className="hidden md:table-cell">Description</TableHead>
                  <TableHead className="hidden sm:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {images.map((image) => (
                  <TableRow
                    key={image.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(image)}
                  >
                    <TableCell>
                      <Image
                        src={image.image}
                        alt={image.imgTitle}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{image.imgTitle}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-xs">
                      <p className="text-sm text-muted-foreground truncate">
                        {image.description || '-'}
                      </p>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {formatDate(image.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(image)
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
              This will permanently delete the image{' '}
              <span className="font-semibold">{imageToDelete?.imgTitle}</span>. This
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
                'Delete Image'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
