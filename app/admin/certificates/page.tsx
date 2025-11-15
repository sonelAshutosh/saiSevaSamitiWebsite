import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Certificates Management</h1>
        <p className="text-muted-foreground">
          Manage certificates and awards
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Certificates & Awards</CardTitle>
          <CardDescription>
            View and manage all certificates and recognitions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Certificates management functionality coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
