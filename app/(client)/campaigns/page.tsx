'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Calendar, Sparkles, Search } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import Section from '@/components/layout/Section'
import { getAllCampaigns } from '@/app/admin/campaigns/actions'

interface Campaign {
  id: string
  name: string
  description: string
  image: string
  date: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)

        const result = await getAllCampaigns()
        if (result.success && result.campaigns) {
          setCampaigns(result.campaigns)
          setFilteredCampaigns(result.campaigns)
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCampaigns(campaigns)
    } else {
      const filtered = campaigns.filter(
        (campaign) =>
          campaign.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          campaign.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredCampaigns(filtered)
    }
  }, [searchQuery, campaigns])

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section gradient className="!py-20 md:!py-28">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge className="mx-auto w-fit gradient-secondary">Our Impact</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Our <span className="text-primary">Campaigns</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Explore our initiatives and programs dedicated to serving communities through food
            distribution, medical assistance, and awareness campaigns.
          </p>
        </div>
      </Section>

      {/* Search & Filter Section */}
      <Section className="!py-8" shade="primary">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search campaigns by name or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </Section>

      {/* Campaigns Grid Section */}
      <Section shade="accent">
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-56 w-full" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-32" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCampaigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Campaigns Found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No campaigns match "${searchQuery}". Try a different search term.`
                : 'No campaigns available at the moment. Check back soon!'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">All Campaigns</h2>
                <p className="text-muted-foreground mt-1">
                  Showing {filteredCampaigns.length}{' '}
                  {filteredCampaigns.length === 1 ? 'campaign' : 'campaigns'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCampaigns.map((campaign, index) => (
                <Card
                  key={campaign.id}
                  className="overflow-hidden group hover:shadow-xl transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {/* Campaign Image */}
                  <div className="relative h-56 bg-muted overflow-hidden">
                    {campaign.image ? (
                      <Image
                        src={campaign.image}
                        alt={campaign.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-20 w-20 text-muted-foreground/20" />
                      </div>
                    )}
                  </div>

                  {/* Campaign Content */}
                  <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                        {campaign.name}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {campaign.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(campaign.date)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* CTA Section */}
      {!isLoading && filteredCampaigns.length > 0 && (
        <Section className="gradient-primary text-primary-foreground">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Support Our Campaigns</h2>
            <p className="text-lg opacity-90">
              Your contribution helps us expand our reach and impact more lives. Every donation
              makes a difference in building stronger, healthier communities.
            </p>
          </div>
        </Section>
      )}
    </div>
  )
}
