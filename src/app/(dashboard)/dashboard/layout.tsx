import { auth } from '@/server/auth'
import { redirect } from 'next/navigation'
import { db } from '@/server/db'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  if (!session?.user?.email) {
    redirect('/api/auth/signin')
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  })

  if (!user?.isAdmin) {
    redirect('/')
  }

  return <>{children}</>
}