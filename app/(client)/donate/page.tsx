'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import {
  Heart,
  CreditCard,
  Building2,
  Smartphone,
  Trophy,
  ArrowRight,
  Info,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Section from '@/components/layout/Section'
import ParallaxHero from '@/components/layout/ParallaxHero'
import { toast } from 'sonner'
import { getAllDonators, createDonator } from '@/app/admin/donators/actions'
import { FadeIn } from '@/components/animations/FadeIn'
import { SlideIn } from '@/components/animations/SlideIn'
import { ScaleIn } from '@/components/animations/ScaleIn'
import {
  StaggerContainer,
  StaggerItem,
} from '@/components/animations/StaggerContainer'

interface Donator {
  id: string
  name: string
  amount: number
  date: string
  isVerified: boolean
}

export default function DonatePage() {
  const [topDonators, setTopDonators] = useState<Donator[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    amount: '',
    paymentMode: '',
    transactionId: '',
  })

  useEffect(() => {
    const fetchDonators = async () => {
      try {
        setIsLoading(true)

        const result = await getAllDonators()
        if (result.success && result.donators) {
          // Get verified donators, sort by amount, take top 10
          const verifiedDonators = result.donators
            .filter((d) => d.isVerified)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 10)
            .map((d) => ({
              id: d.id,
              name: d.name,
              amount: d.amount,
              date: d.date,
              isVerified: d.isVerified,
            }))
          setTopDonators(verifiedDonators)
        }
      } catch (error) {
        console.error('Error fetching donators:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDonators()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (
      !formData.name ||
      !formData.email ||
      !formData.amount ||
      !formData.transactionId
    ) {
      toast.error('Please fill in all required fields')
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error('Please enter a valid email address')
      return
    }

    const amount = parseFloat(formData.amount)
    if (isNaN(amount) || amount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsSubmitting(true)

    try {
      toast.loading('Submitting donation details...', { id: 'donate-submit' })

      const result = await createDonator({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        amount: amount,
        paymentMode: formData.paymentMode,
        transactionId: formData.transactionId,
        date: new Date().toISOString(),
        isVerified: false, // Will be verified by admin
      })

      if (result.success) {
        toast.success('Donation details submitted!', {
          id: 'donate-submit',
          description: 'Your donation will be verified by our team shortly.',
        })

        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          amount: '',
          paymentMode: '',
          transactionId: '',
        })
      } else {
        toast.error('Failed to submit donation', {
          id: 'donate-submit',
          description: result.message,
        })
      }
    } catch (error) {
      toast.error('Failed to submit donation', {
        id: 'donate-submit',
        description: 'Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
      })
    } catch {
      return dateString
    }
  }

  const paymentMethods = [
    {
      icon: Smartphone,
      title: 'UPI Payment',
      description: 'Scan the QR code using any UPI app',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: Building2,
      title: 'Bank Transfer',
      description: 'Direct transfer to our account',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: CreditCard,
      title: 'Online Payment',
      description: 'Use your debit/credit card',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ]

  const bankDetails = [
    { label: 'Account Name', value: 'Sainyee Sewa Samitti' },
    { label: 'Bank Name', value: 'State Bank of India' },
    { label: 'Account Number', value: '61050682251' },
    { label: 'IFSC Code', value: 'SBIN0031528' },
    { label: 'Branch', value: 'Nagaur K.U.M' },
  ]

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <ParallaxHero
        imageSrc="/images/donate-now.jpg"
        className="min-h-[500px] md:min-h-[600px]"
      >
        <div className="container-custom py-20 md:py-28">
          <FadeIn delay={0.1}>
            <div className="text-center space-y-6 max-w-4xl mx-auto">
              <Badge className="mx-auto w-fit gradient-primary">
                Make a Difference
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white">
                Support Our <span className="text-primary">Mission</span>
              </h1>
              <p className="text-lg md:text-xl text-white/90 leading-relaxed">
                Your generous contribution helps us provide food, medical aid,
                and hope to those who need it most. Every donation makes a
                meaningful impact in someone's life.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <div className="px-6 py-3 rounded-lg bg-white/10 border border-white/30 backdrop-blur-sm">
                  <p className="text-sm text-white">100% Transparent</p>
                </div>
                <div className="px-6 py-3 rounded-lg bg-white/10 border border-white/30 backdrop-blur-sm">
                  <p className="text-sm text-white">Tax Exemption Available</p>
                </div>
                <div className="px-6 py-3 rounded-lg bg-white/10 border border-white/30 backdrop-blur-sm">
                  <p className="text-sm text-white">Verified Organization</p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </ParallaxHero>

      {/* Payment Methods Section */}
      <Section shade="primary">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="outline" className="mx-auto w-fit">
            Donation Methods
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold">How to Donate</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose your preferred payment method and make a secure donation
          </p>
        </div>

        <StaggerContainer
          staggerDelay={0.1}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {paymentMethods.map((method, index) => (
            <StaggerItem key={index}>
              <Card className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6 space-y-4">
                  <div
                    className={`h-16 w-16 rounded-full ${method.bgColor} mx-auto flex items-center justify-center`}
                  >
                    <method.icon className={`h-8 w-8 ${method.color}`} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-2">
                      {method.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {method.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Payment Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* QR Code Card */}
          <SlideIn direction="left" delay={0.1}>
            <Card className="border-2 border-primary/20">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">UPI Payment</h3>
                    <p className="text-sm text-muted-foreground">
                      Scan & Pay Instantly
                    </p>
                  </div>
                </div>

                <div className="bg-muted rounded-lg p-8 flex items-center justify-center">
                  <div className="bg-white p-4 rounded-lg shadow-lg">
                    <div className="relative h-64 w-64">
                      <Image
                        src="/images/qr.jpg"
                        alt="UPI QR Code for donations"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="space-y-2">
                <p className="text-sm font-medium">UPI ID:</p>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <code className="text-sm font-mono">saiseva@upi</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText('saiseva@upi')
                      toast.success('UPI ID copied to clipboard')
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div> */}
              </CardContent>
            </Card>
          </SlideIn>

          {/* Bank Details Card */}
          <SlideIn direction="right" delay={0.2}>
            <Card className="border-2 border-secondary/20">
              <CardContent className="p-8 space-y-6">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-secondary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Bank Transfer</h3>
                    <p className="text-sm text-muted-foreground">
                      Direct Account Transfer
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {bankDetails.map((detail, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-muted rounded-lg"
                    >
                      <span className="text-sm text-muted-foreground">
                        {detail.label}
                      </span>
                      <span className="text-sm font-semibold">
                        {detail.value}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <div className="flex items-start gap-2 p-3 bg-warning/10 rounded-lg">
                    <Info className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-muted-foreground">
                      Please use your name as reference and save the transaction
                      receipt for verification.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </SlideIn>
        </div>
      </Section>

      {/* Donation Form Section */}
      <Section shade="accent">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Submit Your Donation
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">
              Complete Your Donation
            </h2>
            <p className="text-muted-foreground">
              After making the payment, please fill out this form so we can
              verify and acknowledge your contribution.
            </p>
          </div>

          <ScaleIn delay={0.1}>
            <Card className="border-2">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
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
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Donation Amount (₹) *</Label>
                      <Input
                        id="amount"
                        type="number"
                        placeholder="1000"
                        min="1"
                        step="1"
                        value={formData.amount}
                        onChange={(e) =>
                          setFormData({ ...formData, amount: e.target.value })
                        }
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="paymentMode">Payment Mode</Label>
                      <Select
                        value={formData.paymentMode}
                        onValueChange={(value) =>
                          setFormData({ ...formData, paymentMode: value })
                        }
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="UPI">UPI</SelectItem>
                          <SelectItem value="Bank Transfer">
                            Bank Transfer
                          </SelectItem>
                          <SelectItem value="Credit Card">
                            Credit Card
                          </SelectItem>
                          <SelectItem value="Debit Card">Debit Card</SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="transactionId">
                        Transaction ID / Reference Number *
                      </Label>
                      <Input
                        id="transactionId"
                        type="text"
                        placeholder="TXN123456789"
                        value={formData.transactionId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            transactionId: e.target.value,
                          })
                        }
                        disabled={isSubmitting}
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="p-4 bg-muted rounded-lg mb-4">
                      <p className="text-sm text-muted-foreground">
                        <strong>Note:</strong> Your donation will be verified by
                        our team within 24-48 hours. You will receive a
                        confirmation email once verified. Please keep your
                        transaction receipt for reference.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full gradient-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>Submitting...</>
                      ) : (
                        <>
                          <Heart className="mr-2 h-5 w-5" />
                          Submit Donation Details
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </ScaleIn>
        </div>
      </Section>

      {/* Top Donators Section */}
      {isLoading ? (
        <Section shade="secondary">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Supporters
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Top Donors</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Card key={i}>
                <CardContent className="p-6 flex items-center justify-between">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-6 w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>
      ) : topDonators.length > 0 ? (
        <Section shade="secondary">
          <div className="text-center space-y-4 mb-12">
            <Badge variant="outline" className="mx-auto w-fit">
              Our Supporters
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Top Donors</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're grateful to these generous supporters who have made
              significant contributions to our mission.
            </p>
          </div>

          <StaggerContainer
            staggerDelay={0.05}
            className="max-w-4xl mx-auto space-y-4"
          >
            {topDonators.map((donor, index) => (
              <StaggerItem key={donor.id}>
                <Card
                  className={`hover:shadow-lg transition-all duration-300 ${
                    index < 3 ? 'border-2 border-primary/30' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div
                          className={`h-12 w-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                            index === 0
                              ? 'bg-yellow-500/20 text-yellow-600'
                              : index === 1
                              ? 'bg-gray-400/20 text-gray-600'
                              : index === 2
                              ? 'bg-orange-500/20 text-orange-600'
                              : 'bg-primary/10 text-primary'
                          }`}
                        >
                          {index < 3 ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <Heart className="h-5 w-5" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">
                            {donor.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Donated in {formatDate(donor.date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">
                          {formatCurrency(donor.amount)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </Section>
      ) : null}

      {/* CTA Section */}
      <Section className="gradient-secondary text-secondary-foreground">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold">
            Every Contribution Matters
          </h2>
          <p className="text-lg opacity-90">
            Your donation directly supports our programs - from feeding the
            hungry to providing medical care and education. Together, we can
            create lasting change in our communities.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">₹500</p>
              <p className="opacity-90">Feeds 10 people</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">₹2000</p>
              <p className="opacity-90">Medical camp supplies</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold mb-2">₹5000</p>
              <p className="opacity-90">Supports a campaign</p>
            </div>
          </div>
        </div>
      </Section>
    </div>
  )
}
