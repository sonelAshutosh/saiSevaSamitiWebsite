'use client'

import React, { useState } from 'react'
import { Phone, Mail, MapPin, Send, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import Section from '@/components/layout/Section'
import { toast } from 'sonner'
import { createContactSubmission } from '@/app/admin/contact-us/actions'

export default function ContactUsPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSubmitting(true)

    try {
      toast.loading('Sending message...', { id: 'contact-submit' })

      const result = await createContactSubmission({
        ...formData,
        date: new Date().toISOString(),
      })

      if (result.success) {
        toast.success('Message sent successfully!', {
          id: 'contact-submit',
          description: 'We will get back to you soon.',
        })

        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
        })
      } else {
        toast.error('Failed to send message', {
          id: 'contact-submit',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to send message', {
        id: 'contact-submit',
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 98765 43210',
      link: 'tel:+919876543210',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'contact@saiseva.org',
      link: 'mailto:contact@saiseva.org',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: '123 Seva Street, Mumbai, Maharashtra 400001',
      link: null,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Clock,
      title: 'Working Hours',
      value: 'Mon-Sat: 9:00 AM - 6:00 PM',
      link: null,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
  ]

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <Section gradient className="!py-20 md:!py-28">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <Badge className="mx-auto w-fit gradient-primary">Get In Touch</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Have questions or want to get involved? We'd love to hear from you. Reach out and let's
            make a difference together.
          </p>
        </div>
      </Section>

      {/* Contact Info Cards */}
      <Section className="!py-12" shade="primary">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow animate-in fade-in-50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6 text-center space-y-4">
                <div className={`h-16 w-16 rounded-full ${info.bgColor} mx-auto flex items-center justify-center`}>
                  <info.icon className={`h-8 w-8 ${info.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">{info.title}</h3>
                  {info.link ? (
                    <a
                      href={info.link}
                      className="text-muted-foreground hover:text-primary transition-colors text-sm"
                    >
                      {info.value}
                    </a>
                  ) : (
                    <p className="text-muted-foreground text-sm">{info.value}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      {/* Contact Form Section */}
      <Section shade="accent">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Column - Form */}
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold mb-2">Send Us a Message</h2>
              <p className="text-muted-foreground">
                Fill out the form below and we'll get back to you as soon as possible.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject *</Label>
                <Input
                  id="subject"
                  type="text"
                  placeholder="How can we help you?"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  disabled={isSubmitting}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your inquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={6}
                  className="resize-none"
                  disabled={isSubmitting}
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full gradient-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>Sending...</>
                ) : (
                  <>
                    <Send className="mr-2 h-5 w-5" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-8">
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold mb-4">Why Contact Us?</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <span>Learn more about our programs and initiatives</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <span>Volunteer opportunities and how to get involved</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <span>Partnership and collaboration inquiries</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                      </div>
                      <span>Donation information and support</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="font-semibold mb-3">Quick Response</h4>
                  <p className="text-sm text-muted-foreground">
                    We aim to respond to all inquiries within 24-48 hours during business days. For
                    urgent matters, please call us directly.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      {/* Map Section - Placeholder */}
      <Section shade="secondary">
        <div className="text-center space-y-4 mb-8">
          <h2 className="text-3xl font-bold">Visit Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Come visit our office to learn more about our work and how you can contribute to making a
            difference in the community.
          </p>
        </div>

        <Card className="overflow-hidden">
          <div className="relative h-[400px] bg-muted flex items-center justify-center">
            <div className="text-center space-y-2">
              <MapPin className="h-16 w-16 text-muted-foreground/50 mx-auto" />
              <p className="text-muted-foreground">Map integration placeholder</p>
              <p className="text-sm text-muted-foreground">123 Seva Street, Mumbai, Maharashtra 400001</p>
            </div>
          </div>
        </Card>
      </Section>
    </div>
  )
}
