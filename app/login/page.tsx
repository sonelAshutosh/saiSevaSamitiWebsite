'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2, Lock } from 'lucide-react'
import { loginUser } from './actions'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!email || !password) {
      toast.error('Please fill in all fields', {
        description: 'Both email and password are required',
      })
      return
    }

    setIsLoading(true)

    try {
      // Show loading toast
      toast.loading('Logging in...', {
        id: 'login-toast',
      })

      // Call server action
      const result = await loginUser(email, password)

      if (!result.success) {
        throw new Error(result.message)
      }

      // Dismiss loading toast and show success
      toast.success('Login successful!', {
        id: 'login-toast',
        description: `Welcome back, ${result.user?.name || 'Admin'}!`,
      })

      // Reset form
      setEmail('')
      setPassword('')

      // Redirect to admin portal
      setTimeout(() => {
        router.push('/admin')
      }, 1000)
    } catch (error) {
      // Dismiss loading toast and show error
      toast.error('Login failed', {
        id: 'login-toast',
        description:
          error instanceof Error
            ? error.message
            : 'An unexpected error occurred',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 pb-6">
          <div className="flex justify-center mb-2">
            <div className="p-3 rounded-full bg-primary/10">
              <Lock className="h-6 w-6 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold text-center">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center text-sm sm:text-base">
            Enter your credentials to access the admin portal
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="h-11"
                autoComplete="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-11"
                autoComplete="current-password"
                required
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 text-base font-medium mt-6"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </Button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-xs sm:text-sm text-muted-foreground">
              This is a secure admin portal. Unauthorized access is prohibited.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
