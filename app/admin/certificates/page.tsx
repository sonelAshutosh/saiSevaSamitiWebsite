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
import { Badge } from '@/components/ui/badge'
import { Plus, Trash2, Loader2, Award, Edit, Upload, X } from 'lucide-react'
import { getAllCertificates, createCertificate, updateCertificate, deleteCertificate } from './actions'
import { handleImageUpload } from '@/lib/imageUtils'
import Image from 'next/image'

interface Certificate {
  id: string
  name: string
  issuedBy: string
  image: string
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [certificateToDelete, setCertificateToDelete] = useState<Certificate | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit state
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editCertificate, setEditCertificate] = useState<Certificate | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form state for create
  const [formData, setFormData] = useState({
    name: '',
    issuedBy: '',
    image: '',
  })

  // Form state for edit
  const [editFormData, setEditFormData] = useState({
    name: '',
    issuedBy: '',
    image: '',
  })

  const [imagePreview, setImagePreview] = useState<string>('')
  const [editImagePreview, setEditImagePreview] = useState<string>('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const fetchCertificates = async () => {
    setIsLoading(true)
    try {
      const result = await getAllCertificates()
      if (result.success && result.certificates) {
        setCertificates(result.certificates)
      } else {
        toast.error('Failed to load certificates', {
          description: result.message || 'An error occurred',
        })
      }
    } catch (error) {
      toast.error('Failed to load certificates', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
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

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.image) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      toast.loading('Creating certificate...', { id: 'create-certificate' })

      const result = await createCertificate(formData)

      if (result.success) {
        toast.success('Certificate created successfully', {
          id: 'create-certificate',
          description: `${formData.name} has been added to the system`,
        })

        // Reset form and close sheet
        setFormData({
          name: '',
          issuedBy: '',
          image: '',
        })
        setImagePreview('')
        setIsSheetOpen(false)

        // Refresh certificates list
        await fetchCertificates()
      } else {
        toast.error('Failed to create certificate', {
          id: 'create-certificate',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to create certificate', {
        id: 'create-certificate',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRowClick = (certificate: Certificate) => {
    setEditCertificate(certificate)
    setEditFormData({
      name: certificate.name,
      issuedBy: certificate.issuedBy,
      image: certificate.image,
    })
    setEditImagePreview(certificate.image)
    setIsEditSheetOpen(true)
  }

  const handleUpdateCertificate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editCertificate || !editFormData.name || !editFormData.image) {
      toast.error('Name and image are required')
      return
    }

    setIsUpdating(true)
    try {
      toast.loading('Updating certificate...', { id: 'update-certificate' })

      const result = await updateCertificate(editCertificate.id, editFormData)

      if (result.success) {
        toast.success('Certificate updated successfully', {
          id: 'update-certificate',
        })

        // Reset and close
        setEditFormData({
          name: '',
          issuedBy: '',
          image: '',
        })
        setEditImagePreview('')
        setIsEditSheetOpen(false)
        setEditCertificate(null)

        // Refresh certificates list
        await fetchCertificates()
      } else {
        toast.error('Failed to update certificate', {
          id: 'update-certificate',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to update certificate', {
        id: 'update-certificate',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteClick = (certificate: Certificate) => {
    setCertificateToDelete(certificate)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!certificateToDelete) return

    setIsDeleting(true)
    try {
      toast.loading('Deleting certificate...', { id: 'delete-certificate' })

      const result = await deleteCertificate(certificateToDelete.id)

      if (result.success) {
        toast.success('Certificate deleted successfully', {
          id: 'delete-certificate',
          description: `${certificateToDelete.name} has been removed`,
        })

        await fetchCertificates()
      } else {
        toast.error('Failed to delete certificate', {
          id: 'delete-certificate',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to delete certificate', {
        id: 'delete-certificate',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setCertificateToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Certificates Management
          </h1>
          <p className="text-muted-foreground">
            Manage certificates and awards received
          </p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="cursor-pointer" suppressHydrationWarning>
              <Plus className="mr-2 h-4 w-4" />
              Add New Certificate
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">Create New Certificate</SheetTitle>
                    <SheetDescription className="mt-1">
                      Add a new certificate or award
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <form
                onSubmit={handleCreateCertificate}
                className="flex-1 flex flex-col px-6 pt-6"
              >
                <div className="flex-1 space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Certificate Image *
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
                        Certificate Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="Excellence in Community Service 2024"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        disabled={isCreating}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="issuedBy" className="text-sm font-medium">
                        Issued By
                      </Label>
                      <Input
                        id="issuedBy"
                        placeholder="State Government / Organization Name"
                        value={formData.issuedBy}
                        onChange={(e) =>
                          setFormData({ ...formData, issuedBy: e.target.value })
                        }
                        disabled={isCreating}
                      />
                      <p className="text-xs text-muted-foreground">
                        Organization or authority that issued the certificate
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
                        Creating Certificate...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Create Certificate
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
                  <SheetTitle className="text-xl">Edit Certificate</SheetTitle>
                  <SheetDescription className="mt-1">
                    Update certificate information
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <form
              onSubmit={handleUpdateCertificate}
              className="flex-1 flex flex-col px-6 pt-6"
            >
              <div className="flex-1 space-y-6">
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Certificate Image *
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
                      Certificate Name *
                    </Label>
                    <Input
                      id="edit-name"
                      placeholder="Excellence in Community Service 2024"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, name: e.target.value })
                      }
                      disabled={isUpdating}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-issuedBy" className="text-sm font-medium">
                      Issued By
                    </Label>
                    <Input
                      id="edit-issuedBy"
                      placeholder="State Government / Organization Name"
                      value={editFormData.issuedBy}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, issuedBy: e.target.value })
                      }
                      disabled={isUpdating}
                    />
                    <p className="text-xs text-muted-foreground">
                      Organization or authority that issued the certificate
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
                      Updating Certificate...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-5 w-5" />
                      Update Certificate
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
          <Award className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">All Certificates</h2>
          <Badge variant="secondary" className="ml-2">
            {certificates.length} {certificates.length === 1 ? 'certificate' : 'certificates'}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-md border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : certificates.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border bg-card">
            <Award className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No certificates found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by adding your first certificate
            </p>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Certificate Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Issued By</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certificates.map((certificate) => (
                  <TableRow
                    key={certificate.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(certificate)}
                  >
                    <TableCell>
                      <Image
                        src={certificate.image}
                        alt={certificate.name}
                        width={80}
                        height={80}
                        className="rounded-lg object-cover"
                      />
                    </TableCell>
                    <TableCell className="font-medium">{certificate.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {certificate.issuedBy || '-'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(certificate)
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
              This will permanently delete the certificate{' '}
              <span className="font-semibold">{certificateToDelete?.name}</span>. This
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
                'Delete Certificate'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
