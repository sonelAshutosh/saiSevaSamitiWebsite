'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { ImageIcon, Sparkles, Search, X, Calendar } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Section from '@/components/layout/Section'
import { getAllGalleryImages } from '@/app/admin/gallery/actions'

interface GalleryImage {
  id: string
  imgTitle: string
  description: string
  image: string
  date: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true)

        const result = await getAllGalleryImages()
        if (result.success && result.images) {
          setImages(result.images)
          setFilteredImages(result.images)
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredImages(images)
    } else {
      const filtered = images.filter(
        (img) =>
          img.imgTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          img.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      setFilteredImages(filtered)
    }
  }, [searchQuery, images])

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
          <Badge className="mx-auto w-fit gradient-accent">Our Memories</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Photo <span className="text-primary">Gallery</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Capturing moments of compassion, service, and community impact through our various
            initiatives and campaigns.
          </p>
        </div>
      </Section>

      {/* Search Section */}
      <Section className="!py-8" shade="primary">
        <div className="max-w-2xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search gallery by title or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-base"
            />
          </div>
        </div>
      </Section>

      {/* Gallery Grid Section */}
      <Section shade="accent">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </Card>
            ))}
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Images Found</h3>
            <p className="text-muted-foreground">
              {searchQuery
                ? `No images match "${searchQuery}". Try a different search term.`
                : 'No images available in the gallery yet. Check back soon!'}
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Our Gallery</h2>
                <p className="text-muted-foreground mt-1">
                  Showing {filteredImages.length} {filteredImages.length === 1 ? 'image' : 'images'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((img, index) => (
                <Card
                  key={img.id}
                  className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 30}ms` }}
                  onClick={() => setSelectedImage(img)}
                >
                  {/* Image */}
                  <div className="relative h-64 bg-muted overflow-hidden">
                    {img.image ? (
                      <Image
                        src={img.image}
                        alt={img.imgTitle}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Sparkles className="h-16 w-16 text-muted-foreground/20" />
                      </div>
                    )}
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <p className="text-white font-medium">Click to view</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg line-clamp-1">{img.imgTitle}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{img.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 animate-in fade-in-0 duration-300"
          onClick={() => setSelectedImage(null)}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 h-10 w-10 rounded-full"
            onClick={() => setSelectedImage(null)}
          >
            <X className="h-6 w-6" />
          </Button>

          <div
            className="max-w-6xl w-full max-h-[90vh] overflow-auto bg-card rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Image */}
            <div className="relative w-full h-[60vh] bg-muted">
              {selectedImage.image ? (
                <Image
                  src={selectedImage.image}
                  alt={selectedImage.imgTitle}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="h-24 w-24 text-muted-foreground/20" />
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-6 space-y-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedImage.imgTitle}</h2>
                <p className="text-muted-foreground leading-relaxed">{selectedImage.description}</p>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4 border-t">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(selectedImage.date)}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
