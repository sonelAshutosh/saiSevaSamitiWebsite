'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { Calendar, ArrowLeft, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import Section from '@/components/layout/Section'
import ParallaxHero from '@/components/layout/ParallaxHero'
import { getCampaignById } from '@/app/admin/campaigns/actions'
import { FadeIn } from '@/components/animations/FadeIn'

interface Campaign {
  id: string
  name: string
  description: string
  image: string
  date: string
}

export default function CampaignDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        setIsLoading(true)
        const id = params.id as string

        const result = await getCampaignById(id)
        if (result.success && result.campaign) {
          setCampaign(result.campaign)
        } else {
          setError(true)
        }
      } catch (error) {
        console.error('Error fetching campaign:', error)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaign()
  }, [params.id])

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

  if (isLoading) {
    return (
      <div className="overflow-x-hidden">
        {/* Loading Hero Section */}
        <div className="relative min-h-[500px] md:min-h-[600px] bg-muted">
          <Skeleton className="absolute inset-0" />
        </div>

        {/* Loading Content */}
        <Section shade="primary">
          <div className="max-w-4xl mx-auto space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </Section>
      </div>
    )
  }

  if (error || !campaign) {
    return (
      <div className="overflow-x-hidden">
        <Section className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Sparkles className="h-12 w-12 text-muted-foreground" />
            </div>
            <h1 className="text-3xl font-bold">Campaign Not Found</h1>
            <p className="text-muted-foreground max-w-md mx-auto">
              The campaign you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push('/campaigns')} variant="outline">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </div>
        </Section>
      </div>
    )
  }

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section with Campaign Image */}
      <ParallaxHero
        imageSrc={campaign.image || '/images/banner-image-bg.jpg'}
        className="h-[60vh] md:h-[70vh] relative"
        overlay={false}
      >
        {/* Custom gradient overlay - dark at bottom, transparent at top */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent"></div>

        <div className="relative h-full w-full flex flex-col min-h-[60vh] md:min-h-[70vh]">
          {/* Back button at top */}
          <div className="container-custom pt-8">
            <Button
              variant="ghost"
              onClick={() => router.push('/campaigns')}
              className="text-white hover:bg-white/10"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Campaigns
            </Button>
          </div>

          {/* Title at bottom */}
          <div className="flex-1 flex items-end">
            <div className="container-custom pb-12 md:pb-16 w-full">
              <FadeIn delay={0.1}>
                <div className="space-y-4">
                  <Badge className="w-fit bg-white/10 border-white/30 text-white hover:bg-white/20">
                    Campaign
                  </Badge>

                  <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white max-w-5xl">
                    {campaign.name}
                  </h1>

                  <div className="flex items-center gap-2 text-white/90">
                    <Calendar className="h-5 w-5" />
                    <span className="text-lg">{formatDate(campaign.date)}</span>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </ParallaxHero>

      {/* Campaign Content Section */}
      <Section shade="primary" className="py-16 md:py-24">
        <div className="container-custom max-w-6xl">
          <FadeIn delay={0.2}>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">About This Campaign</h2>
                <div className="h-1 w-24 bg-primary rounded-full"></div>
              </div>

              <div className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-line">
                {campaign.description}
              </div>
            </div>
          </FadeIn>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="gradient-secondary text-secondary-foreground">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Support Our Mission</h2>
          <p className="text-lg opacity-90">
            Your contribution can help us continue our work and make a lasting impact in the
            community. Every donation counts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              onClick={() => router.push('/donate')}
              className="w-full sm:w-auto"
            >
              Donate Now
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/campaigns')}
              className="w-full sm:w-auto bg-transparent text-secondary-foreground border-secondary-foreground hover:bg-secondary-foreground/10"
            >
              View All Campaigns
            </Button>
          </div>
        </div>
      </Section>
    </div>
  )
}
