'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Sparkles } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Section from '@/components/layout/Section'
import ParallaxHero from '@/components/layout/ParallaxHero'
import { getAllCampaigns } from '@/app/admin/campaigns/actions'
import { FadeIn } from '@/components/animations/FadeIn'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/StaggerContainer'

interface Campaign {
  id: string
  name: string
  description: string
  image: string
  date: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)

        const result = await getAllCampaigns()
        if (result.success && result.campaigns) {
          setCampaigns(result.campaigns)
        }
      } catch (error) {
        console.error('Error fetching campaigns:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [])

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
      <ParallaxHero
        imageSrc="/images/banner-image-3.jpg"
        className="min-h-[500px] md:min-h-[600px]"
      >
        <div className="container-custom py-20 md:py-28">
          <FadeIn delay={0.1}>
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge className="mx-auto w-fit bg-white/10 border-white/30 text-white hover:bg-white/20">
                Our Impact
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Our <span className="text-white/90">Campaigns</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Explore our initiatives and programs dedicated to serving
                communities through food distribution, medical assistance, and
                awareness campaigns.
              </p>
            </div>
          </FadeIn>
        </div>
      </ParallaxHero>

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
        ) : campaigns.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Campaigns Found</h3>
            <p className="text-muted-foreground">
              No campaigns available at the moment. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">
                  All Campaigns
                </h2>
                <p className="text-muted-foreground mt-1">
                  Showing {campaigns.length}{' '}
                  {campaigns.length === 1 ? 'campaign' : 'campaigns'}
                </p>
              </div>
            </div>

            <StaggerContainer
              staggerDelay={0.05}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {campaigns.map((campaign) => (
                <StaggerItem key={campaign.id}>
                  <Link href={`/campaigns/${campaign.id}`}>
                    <Card className="overflow-hidden group hover:shadow-xl transition-all duration-300 cursor-pointer h-full">
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
                  </Link>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </>
        )}
      </Section>

      {/* CTA Section */}
      {!isLoading && campaigns.length > 0 && (
        <Section className="gradient-primary text-primary-foreground">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">
              Support Our Campaigns
            </h2>
            <p className="text-lg opacity-90">
              Your contribution helps us expand our reach and impact more lives.
              Every donation makes a difference in building stronger, healthier
              communities.
            </p>
          </div>
        </Section>
      )}
    </div>
  )
}
