import { UserGroupIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'ui'

export default function Navbar() {
  const router = useRouter()
  const authUser = useUser()
  const { disconnect } = useWallet()
  const { setVisible } = useWalletModal()
  const supabaseClient = useSupabaseClient()

  const handleLogout = async () => {
    await disconnect()
    await supabaseClient.auth.signOut()
    await router.push('/')
  }

  return (
    <nav className="flex justify-between items-center">
      <Link href="/" className="text-black font-normal text-3xl">
        <span aria-label="crab" role="img">
          🦀
        </span>
      </Link>
      <div className="flex space-x-6">
        <Button buttonType="slate">
          <Link href="/c">See more communities</Link>
        </Button>
        {!authUser ? (
          <Button onClick={() => setVisible(true)}>
            <UserGroupIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
            Create a community
          </Button>
        ) : (
          <div className="space-x-4">
            <Button buttonType="slate" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
