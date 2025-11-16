'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ParallaxHeroProps {
  children: React.ReactNode
  imageSrc: string
  imageAlt?: string
  overlay?: boolean
  overlayOpacity?: number
  className?: string
}

export default function ParallaxHero({
  children,
  imageSrc,
  imageAlt = 'Hero background',
  overlay = true,
  overlayOpacity = 60,
  className,
}: ParallaxHeroProps) {
  return (
    <section className={cn('relative overflow-hidden', className)}>
      {/* Parallax Background with Fixed Attachment */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `url(${imageSrc})`,
          backgroundAttachment: 'fixed',
          backgroundPosition: 'center center',
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
        }}
        role="img"
        aria-label={imageAlt}
      />

      {/* Overlay */}
      {overlay && (
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 -z-[5]"
          style={{ opacity: overlayOpacity / 100 }}
        />
      )}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </section>
  )
}
