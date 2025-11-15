import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function ActivitiesNumberPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activities Number Management</h1>
        <p className="text-muted-foreground">
          Manage activity statistics and metrics
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Activity Statistics</CardTitle>
          <CardDescription>
            View and update activity numbers and metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activities number management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
