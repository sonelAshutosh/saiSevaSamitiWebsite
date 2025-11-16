'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Users, Building2, UserCheck, Heart, Edit } from 'lucide-react'
import { getActivitiesNumber, updateActivitiesNumber } from './actions'

interface ActivitiesNumber {
  id: string
  happyPeople: number
  offices: number
  staff: number
  volunteers: number
}

export default function ActivitiesNumberPage() {
  const [data, setData] = useState<ActivitiesNumber | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    happyPeople: 0,
    offices: 0,
    staff: 0,
    volunteers: 0,
  })

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const result = await getActivitiesNumber()
      if (result.success && result.data) {
        setData(result.data)
        setFormData({
          happyPeople: result.data.happyPeople,
          offices: result.data.offices,
          staff: result.data.staff,
          volunteers: result.data.volunteers,
        })
      } else {
        toast.error('Failed to load activities numbers', {
          description: result.message || 'An error occurred',
        })
      }
    } catch (error) {
      toast.error('Failed to load activities numbers', {
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleUpdateNumbers = async (e: React.FormEvent) => {
    e.preventDefault()

    setIsUpdating(true)
    try {
      toast.loading('Updating numbers...', { id: 'update-numbers' })

      const result = await updateActivitiesNumber(formData)

      if (result.success) {
        toast.success('Numbers updated successfully', {
          id: 'update-numbers',
        })

        setIsSheetOpen(false)
        await fetchData()
      } else {
        toast.error('Failed to update numbers', {
          id: 'update-numbers',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to update numbers', {
        id: 'update-numbers',
        description: 'An unexpected error occurred',
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const handleOpenSheet = () => {
    if (data) {
      setFormData({
        happyPeople: data.happyPeople,
        offices: data.offices,
        staff: data.staff,
        volunteers: data.volunteers,
      })
    }
    setIsSheetOpen(true)
  }

  const stats = [
    {
      title: 'Happy People',
      value: data?.happyPeople || 0,
      icon: Heart,
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      description: 'People helped through our services',
    },
    {
      title: 'Offices',
      value: data?.offices || 0,
      icon: Building2,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      description: 'Office locations across regions',
    },
    {
      title: 'Staff Members',
      value: data?.staff || 0,
      icon: UserCheck,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      description: 'Dedicated staff members',
    },
    {
      title: 'Volunteers',
      value: data?.volunteers || 0,
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      description: 'Active volunteers contributing',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Activities Numbers
          </h1>
          <p className="text-muted-foreground">
            Manage activity statistics and metrics displayed on the website
          </p>
        </div>

        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Button
              className="cursor-pointer"
              onClick={handleOpenSheet}
              suppressHydrationWarning
            >
              <Edit className="mr-2 h-4 w-4" />
              Update Numbers
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:max-w-xl overflow-y-auto p-0">
            <div className="flex flex-col h-full">
              <SheetHeader className="space-y-4 px-6 pt-6 pb-6 border-b">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Edit className="h-6 w-6" />
                  </div>
                  <div>
                    <SheetTitle className="text-xl">Update Activities Numbers</SheetTitle>
                    <SheetDescription className="mt-1">
                      Update the statistics displayed on the website
                    </SheetDescription>
                  </div>
                </div>
              </SheetHeader>

              <form
                onSubmit={handleUpdateNumbers}
                className="flex-1 flex flex-col px-6 pt-6"
              >
                <div className="flex-1 space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="happyPeople" className="text-sm font-medium flex items-center gap-2">
                      <Heart className="h-4 w-4 text-pink-600" />
                      Happy People
                    </Label>
                    <Input
                      id="happyPeople"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.happyPeople}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          happyPeople: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={isUpdating}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of people helped through our services
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="offices" className="text-sm font-medium flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-blue-600" />
                      Offices
                    </Label>
                    <Input
                      id="offices"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.offices}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          offices: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={isUpdating}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of office locations
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="staff" className="text-sm font-medium flex items-center gap-2">
                      <UserCheck className="h-4 w-4 text-green-600" />
                      Staff Members
                    </Label>
                    <Input
                      id="staff"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.staff}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          staff: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={isUpdating}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of dedicated staff members
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="volunteers" className="text-sm font-medium flex items-center gap-2">
                      <Users className="h-4 w-4 text-purple-600" />
                      Volunteers
                    </Label>
                    <Input
                      id="volunteers"
                      type="number"
                      min="0"
                      placeholder="0"
                      value={formData.volunteers}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          volunteers: parseInt(e.target.value) || 0,
                        })
                      }
                      disabled={isUpdating}
                      required
                    />
                    <p className="text-xs text-muted-foreground">
                      Number of active volunteers
                    </p>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-3 py-6 border-t mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsSheetOpen(false)}
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
                        Updating...
                      </>
                    ) : (
                      <>
                        <Edit className="mr-2 h-5 w-5" />
                        Update Numbers
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 rounded-md border bg-card">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stat.value.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>About Activities Numbers</CardTitle>
          <CardDescription>
            These statistics are displayed on the public website homepage
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-sm text-muted-foreground">
            Update these numbers regularly to reflect the current impact and reach of Sai Seva Samiti.
            The numbers are displayed prominently on the website to showcase the organization's achievements.
          </p>
          <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1 mt-4">
            <li><strong>Happy People:</strong> Total number of individuals who have benefited from our services</li>
            <li><strong>Offices:</strong> Number of office locations where we operate</li>
            <li><strong>Staff Members:</strong> Total dedicated staff working for the organization</li>
            <li><strong>Volunteers:</strong> Active volunteers contributing their time and effort</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
