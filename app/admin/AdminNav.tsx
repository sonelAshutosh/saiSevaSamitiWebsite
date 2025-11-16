'use client'

import * as React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import {
  Users,
  HandHeart,
  Award,
  MessageSquare,
  DollarSign,
  Images,
  UserCircle,
  Mail,
  Activity,
  LogOut,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { logoutUser } from '@/app/login/actions'
import { toast } from 'sonner'

interface NavItem {
  title: string
  url: string
  icon: React.ComponentType<{ className?: string }>
}

const navItems: NavItem[] = [
  {
    title: 'Users',
    url: '/admin/users',
    icon: Users,
  },
  {
    title: 'Members',
    url: '/admin/members',
    icon: UserCircle,
  },
  {
    title: 'Volunteers',
    url: '/admin/volunteers',
    icon: Users,
  },
  {
    title: 'Campaigns',
    url: '/admin/campaigns',
    icon: HandHeart,
  },
  {
    title: 'Certificates',
    url: '/admin/certificates',
    icon: Award,
  },
  {
    title: 'Gallery',
    url: '/admin/gallery',
    icon: Images,
  },
  {
    title: 'Contact Us',
    url: '/admin/contact-us',
    icon: MessageSquare,
  },

  {
    title: 'Donators',
    url: '/admin/donators',
    icon: DollarSign,
  },
  {
    title: 'Newsletter',
    url: '/admin/newsletter',
    icon: Mail,
  },
  {
    title: 'Activities Number',
    url: '/admin/activities-number',
    icon: Activity,
  },
]

export function AdminNav() {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = React.useState(false)

  const handleLogout = async () => {
    setIsLoggingOut(true)
    try {
      toast.loading('Logging out...', { id: 'logout-toast' })

      const result = await logoutUser()

      if (result.success) {
        toast.success('Logged out successfully', {
          id: 'logout-toast',
          description: 'Redirecting to login page...',
        })

        setTimeout(() => {
          router.push('/login')
        }, 500)
      } else {
        throw new Error('Logout failed')
      }
    } catch (error) {
      toast.error('Logout failed', {
        id: 'logout-toast',
        description: 'An error occurred while logging out',
      })
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <Sidebar>
      <SidebarHeader className="border-border border-b px-6 py-2.5">
        <div className="flex items-center gap-2">
          <div className="h-12 w-12 relative rounded-lg overflow-hidden">
            <Image
              src="/images/logo-image.jpg"
              alt="Sai Seva Samiti Logo"
              fill
              className="object-cover"
              quality={100}
              priority
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">Sai Seva Samiti</h2>
            <p className="text-xs text-muted-foreground">Admin Portal</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.url

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.title}
                      className="cursor-pointer"
                    >
                      <Link href={item.url}>
                        <Icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-border border-t p-4">
        <Button
          variant="outline"
          className="w-full justify-start cursor-pointer"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {isLoggingOut ? 'Logging out...' : 'Logout'}
        </Button>
      </SidebarFooter>
    </Sidebar>
  )
}

export function AdminNavProvider({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminNav />
        <main className="flex-1">
          <div className="border-border border-b">
            <div className="flex h-16 items-center px-4 sm:px-6">
              <SidebarTrigger />
            </div>
          </div>
          <div className="flex-1 space-y-4 p-4 sm:p-6 md:p-8">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
