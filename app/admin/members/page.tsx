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
import { Plus, Trash2, Loader2, UserCircle, Edit, Upload, X } from 'lucide-react'
import { getAllMembers, createMember, updateMember, deleteMember } from './actions'
import { handleImageUpload } from '@/lib/imageUtils'
import Image from 'next/image'

interface Member {
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

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit state
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editMember, setEditMember] = useState<Member | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form state for create
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    designation: '',
    fbURL: '',
    instaURL: '',
    twitterURL: '',
    linkedinURL: '',
    isActive: true,
    priority: 1000,
    image: '',
  })

  // Form state for edit
  const [editFormData, setEditFormData] = useState({
    name: '',
    phone: '',
    designation: '',
    fbURL: '',
    instaURL: '',
    twitterURL: '',
    linkedinURL: '',
    isActive: true,
    priority: 1000,
    image: '',
  })

  const [imagePreview, setImagePreview] = useState<string>('')
  const [editImagePreview, setEditImagePreview] = useState<string>('')
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  const fetchMembers = async () => {
    setIsLoading(true)
    try {
      const result = await getAllMembers()
      if (result.success && result.members) {
        setMembers(result.members)
      } else {
        toast.error('Failed to load members', {
          description: result.message || 'An error occurred',
        })
      }
    } catch (error) {
      toast.error('Failed to load members', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
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

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      toast.loading('Creating member...', { id: 'create-member' })

      const result = await createMember(formData)

      if (result.success) {
        toast.success('Member created successfully', {
          id: 'create-member',
          description: `${formData.name} has been added to the system`,
        })

        // Reset form and close sheet
        setFormData({
          name: '',
          email: '',
          phone: '',
          designation: '',
          fbURL: '',
          instaURL: '',
          twitterURL: '',
          linkedinURL: '',
          isActive: true,
          priority: 1000,
          image: '',
        })
        setImagePreview('')
        setIsSheetOpen(false)

        // Refresh members list
        await fetchMembers()
      } else {
        toast.error('Failed to create member', {
          id: 'create-member',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to create member', {
        id: 'create-member',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRowClick = (member: Member) => {
    setEditMember(member)
    setEditFormData({
      name: member.name,
      phone: member.phone,
      designation: member.designation || '',
      fbURL: member.fbURL || '',
      instaURL: member.instaURL || '',
      twitterURL: member.twitterURL || '',
      linkedinURL: member.linkedinURL || '',
      isActive: member.isActive,
      priority: member.priority,
      image: member.image || '',
    })
    setEditImagePreview(member.image || '')
    setIsEditSheetOpen(true)
  }

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editMember || !editFormData.name || !editFormData.phone) {
      toast.error('Name and phone are required')
      return
    }

    setIsUpdating(true)
    try {
      toast.loading('Updating member...', { id: 'update-member' })

      const result = await updateMember(editMember.id, editFormData)

      if (result.success) {
        toast.success('Member updated successfully', {
          id: 'update-member',
        })

        // Reset and close
        setEditFormData({
          name: '',
          phone: '',
          designation: '',
          fbURL: '',
          instaURL: '',
          twitterURL: '',
          linkedinURL: '',
          isActive: true,
          priority: 1000,
          image: '',
        })
        setEditImagePreview('')
        setIsEditSheetOpen(false)
        setEditMember(null)

        // Refresh members list
        await fetchMembers()
      } else {
        toast.error('Failed to update member', {
          id: 'update-member',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to update member', {
        id: 'update-member',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteClick = (member: Member) => {
    setMemberToDelete(member)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!memberToDelete) return

    setIsDeleting(true)
    try {
      toast.loading('Deleting member...', { id: 'delete-member' })

      const result = await deleteMember(memberToDelete.id)

      if (result.success) {
        toast.success('Member deleted successfully', {
          id: 'delete-member',
          description: `${memberToDelete.name} has been removed`,
        })

        await fetchMembers()
      } else {
        toast.error('Failed to delete member', {
          id: 'delete-member',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to delete member', {
        id: 'delete-member',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setMemberToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Members Management
          </h1>
          <p className="text-muted-foreground">
            Manage organization members and their details
          </p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="cursor-pointer" suppressHydrationWarning>
              <Plus className="mr-2 h-4 w-4" />
              Add New Member
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">Create New Member</SheetTitle>
                    <SheetDescription className="mt-1">
                      Add a new member to the organization
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <form
                onSubmit={handleCreateMember}
                className="flex-1 flex flex-col px-6 pt-6"
              >
                <div className="flex-1 space-y-6">
                  {/* Image Upload */}
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Profile Image
                    </Label>
                    <div className="flex items-center gap-4">
                      {imagePreview ? (
                        <div className="relative">
                          <Image
                            src={imagePreview}
                            alt="Preview"
                            width={100}
                            height={100}
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
                        <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg">
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
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Max 5MB. Will be compressed to 50KB.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        disabled={isCreating}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={isCreating}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone *
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={isCreating}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="designation" className="text-sm font-medium">
                        Designation
                      </Label>
                      <Input
                        id="designation"
                        placeholder="President"
                        value={formData.designation}
                        onChange={(e) =>
                          setFormData({ ...formData, designation: e.target.value })
                        }
                        disabled={isCreating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="priority" className="text-sm font-medium">
                        Display Priority
                      </Label>
                      <Input
                        id="priority"
                        type="number"
                        placeholder="1000"
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priority: parseInt(e.target.value) || 1000,
                          })
                        }
                        disabled={isCreating}
                      />
                      <p className="text-xs text-muted-foreground">
                        Lower number = higher priority
                      </p>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="space-y-4 pt-4 border-t">
                    <Label className="text-base font-semibold">
                      Social Media Links
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        placeholder="Facebook URL"
                        value={formData.fbURL}
                        onChange={(e) =>
                          setFormData({ ...formData, fbURL: e.target.value })
                        }
                        disabled={isCreating}
                      />
                      <Input
                        placeholder="Instagram URL"
                        value={formData.instaURL}
                        onChange={(e) =>
                          setFormData({ ...formData, instaURL: e.target.value })
                        }
                        disabled={isCreating}
                      />
                      <Input
                        placeholder="Twitter URL"
                        value={formData.twitterURL}
                        onChange={(e) =>
                          setFormData({ ...formData, twitterURL: e.target.value })
                        }
                        disabled={isCreating}
                      />
                      <Input
                        placeholder="LinkedIn URL"
                        value={formData.linkedinURL}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            linkedinURL: e.target.value,
                          })
                        }
                        disabled={isCreating}
                      />
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
                        Creating Member...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Create Member
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
                  <SheetTitle className="text-xl">Edit Member</SheetTitle>
                  <SheetDescription className="mt-1">
                    Update member information
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <form
              onSubmit={handleUpdateMember}
              className="flex-1 flex flex-col px-6 pt-6"
            >
              <div className="flex-1 space-y-6">
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Profile Image
                  </Label>
                  <div className="flex items-center gap-4">
                    {editImagePreview ? (
                      <div className="relative">
                        <Image
                          src={editImagePreview}
                          alt="Preview"
                          width={100}
                          height={100}
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
                      <div className="flex items-center justify-center w-24 h-24 border-2 border-dashed rounded-lg">
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-medium">
                      Full Name *
                    </Label>
                    <Input
                      id="edit-name"
                      placeholder="John Doe"
                      value={editFormData.name}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, name: e.target.value })
                      }
                      disabled={isUpdating}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-email" className="text-sm font-medium">
                      Email
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      value={editMember?.email || ''}
                      disabled
                      className="bg-muted cursor-not-allowed"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-phone" className="text-sm font-medium">
                      Phone *
                    </Label>
                    <Input
                      id="edit-phone"
                      placeholder="+1234567890"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, phone: e.target.value })
                      }
                      disabled={isUpdating}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-designation" className="text-sm font-medium">
                      Designation
                    </Label>
                    <Input
                      id="edit-designation"
                      placeholder="President"
                      value={editFormData.designation}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, designation: e.target.value })
                      }
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-priority" className="text-sm font-medium">
                      Display Priority
                    </Label>
                    <Input
                      id="edit-priority"
                      type="number"
                      placeholder="1000"
                      value={editFormData.priority}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          priority: parseInt(e.target.value) || 1000,
                        })
                      }
                      disabled={isUpdating}
                    />
                    <p className="text-xs text-muted-foreground">
                      Lower number = higher priority
                    </p>
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-base font-semibold">
                    Social Media Links
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      placeholder="Facebook URL"
                      value={editFormData.fbURL}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, fbURL: e.target.value })
                      }
                      disabled={isUpdating}
                    />
                    <Input
                      placeholder="Instagram URL"
                      value={editFormData.instaURL}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, instaURL: e.target.value })
                      }
                      disabled={isUpdating}
                    />
                    <Input
                      placeholder="Twitter URL"
                      value={editFormData.twitterURL}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, twitterURL: e.target.value })
                      }
                      disabled={isUpdating}
                    />
                    <Input
                      placeholder="LinkedIn URL"
                      value={editFormData.linkedinURL}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          linkedinURL: e.target.value,
                        })
                      }
                      disabled={isUpdating}
                    />
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
                      Updating Member...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-5 w-5" />
                      Update Member
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
          <UserCircle className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Organization Members</h2>
          <Badge variant="secondary" className="ml-2">
            {members.length} {members.length === 1 ? 'member' : 'members'}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-md border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border bg-card">
            <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No members found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by adding your first member
            </p>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {members.map((member) => (
                  <TableRow
                    key={member.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(member)}
                  >
                    <TableCell>
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                          <UserCircle className="h-6 w-6 text-muted-foreground" />
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>{member.designation || '-'}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {member.email}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {member.phone}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(member)
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
              This will permanently delete the member{' '}
              <span className="font-semibold">{memberToDelete?.name}</span>. This
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
                'Delete Member'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
