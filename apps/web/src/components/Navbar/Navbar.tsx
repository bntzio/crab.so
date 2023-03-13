import { UserGroupIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { useModalStore, useUserStore } from '@/stores'

export default function Navbar() {
  const router = useRouter()
  const authUser = useUser()
  const { user } = useUserStore()
  const { setVisible } = useWalletModal()
  const { setActiveModal } = useModalStore()
  const { disconnect } = useWallet()
  const [isRegistered, setIsRegistered] = useState<boolean | undefined>()
  const supabaseClient = useSupabaseClient()

  useEffect(() => {
    if (user) {
      setIsRegistered(true)
    } else {
      setIsRegistered(false)
    }
  }, [user])

  const renderNavButtons = () => {
    switch (router.pathname) {
      case '/':
        if (isRegistered)
          return <Button onClick={async () => setActiveModal('createCommunity')}>Create a community</Button>
        else return <Button onClick={async () => router.push('/signup')}>Create your account</Button>
      default:
        if (!isRegistered) return <Button onClick={async () => router.push('/signup')}>Create your account</Button>
        return null
    }
  }

  const handleLogout = async () => {
    await disconnect()
    supabaseClient.auth.signOut()
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
            {renderNavButtons()}
            <Button buttonType="slate" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
