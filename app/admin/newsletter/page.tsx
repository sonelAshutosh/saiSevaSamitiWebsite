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
import { Badge } from '@/components/ui/badge'
import { Trash2, Loader2, Mail } from 'lucide-react'
import {
  getAllNewsLetterSubscriptions,
  deleteNewsLetterSubscription,
} from './actions'

interface NewsletterSubscription {
  id: string
  email: string
}

export default function NewsletterPage() {
  const [subscriptions, setSubscriptions] = useState<NewsletterSubscription[]>(
    []
  )
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [subscriptionToDelete, setSubscriptionToDelete] =
    useState<NewsletterSubscription | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchSubscriptions = async () => {
    setIsLoading(true)
    try {
      const result = await getAllNewsLetterSubscriptions()
      if (result.success && result.subscriptions) {
        setSubscriptions(result.subscriptions)
      } else {
        toast.error('Failed to load newsletter subscriptions', {
          description: result.message || 'An error occurred',
        })
      }
    } catch (error) {
      toast.error('Failed to load newsletter subscriptions', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const handleDeleteClick = (subscription: NewsletterSubscription) => {
    setSubscriptionToDelete(subscription)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!subscriptionToDelete) return

    setIsDeleting(true)
    try {
      toast.loading('Deleting subscription...', { id: 'delete-subscription' })

      const result = await deleteNewsLetterSubscription(subscriptionToDelete.id)

      if (result.success) {
        toast.success('Subscription deleted successfully', {
          id: 'delete-subscription',
          description: `${subscriptionToDelete.email} has been removed`,
        })

        await fetchSubscriptions()
      } else {
        toast.error('Failed to delete subscription', {
          id: 'delete-subscription',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to delete subscription', {
        id: 'delete-subscription',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSubscriptionToDelete(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Newsletter Management
          </h1>
          <p className="text-muted-foreground">
            View and manage newsletter subscriptions
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Subscribers</h2>
          <Badge variant="secondary" className="ml-2">
            {subscriptions.length}{' '}
            {subscriptions.length === 1 ? 'subscriber' : 'subscribers'}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-md border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : subscriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border bg-card">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No subscribers found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Newsletter subscriptions will appear here
            </p>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Email Address</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscriptions.map((subscription, index) => (
                  <TableRow key={subscription.id}>
                    <TableCell className="font-medium text-muted-foreground">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {subscription.email}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(subscription)
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
              This will permanently delete the subscription for{' '}
              <span className="font-semibold">
                {subscriptionToDelete?.email}
              </span>
              . This action cannot be undone.
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
                'Delete Subscription'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
