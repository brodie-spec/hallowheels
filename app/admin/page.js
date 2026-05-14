import { cookies } from 'next/headers'
import AdminLoginPage from './AdminLoginPage'
import AdminPanel from './AdminPanel'

export const metadata = {
  title: 'Admin — HalloWheels',
  robots: 'noindex, nofollow',
}

export default async function AdminPage() {
  const jar = await cookies()
  const session = jar.get('hw-admin-session')

  if (session?.value) {
    return <AdminPanel />
  }

  return <AdminLoginPage />
}
