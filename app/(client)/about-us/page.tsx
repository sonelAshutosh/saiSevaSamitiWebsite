'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Target, Eye, Heart, Users, Award, Sparkles, UserCheck } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import Section from '@/components/layout/Section'
import { getAllMembers } from '@/app/admin/members/actions'
import { getAllVolunteers } from '@/app/admin/volunteers/actions'

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)

        // Fetch members
        const membersResult = await getAllMembers()
        if (membersResult.success && membersResult.members) {
          const activeMembers = membersResult.members.filter((m) => m.isActive)
          setMembers(activeMembers)
        }

        // Fetch volunteers
        const volunteersResult = await getAllVolunteers()
        if (volunteersResult.success && volunteersResult.volunteers) {
          const activeVolunteers = volunteersResult.volunteers.filter(
            (v) => v.isActive && v.showInList
          )
          setVolunteers(activeVolunteers)
        }
      } catch (error) {
        console.error('Error fetching about us data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const services = [
    {
      title: 'Food Distribution',
      description:
        'Regular food drives addressing hunger in communities and hospitals, ensuring nutritious meals reach those who need them most.',
      icon: '🍽️',
      color: 'bg-primary/10 text-primary',
    },
    {
      title: 'Medical Assistance',
      description:
        'Free medical camps, health checkups, and medicine distribution providing healthcare access to underprivileged populations.',
      icon: '🏥',
      color: 'bg-secondary/10 text-secondary',
    },
    {
      title: 'Awareness Campaigns',
      description:
        'Educational workshops on health, hygiene, and social issues empowering communities with knowledge and resources.',
      icon: '📢',
      color: 'bg-accent/10 text-accent',
    },
  ]

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
      <Section gradient className="!py-20 md:!py-28">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge className="mx-auto w-fit gradient-primary">About Our Organization</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Help the <span className="text-primary">Helpless</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Sai Seva Samiti is a non-profit organization dedicated to serving humanity with
            compassion, providing essential services and support to those who need it most.
          </p>
        </div>
      </Section>

      {/* Mission & Vision Section */}
      <Section shade="primary">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Our Mission</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                To serve humanity with compassion and dedication, providing essential services such
                as food distribution, medical assistance, and awareness campaigns. We strive to
                create lasting positive change in communities and touch lives with hope and support.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-accent/20 shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8 space-y-4">
              <div className="h-16 w-16 rounded-2xl bg-accent/10 flex items-center justify-center">
                <Eye className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold">Our Vision</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                A world where every individual has access to basic necessities, healthcare, and
                opportunities for growth, regardless of their socio-economic background. We envision
                healthy, empowered communities thriving together.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* What We Do Section */}
      <Section shade="accent">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mx-auto w-fit">
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">What Are We Doing</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our commitment guides every action, every volunteer, and every life we touch through
            these dedicated programs.
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
                <div
                  className={`h-16 w-16 rounded-2xl ${service.color} flex items-center justify-center text-4xl`}
                >
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {values.map((value, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow">
              <CardContent className="p-8 space-y-4">
                <div className="h-16 w-16 mx-auto rounded-full bg-muted flex items-center justify-center">
                  <value.icon className={`h-8 w-8 ${value.color}`} />
                </div>
                <h3 className="text-xl font-semibold">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
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
            {[1, 2, 3, 4].map((i) => (
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
        <Section shade="muted">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Team
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Members</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Dedicated leaders committed to making a positive impact in the community through
              service and compassion.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {members.map((member, index) => (
              <Card
                key={member.id}
                className="hover:shadow-lg transition-shadow animate-in fade-in-50"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="h-40 w-40 mx-auto rounded-full bg-muted overflow-hidden relative">
                    {member.image ? (
                      <Image src={member.image} alt={member.name} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <UserCheck className="h-20 w-20 text-muted-foreground/50" />
                      </div>
                    )}
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    {member.designation && (
                      <p className="text-sm text-primary font-medium">{member.designation}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* Volunteers Section */}
      {isLoading ? (
        <Section shade="primary">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Volunteers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Volunteers</h2>
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
        <Section shade="primary">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Volunteers
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Meet Our Volunteers</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Passionate individuals volunteering their time and skills to serve the community and
              make a difference.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {volunteers.map((volunteer, index) => (
              <Card
                key={volunteer.id}
                className="hover:shadow-lg transition-shadow animate-in fade-in-50"
                style={{ animationDelay: `${index * 50}ms` }}
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
                    <h3 className="font-semibold text-lg">{volunteer.name}</h3>
                    {volunteer.role && (
                      <p className="text-sm text-muted-foreground">{volunteer.role}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : null}

      {/* CTA Section */}
      <Section className="gradient-secondary text-secondary-foreground">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">Join Our Mission</h2>
          <p className="text-lg opacity-90">
            Whether through donations, volunteering, or spreading awareness, you can be part of the
            change. Together, we can build a better tomorrow.
          </p>
        </div>
      </Section>
    </div>
  )
}
