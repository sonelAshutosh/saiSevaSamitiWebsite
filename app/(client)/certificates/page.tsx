'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { Award, Sparkles, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Section from '@/components/layout/Section'
import { getAllCertificates } from '@/app/admin/certificates/actions'

interface Certificate {
  id: string
  name: string
  issuedBy: string
  image: string
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setIsLoading(true)

        const result = await getAllCertificates()
        if (result.success && result.certificates) {
          setCertificates(result.certificates)
        }
      } catch (error) {
        console.error('Error fetching certificates:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCertificates()
  }, [])

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section gradient className="!py-20 md:!py-28">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge className="mx-auto w-fit gradient-accent">Recognition</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Our <span className="text-primary">Certificates</span> & Awards
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Honoring our dedication to community service with recognition from government and social
            organizations for our impactful initiatives.
          </p>
        </div>
      </Section>

      {/* Certificates Grid Section */}
      <Section shade="primary">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-80 w-full" />
                <CardContent className="p-6 space-y-2">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Award className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Certificates Found</h3>
            <p className="text-muted-foreground">
              Certificates and awards will be displayed here once available.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Our Achievements</h2>
                <p className="text-muted-foreground mt-1">
                  {certificates.length} {certificates.length === 1 ? 'certificate' : 'certificates'}{' '}
                  received
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((cert, index) => (
                <Card
                  key={cert.id}
                  className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedCertificate(cert)}
                >
                  {/* Certificate Image */}
                  <div className="relative h-80 bg-muted overflow-hidden">
                    {cert.image ? (
                      <Image
                        src={cert.image}
                        alt={cert.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Award className="h-24 w-24 text-muted-foreground/20" />
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <p className="text-white font-medium">Click to view</p>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <CardContent className="p-6 space-y-2">
                    <div className="flex items-start gap-2">
                      <Award className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg line-clamp-2">{cert.name}</h3>
                        {cert.issuedBy && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Issued by: {cert.issuedBy}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* Lightbox Modal */}
      {selectedCertificate && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in-0 duration-300"
          onClick={() => setSelectedCertificate(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 h-10 w-10 rounded-full"
            onClick={() => setSelectedCertificate(null)}
          >
            <X className="h-6 w-6" />
          </Button>

          <div
            className="max-w-4xl w-full max-h-[90vh] overflow-auto bg-card rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Certificate Image */}
            <div className="relative w-full h-[70vh] bg-muted">
              {selectedCertificate.image ? (
                <Image
                  src={selectedCertificate.image}
                  alt={selectedCertificate.name}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Award className="h-32 w-32 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 space-y-3 border-t">
              <h2 className="text-2xl font-bold">{selectedCertificate.name}</h2>
              {selectedCertificate.issuedBy && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Issued by:</span> {selectedCertificate.issuedBy}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      {!isLoading && certificates.length > 0 && (
        <Section className="gradient-secondary text-secondary-foreground">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold">Join Us in Making a Difference</h2>
            <p className="text-lg opacity-90">
              These recognitions inspire us to continue our mission of serving communities with
              dedication and compassion.
            </p>
          </div>
        </Section>
      )}
    </div>
  )
}
