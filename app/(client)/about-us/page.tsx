'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Target,
  Eye,
  Heart,
  Users,
  Award,
  Sparkles,
  UserCheck,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Section from '@/components/layout/Section'
import ParallaxHero from '@/components/layout/ParallaxHero'
import { getMembersPaginated } from '@/app/admin/members/actions'
import { getVolunteersPaginated } from '@/app/admin/volunteers/actions'
import { FadeIn } from '@/components/animations/FadeIn'
import { SlideIn } from '@/components/animations/SlideIn'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/StaggerContainer'

interface Member {
  id: string
  name: string
  designation?: string
  image?: string
  phone: string
  email: string
}

interface Volunteer {
  id: string
  name: string
  role?: string
  image?: string
}

export default function AboutUsPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [membersLoading, setMembersLoading] = useState(false)
  const [volunteersLoading, setVolunteersLoading] = useState(false)

  // Pagination states
  const [membersPage, setMembersPage] = useState(1)
  const [membersTotalPages, setMembersTotalPages] = useState(1)
  const [volunteersPage, setVolunteersPage] = useState(1)
  const [volunteersTotalPages, setVolunteersTotalPages] = useState(1)

  // Fetch members when page changes
  useEffect(() => {
    const fetchMembers = async () => {
      setMembersLoading(true)
      try {
        const membersResult = await getMembersPaginated(membersPage, 8, true)
        if (membersResult.success && membersResult.members) {
          setMembers(membersResult.members)
          setMembersTotalPages(membersResult.totalPages || 1)
          // Scroll to members section on page change
          if (membersPage > 1) {
            document
              .getElementById('members-section')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      } catch (error) {
        console.error('Error fetching members:', error)
      } finally {
        setMembersLoading(false)
      }
    }

    fetchMembers()
  }, [membersPage])

  // Fetch volunteers when page changes
  useEffect(() => {
    const fetchVolunteers = async () => {
      setVolunteersLoading(true)
      try {
        const volunteersResult = await getVolunteersPaginated(
          volunteersPage,
          4,
          true,
          true
        )
        if (volunteersResult.success && volunteersResult.volunteers) {
          setVolunteers(volunteersResult.volunteers)
          setVolunteersTotalPages(volunteersResult.totalPages || 1)
          // Scroll to volunteers section on page change
          if (volunteersPage > 1) {
            document
              .getElementById('volunteers-section')
              ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
          }
        }
      } catch (error) {
        console.error('Error fetching volunteers:', error)
      } finally {
        setVolunteersLoading(false)
      }
    }

    fetchVolunteers()
  }, [volunteersPage])

  // Initial loading state management
  useEffect(() => {
    if (!membersLoading && !volunteersLoading) {
      setIsLoading(false)
    }
  }, [membersLoading, volunteersLoading])

  const values = [
    {
      title: 'Compassion',
      description: 'We serve with empathy and understanding',
      icon: Heart,
      color: 'text-destructive',
    },
    {
      title: 'Integrity',
      description: 'Transparent and honest in all our actions',
      icon: Award,
      color: 'text-primary',
    },
    {
      title: 'Community',
      description: 'Building stronger, healthier communities',
      icon: Users,
      color: 'text-accent',
    },
  ]

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <ParallaxHero
        imageSrc="/images/about-us-image.jpg"
        className="min-h-[500px] md:min-h-[600px]"
      >
        <div className="container-custom py-20 md:py-28">
          <FadeIn delay={0.1}>
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge className="mx-auto w-fit bg-white/10 border-white/30 text-white hover:bg-white/20">
                About Our Organization
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Help the <span className="text-white/90">Helpless</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Sai Seva Samiti is a non-profit organization dedicated to
                serving humanity with compassion, providing essential services
                and support to those who need it most.
              </p>
            </div>
          </FadeIn>
        </div>
      </ParallaxHero>

      {/* Mission & Vision Section */}
      <Section shade="primary">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <SlideIn direction="left" delay={0.1}>
            <Card className="border-2 border-primary/20 shadow-lg h-full">
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
          </SlideIn>

          <FadeIn delay={0.15}>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src="/images/know-about.jpg"
                alt="Our Mission and Vision"
                fill
                className="object-cover"
              />
            </div>
          </FadeIn>

          <SlideIn direction="right" delay={0.2}>
            <Card className="border-2 border-accent/20 shadow-lg h-full">
              <CardContent className="p-8 space-y-4">
                <div className="h-14 w-14 rounded-full bg-accent/10 flex items-center justify-center">
                  <Eye className="h-7 w-7 text-accent" />
                </div>
                <h3 className="text-2xl font-bold">Our Vision</h3>
                <p className="text-muted-foreground leading-relaxed">
                  A world where every individual has access to basic
                  necessities, healthcare, and opportunities for growth,
                  regardless of their socio-economic background.
                </p>
              </CardContent>
            </Card>
          </SlideIn>
        </div>
      </Section>

      {/* Our Values Section */}
      <Section shade="secondary">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mx-auto w-fit">
            Core Values
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">What We Stand For</h2>
        </div>

        <StaggerContainer
          staggerDelay={0.15}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {values.map((value, index) => (
            <StaggerItem key={index}>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-8 space-y-4">
                  <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                    <value.icon className={`h-8 w-8 ${value.color}`} />
                  </div>
                  <h3 className="text-xl font-semibold">{value.title}</h3>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* Team Members Section */}
      {isLoading ? (
        <Section shade="muted">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Members</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-40 w-40 rounded-full mx-auto" />
                  <div className="space-y-2 text-center">
                    <Skeleton className="h-5 w-32 mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : members.length > 0 ? (
        <Section shade="muted" id="members-section">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Members</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dedicated leaders committed to making a positive impact in the
              community through service and compassion.
            </p>
          </div>

          <div className="relative">
            {membersLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg min-h-[400px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading members...
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {members.map((member) => (
                <Card
                  key={member.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="h-40 w-40 mx-auto rounded-full bg-muted overflow-hidden relative">
                      {member.image ? (
                        <Image
                          src={member.image}
                          alt={member.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <UserCheck className="h-20 w-20 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="font-semibold text-lg">{member.name}</h3>
                      {member.designation && (
                        <p className="text-sm text-primary font-medium">
                          {member.designation}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {membersTotalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setMembersPage((prev) => Math.max(prev - 1, 1))}
                disabled={membersPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {membersPage} of {membersTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setMembersPage((prev) =>
                    Math.min(prev + 1, membersTotalPages)
                  )
                }
                disabled={membersPage === membersTotalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </Section>
      ) : null}

      {/* Volunteers Section */}
      {isLoading ? (
        <Section shade="primary">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Volunteers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Meet Our Volunteers
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 space-y-4">
                  <Skeleton className="h-32 w-32 rounded-full mx-auto" />
                  <div className="space-y-2 text-center">
                    <Skeleton className="h-5 w-32 mx-auto" />
                    <Skeleton className="h-4 w-24 mx-auto" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : volunteers.length > 0 ? (
        <Section shade="primary" id="volunteers-section">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Volunteers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Meet Our Volunteers
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals volunteering their time and skills to serve
              the community and make a difference.
            </p>
          </div>

          <div className="relative">
            {volunteersLoading && (
              <div className="absolute inset-0 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-lg min-h-[300px]">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
                  <p className="text-sm text-muted-foreground">
                    Loading volunteers...
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {volunteers.map((volunteer) => (
                <Card
                  key={volunteer.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="h-32 w-32 mx-auto rounded-full bg-muted overflow-hidden relative">
                      {volunteer.image ? (
                        <Image
                          src={volunteer.image}
                          alt={volunteer.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Users className="h-16 w-16 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                    <div className="text-center space-y-1">
                      <h3 className="font-semibold text-lg">
                        {volunteer.name}
                      </h3>
                      {volunteer.role && (
                        <p className="text-sm text-muted-foreground">
                          {volunteer.role}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {volunteersTotalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setVolunteersPage((prev) => Math.max(prev - 1, 1))
                }
                disabled={volunteersPage === 1}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {volunteersPage} of {volunteersTotalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setVolunteersPage((prev) =>
                    Math.min(prev + 1, volunteersTotalPages)
                  )
                }
                disabled={volunteersPage === volunteersTotalPages}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          )}
        </Section>
      ) : null}

      {/* CTA Section */}
      <Section className="gradient-secondary text-secondary-foreground">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Join Our Mission</h2>
          <p className="text-lg opacity-90">
            Whether through donations, volunteering, or spreading awareness, you
            can be part of the change. Together, we can build a better tomorrow.
          </p>
        </div>
      </Section>
    </div>
  )
}
