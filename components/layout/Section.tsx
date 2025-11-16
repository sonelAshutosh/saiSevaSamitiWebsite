import React from 'react'
import { cn } from '@/lib/utils'

interface SectionProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
  id?: string
  gradient?: boolean
  shade?: 'primary' | 'secondary' | 'accent' | 'muted' | 'none'
}

export default function Section({
  children,
  className,
  containerClassName,
  id,
  gradient = false,
  shade,
}: SectionProps) {
  // Apply shade class based on prop or existing className
  const getShadeClass = () => {
    if (gradient || shade === 'none') return null
    if (shade) return `section-shade-${shade}`

    // If className already has a bg color, don't add shade
    if (className?.includes('bg-')) return null

    return null // No default shade, must be explicit
  }

  return (
    <section
      id={id}
      className={cn(
        'section-padding',
        gradient && 'hero-gradient',
        getShadeClass(),
        className
      )}
    >
      <div className={cn('container-custom', containerClassName)}>
        {children}
      </div>
    </section>
  )
}
