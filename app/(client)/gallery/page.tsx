'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  ImageIcon,
  Sparkles,
  X,
  Calendar,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import Section from '@/components/layout/Section'
import ParallaxHero from '@/components/layout/ParallaxHero'
import { getAllGalleryImages } from '@/app/admin/gallery/actions'
import { FadeIn } from '@/components/animations/FadeIn'

interface GalleryImage {
  id: string
  imgTitle: string
  description: string
  image: string
  date: string
}

interface Album {
  dateKey: string
  images: GalleryImage[]
  coverImage: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [albums, setAlbums] = useState<Album[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setIsLoading(true)

        const result = await getAllGalleryImages()
        if (result.success && result.images) {
          setImages(result.images)

          // Group images by date only (ignore time)
          const albumMap = new Map<string, GalleryImage[]>()

          result.images.forEach((img) => {
            try {
              // Extract date only (YYYY-MM-DD format)
              const imgDate = new Date(img.date)

              // Check if date is valid
              if (isNaN(imgDate.getTime())) {
                console.error(
                  'Invalid image date:',
                  img.date,
                  'for image:',
                  img.id
                )
                return
              }

              const dateOnly = imgDate.toISOString().split('T')[0]
              if (!albumMap.has(dateOnly)) {
                albumMap.set(dateOnly, [])
              }
              albumMap.get(dateOnly)?.push(img)
            } catch (error) {
              console.error('Error processing image date:', img.date, error)
            }
          })

          // Convert to Album array
          const albumsArray: Album[] = Array.from(albumMap.entries()).map(
            ([dateKey, imgs]) => ({
              dateKey: dateKey, // Store the ISO date
              images: imgs,
              coverImage: imgs[0].image,
            })
          )

          // Sort albums by date (newest first)
          albumsArray.sort(
            (a, b) =>
              new Date(b.dateKey).getTime() - new Date(a.dateKey).getTime()
          )

          setAlbums(albumsArray)
        }
      } catch (error) {
        console.error('Error fetching gallery images:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchImages()
  }, [])

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString)
        return dateString
      }

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    } catch (error) {
      console.error('Error formatting date:', dateString, error)
      return dateString
    }
  }

  const openAlbum = (album: Album) => {
    setSelectedAlbum(album)
    setCurrentImageIndex(0)
  }

  const closeCarousel = () => {
    setSelectedAlbum(null)
    setCurrentImageIndex(0)
  }

  const nextImage = () => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) =>
        prev === selectedAlbum.images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (selectedAlbum) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedAlbum.images.length - 1 : prev - 1
      )
    }
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedAlbum) {
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'ArrowRight') nextImage()
        if (e.key === 'Escape') closeCarousel()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedAlbum, currentImageIndex])

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <ParallaxHero
        imageSrc="/images/hero-section-3.jpg"
        className="min-h-[500px] md:min-h-[600px]"
      >
        <div className="container-custom py-20 md:py-28">
          <FadeIn delay={0.1}>
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge className="mx-auto w-fit bg-white/10 border-white/30 text-white hover:bg-white/20">
                Our Memories
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Photo <span className="text-white/90">Gallery</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Capturing moments of compassion, service, and community impact
                through our various initiatives and campaigns.
              </p>
            </div>
          </FadeIn>
        </div>
      </ParallaxHero>

      {/* Albums Grid Section */}
      <Section shade="accent">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-64 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </Card>
            ))}
          </div>
        ) : albums.length === 0 ? (
          <div className="text-center py-16">
            <div className="h-24 w-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No Albums Found</h3>
            <p className="text-muted-foreground">
              No albums available in the gallery yet. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold">Our Albums</h2>
                <p className="text-muted-foreground mt-1">
                  Showing {albums.length}{' '}
                  {albums.length === 1 ? 'album' : 'albums'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {albums.map((album, index) => (
                <FadeIn key={album.dateKey} delay={index * 0.05}>
                  <Card
                    className="overflow-hidden group cursor-pointer hover:shadow-xl transition-all duration-300"
                    onClick={() => openAlbum(album)}
                  >
                    {/* Album Cover */}
                    <div className="relative h-64 bg-muted overflow-hidden">
                      {album.coverImage ? (
                        <Image
                          src={album.coverImage}
                          alt={formatDate(album.dateKey)}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Sparkles className="h-16 w-16 text-muted-foreground/20" />
                        </div>
                      )}
                      {/* Overlay on hover */}
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center">
                        <p className="text-white font-medium text-lg mb-2">
                          Click to view
                        </p>
                        <Badge variant="secondary">
                          {album.images.length}{' '}
                          {album.images.length === 1 ? 'photo' : 'photos'}
                        </Badge>
                      </div>
                    </div>

                    {/* Album Info */}
                    <div className="p-4 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-primary" />
                        <span className="font-semibold text-lg">
                          {formatDate(album.dateKey)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {album.images.length}{' '}
                        {album.images.length === 1 ? 'photo' : 'photos'}
                      </p>
                    </div>
                  </Card>
                </FadeIn>
              ))}
            </div>
          </>
        )}
      </Section>

      {/* Carousel Modal */}
      {selectedAlbum && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={closeCarousel}
        >
          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20 h-10 w-10 rounded-full z-10"
            onClick={closeCarousel}
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Album Title */}
          <div className="absolute top-4 left-4 text-white z-10">
            <h2 className="text-2xl font-bold">
              {formatDate(selectedAlbum.dateKey)}
            </h2>
            <p className="text-sm text-white/70">
              {currentImageIndex + 1} / {selectedAlbum.images.length}
            </p>
          </div>

          {/* Previous Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full z-10"
            onClick={(e) => {
              e.stopPropagation()
              prevImage()
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          {/* Image Container */}
          <div
            className="relative w-full max-w-5xl h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative w-full h-full">
              <Image
                src={selectedAlbum.images[currentImageIndex].image}
                alt={formatDate(selectedAlbum.dateKey)}
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20 h-12 w-12 rounded-full z-10"
            onClick={(e) => {
              e.stopPropagation()
              nextImage()
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-4 py-2 bg-black/50 rounded-lg">
            {selectedAlbum.images.map((img, index) => (
              <button
                key={img.id}
                className={`relative h-16 w-16 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                  index === currentImageIndex
                    ? 'border-white scale-110'
                    : 'border-transparent hover:border-white/50'
                }`}
                onClick={(e) => {
                  e.stopPropagation()
                  setCurrentImageIndex(index)
                }}
              >
                <Image
                  src={img.image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
