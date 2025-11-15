import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CampaignsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Campaigns Management</h1>
        <p className="text-muted-foreground">
          Manage ongoing and past campaigns
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign List</CardTitle>
          <CardDescription>
            View and manage all campaigns and initiatives
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Campaigns management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
