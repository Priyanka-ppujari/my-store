import { auth } from '@/server/auth'
import NavbarClient from './navbar-client'

export const dynamic = 'force-dynamic'

export default async function Navbar() {
  const session = await auth()
  return <NavbarClient user={session?.user} />
}