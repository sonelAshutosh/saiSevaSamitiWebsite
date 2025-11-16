'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Heart,
  Users,
  Building2,
  UserCheck,
  ArrowRight,
  Target,
  Eye,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Section from '@/components/layout/Section'
import { getActivitiesNumber } from '@/app/admin/activities-number/actions'
import { getAllMembers } from '@/app/admin/members/actions'
import { getAllCampaigns } from '@/app/admin/campaigns/actions'

interface ActivityNumbers {
  happyPeople: number
  offices: number
  staff: number
  volunteers: number
}

interface Member {
  id: string
  name: string
  designation?: string
  image?: string
}

interface Campaign {
  id: string
  name: string
  description: string
  image: string
  date: string
}

export default function HomePage() {
  const [activityNumbers, setActivityNumbers] = useState<ActivityNumbers>({
    happyPeople: 0,
    offices: 0,
    staff: 0,
    volunteers: 0,
  })
  const [topMembers, setTopMembers] = useState<Member[]>([])
  const [recentCampaigns, setRecentCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch activity numbers
        const activityResult = await getActivitiesNumber()
        if (activityResult.success && activityResult.data) {
          setActivityNumbers({
            happyPeople: activityResult.data.happyPeople,
            offices: activityResult.data.offices,
            staff: activityResult.data.staff,
            volunteers: activityResult.data.volunteers,
          })
        }

        // Fetch members (top 6 active members)
        const membersResult = await getAllMembers()
        if (membersResult.success && membersResult.members) {
          const activeMembers = membersResult.members
            .filter((m) => m.isActive)
            .slice(0, 6)
          setTopMembers(activeMembers)
        }

        // Fetch campaigns (recent 4)
        const campaignsResult = await getAllCampaigns()
        if (campaignsResult.success && campaignsResult.campaigns) {
          setRecentCampaigns(campaignsResult.campaigns.slice(0, 4))
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const stats = [
    {
      icon: Heart,
      label: 'Happy People',
      value: activityNumbers.happyPeople.toLocaleString(),
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
    {
      icon: Building2,
      label: 'Offices',
      value: activityNumbers.offices.toLocaleString(),
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: UserCheck,
      label: 'Staff Members',
      value: activityNumbers.staff.toLocaleString(),
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      icon: Users,
      label: 'Volunteers',
      value: activityNumbers.volunteers.toLocaleString(),
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
  ]

  const services = [
    {
      title: 'Food Distribution',
      description:
        'Regular food drives to address hunger in communities and hospitals, ensuring no one goes to bed hungry.',
      icon: '🍽️',
    },
    {
      title: 'Medical Assistance',
      description:
        'Collaborations providing healthcare access to underprivileged populations through free medical camps and medicine distribution.',
      icon: '🏥',
    },
    {
      title: 'Awareness Campaigns',
      description:
        'Educational campaigns on health, hygiene, and social issues to empower communities with knowledge.',
      icon: '📢',
    },
  ]

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section gradient className="!py-20 md:!py-32 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-in slide-in-from-left-10 duration-700">
            <Badge className="w-fit gradient-secondary">
              Proudly Non-Profit
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Help the <span className="text-primary">Helpless</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-xl">
              Every rupee we receive goes directly into helping communities
              through food distribution, medical assistance, and awareness
              campaigns. Join us in making a difference.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/donate">
                <Button
                  size="lg"
                  className="gradient-secondary w-full sm:w-auto"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Donate Now
                </Button>
              </Link>
              <Link href="/about-us">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>

          <div className="relative h-[400px] lg:h-[500px] animate-in slide-in-from-right-10 duration-700">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl rotate-3"></div>
            <div className="relative h-full bg-muted rounded-3xl overflow-hidden flex items-center justify-center">
              <Sparkles className="h-32 w-32 text-muted-foreground/20" />
              {/* TODO: Replace with actual hero image */}
              <p className="absolute text-sm text-muted-foreground">
                Hero Image Placeholder
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Statistics Section */}
      <Section className="bg-card !py-12">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i} className="border-0 shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-14 w-14 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card
                key={index}
                className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 animate-in zoom-in-95"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div
                      className={`h-14 w-14 rounded-full ${stat.bgColor} flex items-center justify-center`}
                    >
                      <stat.icon className={`h-7 w-7 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-3xl font-bold">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">
                        {stat.label}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </Section>

      {/* Services Section */}
      <Section shade="primary">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mx-auto w-fit">
            What We Do
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Our Services</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We are committed to serving the community through various
            initiatives that bring hope and help to those in need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card
              key={index}
              className="border-2 hover:border-primary hover:shadow-lg transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-4"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <CardContent className="p-6 space-y-4">
                <div className="text-5xl">{service.icon}</div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Vision & Mission Section */}
      <Section shade="accent">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20 shadow-lg">
            <CardContent className="p-8 space-y-4">
              <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                <Target className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed">
                To serve humanity with compassion and dedication, providing
                essential services and support to those who need it most,
                creating lasting positive change in communities.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 shadow-lg">
            <CardContent className="p-8 space-y-4">
              <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                <Eye className="h-7 w-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed">
                A world where every individual has access to basic necessities,
                healthcare, and opportunities for growth, regardless of their
                socio-economic background.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* Recent Campaigns Section */}
      {isLoading ? (
        <Section shade="secondary">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-4">
                Our Impact
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Recent Campaigns
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : recentCampaigns.length > 0 ? (
        <Section shade="secondary">
          <div className="flex items-center justify-between mb-12">
            <div>
              <Badge variant="outline" className="mb-4">
                Our Impact
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold">
                Recent Campaigns
              </h2>
            </div>
            <Link href="/campaigns">
              <Button variant="outline">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {recentCampaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="overflow-hidden group hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48 bg-muted overflow-hidden">
                  {campaign.image ? (
                    <Image
                      src={campaign.image}
                      alt={campaign.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-16 w-16 text-muted-foreground/20" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors line-clamp-2">
                    {campaign.name}
                  </h3>
                  <p className="text-muted-foreground line-clamp-2">
                    {campaign.description}
                  </p>
                  <Link href="/campaigns">
                    <Button variant="link" className="p-0">
                      Learn More
                      <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Team Section */}
      {isLoading ? (
        <Section shade="muted">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Leaders</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="text-center">
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32 mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : topMembers.length > 0 ? (
        <Section shade="muted">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Leaders</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dedicated individuals committed to making a positive impact in the
              community.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {topMembers.map((member, index) => (
              <Card
                key={member.id}
                className="text-center hover:shadow-lg transition-shadow animate-in fade-in-50"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-32 w-32 mx-auto rounded-full bg-muted overflow-hidden relative">
                    {member.image ? (
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <UserCheck className="h-16 w-16 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    {member.designation && (
                      <p className="text-sm text-muted-foreground">
                        {member.designation}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/about-us">
              <Button variant="outline" size="lg">
                View All Members
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Section>
      ) : null}

      {/* CTA Section */}
      <Section className="gradient-primary text-primary-foreground">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Make a Difference Today
          </h2>
          <p className="text-lg opacity-90">
            Your contribution can change lives. Every donation, no matter how
            small, helps us continue our mission of serving those in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/donate">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Heart className="mr-2 h-5 w-5" />
                Donate Now
              </Button>
            </Link>
            <Link href="/contact-us">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent text-primary-foreground border-primary-foreground hover:bg-primary-foreground/10"
              >
                Get Involved
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </Section>
    </div>
  )
}
