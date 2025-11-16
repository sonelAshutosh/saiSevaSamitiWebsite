'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Hide Header and Footer on admin and login pages
  const isAdminOrLogin = pathname?.startsWith('/admin') || pathname?.startsWith('/login')

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminOrLogin && <Header />}
      <main className="flex-1">{children}</main>
      {!isAdminOrLogin && <Footer />}
    </div>
  )
}
