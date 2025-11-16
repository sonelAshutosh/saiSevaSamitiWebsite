'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Phone, Mail, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/about-us', label: 'About Us' },
  { href: '/campaigns', label: 'Campaigns' },
  { href: '/gallery', label: 'Gallery' },
  { href: '/certificates', label: 'Certificates' },
  { href: '/contact-us', label: 'Contact Us' },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [mobileMenuOpen])

  const isActive = (href: string) => pathname === href

  return (
    <>
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md shadow-md border-b border-border'
          : 'bg-background border-b border-border/50'
      }`}
    >
      {/* Top Bar - Contact Info */}
      <div className="border-b border-border/50 bg-muted/30">
        <div className="container-custom">
          <div className="flex items-center justify-between py-2 gap-2 text-sm">
            <div className="flex items-center gap-2 sm:gap-4">
              <a
                href="tel:+919460522700"
                className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                <span className="hidden sm:inline">+91 94605 22700</span>
              </a>
              <a
                href="mailto:saisevasamiti.nagaur@gmail.com"
                className="flex items-center gap-1 sm:gap-2 text-muted-foreground hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                <span className="hidden md:inline">saisevasamiti.nagaur@gmail.com</span>
              </a>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <Link href="/donate">
                <Button
                  size="sm"
                  className="gradient-secondary hover:opacity-90 transition-opacity"
                >
                  <Heart className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Donate Now</span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container-custom">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold text-xl text-primary hover:opacity-80 transition-opacity"
          >
            <div className="h-14 w-14 relative rounded-full overflow-hidden">
              <Image
                src="/images/logo-image.jpg"
                alt="Sai Seva Samiti Logo"
                fill
                className="object-cover"
                quality={100}
                priority
              />
            </div>
            <span className="hidden sm:inline">Sai Seva Samiti</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive(link.href)
                    ? 'text-primary font-semibold'
                    : 'text-foreground/80'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </nav>
      </div>
    </header>

      {/* Mobile Navigation - Full Screen */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-background">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Menu Content */}
          <div className="relative h-full flex flex-col animate-in slide-in-from-top-5 duration-300">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <Link
                href="/"
                className="flex items-center gap-2 font-bold text-xl text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="h-14 w-14 relative rounded-full overflow-hidden">
                  <Image
                    src="/images/logo-image.jpg"
                    alt="Sai Seva Samiti Logo"
                    fill
                    className="object-cover"
                    quality={100}
                    priority
                  />
                </div>
                <span>Sai Seva Samiti</span>
              </Link>
              <button
                className="p-2 rounded-md hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Navigation Links */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-2 gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-6 py-8 rounded-lg text-base font-medium transition-all text-center flex items-center justify-center ${
                      isActive(link.href)
                        ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                        : 'hover:bg-muted text-foreground/80 hover:scale-105'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Footer with Contact Info */}
            <div className="border-t border-border p-6 space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <a
                  href="tel:+919460522700"
                  className="flex items-center gap-4 px-4 py-3 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  <Phone className="h-5 w-5" />
                  <span>+91 94605 22700</span>
                </a>
                <a
                  href="mailto:saisevasamiti.nagaur@gmail.com"
                  className="flex items-center gap-4 px-4 py-3 rounded-lg bg-muted/50 text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  <Mail className="h-5 w-5" />
                  <span>saisevasamiti.nagaur@gmail.com</span>
                </a>
              </div>
              <Link href="/donate" onClick={() => setMobileMenuOpen(false)}>
                <Button size="lg" className="w-full gradient-secondary">
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
