import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function VolunteersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Volunteers Management</h1>
        <p className="text-muted-foreground">
          Manage volunteers and their contributions
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Active Volunteers</CardTitle>
          <CardDescription>
            View and manage all volunteers helping Sai Seva Samiti
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Volunteers management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
