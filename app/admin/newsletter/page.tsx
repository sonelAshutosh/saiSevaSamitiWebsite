import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function NewsletterPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Newsletter Management</h1>
        <p className="text-muted-foreground">
          Manage newsletter subscribers
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Newsletter Subscribers</CardTitle>
          <CardDescription>
            View and manage all newsletter subscriptions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Newsletter management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
