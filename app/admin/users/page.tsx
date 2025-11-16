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
import { Plus, Trash2, Loader2, UserCircle, Edit } from 'lucide-react'
import { getAllUsers, createUser, updateUser, deleteUser } from './actions'

interface User {
  id: string
  name: string
  email: string
  createdAt?: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<User | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit state
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })

  // Edit form state
  const [editFormData, setEditFormData] = useState({
    name: '',
    password: '',
  })

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const result = await getAllUsers()
      if (result.success && result.users) {
        setUsers(result.users)
      } else {
        toast.error('Failed to load users', {
          description: result.message || 'An error occurred',
        })
      }
    } catch (error) {
      toast.error('Failed to load users', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.password) {
      toast.error('All fields are required')
      return
    }

    setIsCreating(true)
    try {
      toast.loading('Creating user...', { id: 'create-user' })

      const result = await createUser(
        formData.name,
        formData.email,
        formData.password
      )

      if (result.success) {
        toast.success('User created successfully', {
          id: 'create-user',
          description: `${formData.name} has been added to the system`,
        })

        // Reset form and close sheet
        setFormData({ name: '', email: '', password: '' })
        setIsSheetOpen(false)

        // Refresh users list
        await fetchUsers()
      } else {
        toast.error('Failed to create user', {
          id: 'create-user',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to create user', {
        id: 'create-user',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!userToDelete) return

    setIsDeleting(true)
    try {
      toast.loading('Deleting user...', { id: 'delete-user' })

      const result = await deleteUser(userToDelete.id)

      if (result.success) {
        toast.success('User deleted successfully', {
          id: 'delete-user',
          description: `${userToDelete.name} has been removed`,
        })

        // Refresh users list
        await fetchUsers()
      } else {
        toast.error('Failed to delete user', {
          id: 'delete-user',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to delete user', {
        id: 'delete-user',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleRowClick = (user: User) => {
    setEditUser(user)
    setEditFormData({
      name: user.name,
      password: '',
    })
    setIsEditSheetOpen(true)
  }

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editUser || !editFormData.name) {
      toast.error('Name is required')
      return
    }

    setIsUpdating(true)
    try {
      toast.loading('Updating user...', { id: 'update-user' })

      const result = await updateUser(
        editUser.id,
        editFormData.name,
        editFormData.password || undefined
      )

      if (result.success) {
        toast.success('User updated successfully', {
          id: 'update-user',
          description: editFormData.password
            ? 'User details and password updated'
            : 'User details updated',
        })

        // Reset form and close sheet
        setEditFormData({ name: '', password: '' })
        setIsEditSheetOpen(false)
        setEditUser(null)

        // Refresh users list
        await fetchUsers()
      } else {
        toast.error('Failed to update user', {
          id: 'update-user',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to update user', {
        id: 'update-user',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Users Management
          </h1>
          <p className="text-muted-foreground">
            Manage admin users and their permissions
          </p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="cursor-pointer" suppressHydrationWarning>
              <Plus className="mr-2 h-4 w-4" />
              Add New User
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <UserCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">Create New User</SheetTitle>
                    <SheetDescription className="mt-1">
                      Add a new admin user to access the portal
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <form
                onSubmit={handleCreateUser}
                className="flex-1 flex flex-col px-6 pt-6"
              >
                <div className="flex-1 space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base font-semibold">
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="e.g., John Doe"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      disabled={isCreating}
                      required
                      className="h-11 text-base"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base font-semibold">
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="e.g., john@example.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={isCreating}
                      required
                      className="h-11 text-base"
                    />
                    <p className="text-xs text-muted-foreground">
                      This will be used for logging into the admin portal
                    </p>
                  </div>

                  <div className="space-y-3">
                    <Label
                      htmlFor="password"
                      className="text-base font-semibold"
                    >
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter a secure password"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                      }
                      disabled={isCreating}
                      required
                      className="h-11 text-base"
                    />
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
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Creating User...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Create User
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Edit User Sheet */}
      <Sheet open={isEditSheetOpen} onOpenChange={setIsEditSheetOpen}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Edit className="h-6 w-6" />
                </div>
                <div>
                  <SheetTitle className="text-xl">Edit User</SheetTitle>
                  <SheetDescription className="mt-1">
                    Update user details or reset password
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <form
              onSubmit={handleUpdateUser}
              className="flex-1 flex flex-col px-6 pt-6"
            >
              <div className="flex-1 space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="edit-email" className="text-base font-semibold">
                    Email Address
                  </Label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={editUser?.email || ''}
                    disabled
                    className="h-11 text-base bg-muted"
                  />
                  <p className="text-xs text-muted-foreground">
                    Email cannot be changed
                  </p>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="edit-name" className="text-base font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="edit-name"
                    placeholder="e.g., John Doe"
                    value={editFormData.name}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, name: e.target.value })
                    }
                    disabled={isUpdating}
                    required
                    className="h-11 text-base"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="edit-password"
                    className="text-base font-semibold"
                  >
                    New Password
                  </Label>
                  <Input
                    id="edit-password"
                    type="password"
                    placeholder="Leave empty to keep current password"
                    value={editFormData.password}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        password: e.target.value,
                      })
                    }
                    disabled={isUpdating}
                    className="h-11 text-base"
                  />
                  <p className="text-xs text-muted-foreground">
                    Only fill this if you want to reset the password
                  </p>
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
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating User...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-5 w-5" />
                      Update User
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
          <h2 className="text-lg font-semibold">Admin Users</h2>
          <Badge variant="secondary" className="ml-2">
            {users.length} {users.length === 1 ? 'user' : 'users'}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-md border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border bg-card">
            <UserCircle className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No users found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by creating your first admin user
            </p>
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button className="cursor-pointer" suppressHydrationWarning>
                  <Plus className="mr-2 h-4 w-4" />
                  Add First User
                </Button>
              </SheetTrigger>
            </Sheet>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead className="hidden sm:table-cell">
                    Created At
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow
                    key={user.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(user)}
                  >
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.email.toLowerCase() !== 'su@gmail.com' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(user)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="ml-2 hidden sm:inline">Delete</span>
                        </Button>
                      )}
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
              This will permanently delete the user{' '}
              <span className="font-semibold">{userToDelete?.name}</span> (
              {userToDelete?.email}). This action cannot be undone.
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
                'Delete User'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
