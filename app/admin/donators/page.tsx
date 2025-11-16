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
import { Checkbox } from '@/components/ui/checkbox'
import { Plus, Trash2, Loader2, Heart, Edit, CheckCircle2, Circle } from 'lucide-react'
import { getAllDonators, createDonator, updateDonator, deleteDonator } from './actions'

interface Donator {
  id: string
  name: string
  email: string
  phone?: string
  amount: number
  paymentMode?: string
  transactionId: string
  date: string
  isVerified: boolean
}

export default function DonatorsPage() {
  const [donators, setDonators] = useState<Donator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [donatorToDelete, setDonatorToDelete] = useState<Donator | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Edit state
  const [isEditSheetOpen, setIsEditSheetOpen] = useState(false)
  const [editDonator, setEditDonator] = useState<Donator | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form state for create
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: 0,
    paymentMode: '',
    transactionId: '',
    date: new Date().toISOString().split('T')[0],
    isVerified: false,
  })

  // Form state for edit
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: 0,
    paymentMode: '',
    transactionId: '',
    date: '',
    isVerified: false,
  })

  const fetchDonators = async () => {
    setIsLoading(true)
    try {
      const result = await getAllDonators()
      if (result.success && result.donators) {
        setDonators(result.donators)
      } else {
        toast.error('Failed to load donators', {
          description: result.message || 'An error occurred',
        })
      }
    } catch (error) {
      toast.error('Failed to load donators', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchDonators()
  }, [])

  const handleCreateDonator = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.amount || !formData.transactionId) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsCreating(true)
    try {
      toast.loading('Creating donator...', { id: 'create-donator' })

      const result = await createDonator(formData)

      if (result.success) {
        toast.success('Donator created successfully', {
          id: 'create-donator',
          description: `${formData.name} has been added to the system`,
        })

        // Reset form and close sheet
        setFormData({
          name: '',
          email: '',
          phone: '',
          amount: 0,
          paymentMode: '',
          transactionId: '',
          date: new Date().toISOString().split('T')[0],
          isVerified: false,
        })
        setIsSheetOpen(false)

        // Refresh donators list
        await fetchDonators()
      } else {
        toast.error('Failed to create donator', {
          id: 'create-donator',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to create donator', {
        id: 'create-donator',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsCreating(false)
    }
  }

  const handleRowClick = (donator: Donator) => {
    setEditDonator(donator)
    setEditFormData({
      name: donator.name,
      email: donator.email,
      phone: donator.phone || '',
      amount: donator.amount,
      paymentMode: donator.paymentMode || '',
      transactionId: donator.transactionId,
      date: donator.date
        ? new Date(donator.date).toISOString().split('T')[0]
        : '',
      isVerified: donator.isVerified,
    })
    setIsEditSheetOpen(true)
  }

  const handleUpdateDonator = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!editDonator || !editFormData.name || !editFormData.email || !editFormData.amount || !editFormData.transactionId) {
      toast.error('All required fields must be filled')
      return
    }

    setIsUpdating(true)
    try {
      toast.loading('Updating donator...', { id: 'update-donator' })

      const result = await updateDonator(editDonator.id, editFormData)

      if (result.success) {
        toast.success('Donator updated successfully', {
          id: 'update-donator',
        })

        // Reset and close
        setEditFormData({
          name: '',
          email: '',
          phone: '',
          amount: 0,
          paymentMode: '',
          transactionId: '',
          date: '',
          isVerified: false,
        })
        setIsEditSheetOpen(false)
        setEditDonator(null)

        // Refresh donators list
        await fetchDonators()
      } else {
        toast.error('Failed to update donator', {
          id: 'update-donator',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to update donator', {
        id: 'update-donator',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleDeleteClick = (donator: Donator) => {
    setDonatorToDelete(donator)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!donatorToDelete) return

    setIsDeleting(true)
    try {
      toast.loading('Deleting donator...', { id: 'delete-donator' })

      const result = await deleteDonator(donatorToDelete.id)

      if (result.success) {
        toast.success('Donator deleted successfully', {
          id: 'delete-donator',
          description: `${donatorToDelete.name} has been removed`,
        })

        await fetchDonators()
      } else {
        toast.error('Failed to delete donator', {
          id: 'delete-donator',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to delete donator', {
        id: 'delete-donator',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setDonatorToDelete(null)
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Donators Management
          </h1>
          <p className="text-muted-foreground">
            Manage donors and their contributions
          </p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button className="cursor-pointer" suppressHydrationWarning>
              <Plus className="mr-2 h-4 w-4" />
              Add New Donator
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Heart className="h-6 w-6" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">Add New Donator</SheetTitle>
                    <SheetDescription className="mt-1">
                      Add a new donor and their contribution
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <form
                onSubmit={handleCreateDonator}
                className="flex-1 flex flex-col px-6 pt-6"
              >
                <div className="flex-1 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Name *
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
                        Phone
                      </Label>
                      <Input
                        id="phone"
                        placeholder="+91 1234567890"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={isCreating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount" className="text-sm font-medium">
                        Amount (₹) *
                      </Label>
                      <Input
                        id="amount"
                        type="number"
                        min="1"
                        placeholder="1000"
                        value={formData.amount || ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            amount: parseInt(e.target.value) || 0,
                          })
                        }
                        disabled={isCreating}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="paymentMode" className="text-sm font-medium">
                        Payment Mode
                      </Label>
                      <Input
                        id="paymentMode"
                        placeholder="UPI / Net Banking / Cash"
                        value={formData.paymentMode}
                        onChange={(e) =>
                          setFormData({ ...formData, paymentMode: e.target.value })
                        }
                        disabled={isCreating}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transactionId" className="text-sm font-medium">
                        Transaction ID *
                      </Label>
                      <Input
                        id="transactionId"
                        placeholder="TXN123456789"
                        value={formData.transactionId}
                        onChange={(e) =>
                          setFormData({ ...formData, transactionId: e.target.value })
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

                    <div className="space-y-2 flex items-end">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isVerified"
                          checked={formData.isVerified}
                          onCheckedChange={(checked) =>
                            setFormData({ ...formData, isVerified: checked as boolean })
                          }
                          disabled={isCreating}
                        />
                        <label
                          htmlFor="isVerified"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Payment Verified
                        </label>
                      </div>
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
                    disabled={isCreating}
                  >
                    {isCreating ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Adding Donator...
                      </>
                    ) : (
                      <>
                        <Plus className="mr-2 h-5 w-5" />
                        Add Donator
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
                  <SheetTitle className="text-xl">Edit Donator</SheetTitle>
                  <SheetDescription className="mt-1">
                    Update donator information
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <form
              onSubmit={handleUpdateDonator}
              className="flex-1 flex flex-col px-6 pt-6"
            >
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name" className="text-sm font-medium">
                      Name *
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
                      Email *
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      placeholder="john@example.com"
                      value={editFormData.email}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, email: e.target.value })
                      }
                      disabled={isUpdating}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-phone" className="text-sm font-medium">
                      Phone
                    </Label>
                    <Input
                      id="edit-phone"
                      placeholder="+91 1234567890"
                      value={editFormData.phone}
                      onChange={(e) =>
                        setEditFormData({ ...editFormData, phone: e.target.value })
                      }
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-amount" className="text-sm font-medium">
                      Amount (₹) *
                    </Label>
                    <Input
                      id="edit-amount"
                      type="number"
                      min="1"
                      placeholder="1000"
                      value={editFormData.amount || ''}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          amount: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={isUpdating}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-paymentMode" className="text-sm font-medium">
                      Payment Mode
                    </Label>
                    <Input
                      id="edit-paymentMode"
                      placeholder="UPI / Net Banking / Cash"
                      value={editFormData.paymentMode}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          paymentMode: e.target.value,
                        })
                      }
                      disabled={isUpdating}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-transactionId" className="text-sm font-medium">
                      Transaction ID *
                    </Label>
                    <Input
                      id="edit-transactionId"
                      placeholder="TXN123456789"
                      value={editFormData.transactionId}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          transactionId: e.target.value,
                        })
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

                  <div className="space-y-2 flex items-end">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-isVerified"
                        checked={editFormData.isVerified}
                        onCheckedChange={(checked) =>
                          setEditFormData({
                            ...editFormData,
                            isVerified: checked as boolean,
                          })
                        }
                        disabled={isUpdating}
                      />
                      <label
                        htmlFor="edit-isVerified"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Payment Verified
                      </label>
                    </div>
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
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Updating Donator...
                    </>
                  ) : (
                    <>
                      <Edit className="mr-2 h-5 w-5" />
                      Update Donator
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
          <Heart className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">All Donators</h2>
          <Badge variant="secondary" className="ml-2">
            {donators.length} {donators.length === 1 ? 'donator' : 'donators'}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-md border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : donators.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border bg-card">
            <Heart className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No donators found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by adding your first donator
            </p>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead className="hidden md:table-cell">Payment Mode</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="hidden xl:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donators.map((donator) => (
                  <TableRow
                    key={donator.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(donator)}
                  >
                    <TableCell className="font-medium">{donator.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {donator.email}
                    </TableCell>
                    <TableCell className="font-semibold">
                      {formatCurrency(donator.amount)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {donator.paymentMode || '-'}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDate(donator.date)}
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      {donator.isVerified ? (
                        <Badge variant="default" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="gap-1">
                          <Circle className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(donator)
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
              This will permanently delete the donator{' '}
              <span className="font-semibold">{donatorToDelete?.name}</span>. This
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
                'Delete Donator'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
