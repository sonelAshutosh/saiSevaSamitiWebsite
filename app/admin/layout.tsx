import { AdminNavProvider } from './AdminNav'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminNavProvider>{children}</AdminNavProvider>
}
