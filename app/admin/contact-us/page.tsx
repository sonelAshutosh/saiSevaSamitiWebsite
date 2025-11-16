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
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Trash2, Loader2, Mail, Eye } from 'lucide-react'
import { getAllContactSubmissions, deleteContactSubmission } from './actions'

interface ContactSubmission {
  id: string
  name: string
  email: string
  subject: string
  message: string
  date: string
}

export default function ContactUsPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [submissionToDelete, setSubmissionToDelete] = useState<ContactSubmission | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // View state
  const [isViewSheetOpen, setIsViewSheetOpen] = useState(false)
  const [viewSubmission, setViewSubmission] = useState<ContactSubmission | null>(null)

  const fetchSubmissions = async () => {
    setIsLoading(true)
    try {
      const result = await getAllContactSubmissions()
      if (result.success && result.submissions) {
        setSubmissions(result.submissions)
      } else {
        toast.error('Failed to load contact submissions', {
          description: result.message || 'An error occurred',
        })
      }
    } catch (error) {
      toast.error('Failed to load contact submissions', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSubmissions()
  }, [])

  const handleRowClick = (submission: ContactSubmission) => {
    setViewSubmission(submission)
    setIsViewSheetOpen(true)
  }

  const handleDeleteClick = (submission: ContactSubmission) => {
    setSubmissionToDelete(submission)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!submissionToDelete) return

    setIsDeleting(true)
    try {
      toast.loading('Deleting submission...', { id: 'delete-submission' })

      const result = await deleteContactSubmission(submissionToDelete.id)

      if (result.success) {
        toast.success('Submission deleted successfully', {
          id: 'delete-submission',
          description: `Message from ${submissionToDelete.name} has been removed`,
        })

        await fetchSubmissions()
      } else {
        toast.error('Failed to delete submission', {
          id: 'delete-submission',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to delete submission', {
        id: 'delete-submission',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsDeleting(false)
      setDeleteDialogOpen(false)
      setSubmissionToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
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
            Contact Us Management
          </h1>
          <p className="text-muted-foreground">
            View and manage contact form submissions
          </p>
        </div>
      </div>

      {/* View Details Sheet */}
      <Sheet open={isViewSheetOpen} onOpenChange={setIsViewSheetOpen}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Eye className="h-6 w-6" />
                </div>
                <div>
                  <SheetTitle className="text-xl">Submission Details</SheetTitle>
                  <SheetDescription className="mt-1">
                    View contact form submission
                  </SheetDescription>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 px-6 pt-6 pb-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Name
                  </Label>
                  <p className="text-base font-medium">{viewSubmission?.name}</p>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">
                    Email
                  </Label>
                  <p className="text-base font-medium break-all">
                    {viewSubmission?.email}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Subject
                </Label>
                <p className="text-base font-medium">{viewSubmission?.subject}</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">
                  Received On
                </Label>
                <p className="text-base font-medium">
                  {viewSubmission?.date && formatDate(viewSubmission.date)}
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t">
                <Label className="text-sm font-medium text-muted-foreground">
                  Message
                </Label>
                <div className="rounded-lg border bg-muted/50 p-4">
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {viewSubmission?.message}
                  </p>
                </div>
              </div>
            </div>

            <div className="px-6 py-6 border-t">
              <Button
                onClick={() => setIsViewSheetOpen(false)}
                className="cursor-pointer h-11 text-base w-full"
              >
                Close
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Contact Submissions</h2>
          <Badge variant="secondary" className="ml-2">
            {submissions.length} {submissions.length === 1 ? 'submission' : 'submissions'}
          </Badge>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 rounded-md border bg-card">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center rounded-md border bg-card">
            <Mail className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No submissions found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Contact form submissions will appear here
            </p>
          </div>
        ) : (
          <div className="rounded-md border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead className="hidden lg:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleRowClick(submission)}
                  >
                    <TableCell className="font-medium">{submission.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {submission.email}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {submission.subject}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {formatDate(submission.date)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="cursor-pointer text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteClick(submission)
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
              This will permanently delete the submission from{' '}
              <span className="font-semibold">{submissionToDelete?.name}</span>. This
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
                'Delete Submission'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
