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
import ParallaxHero from '@/components/layout/ParallaxHero'
import { toast } from 'sonner'
import { createContactSubmission } from '@/app/admin/contact-us/actions'
import { FadeIn } from '@/components/animations/FadeIn'
import { SlideIn } from '@/components/animations/SlideIn'
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerContainer'

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
      value: '+91 94605 22700',
      link: 'tel:+919460522700',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'saisevasamiti.nagaur@gmail.com',
      link: 'mailto:saisevasamiti.nagaur@gmail.com',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: MapPin,
      title: 'Address',
      value: 'Nagaur, Rajasthan 341001',
      link: 'https://maps.app.goo.gl/UWa7egPUuGz5jSnv8',
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
      <ParallaxHero imageSrc="/images/banner-image-bg.jpg" className="min-h-[500px] md:min-h-[600px]">
        <div className="container-custom py-20 md:py-28">
          <FadeIn delay={0.1}>
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge className="mx-auto w-fit bg-white/10 border-white/30 text-white hover:bg-white/20">Get In Touch</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Contact <span className="text-white/90">Us</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Have questions or want to get involved? We'd love to hear from you. Reach out and let's
                make a difference together.
              </p>
            </div>
          </FadeIn>
        </div>
      </ParallaxHero>

      {/* Contact Info Cards */}
      <Section shade="primary" className="!py-16">
        <StaggerContainer staggerDelay={0.08} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <StaggerItem key={index}>
              <Card className="hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full border-2 border-transparent hover:border-primary/20">
                <CardContent className="p-8 text-center space-y-4">
                  <div className={`h-16 w-16 rounded-2xl ${info.bgColor} mx-auto flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <info.icon className={`h-8 w-8 ${info.color}`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg mb-3">{info.title}</h3>
                    {info.link ? (
                      <a
                        href={info.link}
                        className="text-muted-foreground hover:text-primary transition-colors text-sm font-medium inline-flex items-center gap-1 group"
                      >
                        <span>{info.value}</span>
                      </a>
                    ) : (
                      <p className="text-muted-foreground text-sm leading-relaxed">{info.value}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </Section>

      {/* Contact Form Section */}
      <Section shade="accent">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mx-auto w-fit">
            Send a Message
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Get In Touch With Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have a question or want to learn more about our work? Fill out the form below and our team will get back to you as soon as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          {/* Left Column - Form */}
          <SlideIn direction="left" delay={0.1}>
            <Card className="border-2 h-full flex flex-col">
              <CardContent className="p-8 flex-1">
                <form onSubmit={handleSubmit} className="h-full flex flex-col">
                  <div className="space-y-6 flex-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                    <div className="space-y-2 flex-1 flex flex-col">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="resize-none flex-1"
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full gradient-primary mt-6"
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
              </CardContent>
            </Card>
          </SlideIn>

          {/* Right Column - Info */}
          <SlideIn direction="right" delay={0.2}>
            <Card className="border-2 border-primary/20 shadow-lg h-full flex flex-col">
              <CardContent className="p-8 space-y-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl font-bold mb-6">Why Contact Us?</h3>
                    <ul className="space-y-4">
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-muted-foreground leading-relaxed">Learn more about our programs and initiatives</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-muted-foreground leading-relaxed">Volunteer opportunities and how to get involved</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-muted-foreground leading-relaxed">Partnership and collaboration inquiries</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                        <span className="text-muted-foreground leading-relaxed">Donation information and support</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-6 border-t">
                    <div className="flex items-start gap-3 mb-3">
                      <Clock className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-semibold mb-2">Quick Response</h4>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          We aim to respond to all inquiries within 24-48 hours during business days. For urgent matters, please call us directly.
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
          </SlideIn>
        </div>
      </Section>

      {/* Map Section */}
      <Section shade="secondary">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mx-auto w-fit">
            Our Location
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">Visit Us</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Come visit our office to learn more about our work and how you can contribute to making a
            difference in the community.
          </p>
        </div>

        <FadeIn delay={0.1}>
          <Card className="overflow-hidden border-2 shadow-lg">
            <div className="w-full overflow-hidden rounded-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56774.207058347034!2d73.68332233393394!3d27.20696737680514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x396a9170adb7a653%3A0x6940f47129cdaa6e!2sNagaur%2C%20Rajasthan%20341001!5e0!3m2!1sen!2sin!4v1718101694882!5m2!1sen!2sin"
                width="100%"
                height="450"
                allowFullScreen
                loading="lazy"
                className="border-0 rounded-lg"
              ></iframe>
            </div>
          </Card>
        </FadeIn>
      </Section>

      {/* CTA Section */}
      <Section className="gradient-primary text-primary-foreground">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">We're Here to Help</h2>
          <p className="text-lg opacity-90 leading-relaxed">
            Whether you want to volunteer, make a donation, partner with us, or simply learn more about
            our work, we'd love to hear from you. Reach out today and join us in making a difference.
          </p>
        </div>
      </Section>
    </div>
  )
}
