import { UserGroupIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useUser, useSupabaseClient, User } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

export default function Navbar() {
  const user = useUser()
  const router = useRouter()
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const supabaseClient = useSupabaseClient()
  const [supabaseUser, setSupabaseUser] = useState<User>()

  useEffect(() => {
    async function getUser() {
      const result = await supabaseClient.auth.getUser()

      if (result.data?.user) setSupabaseUser(result.data.user)
    }

    getUser()
  }, [supabaseClient])

  const handleLogout = async () => {
    await supabaseClient.auth.signOut()
    await wallet.disconnect()
    await router.push('/')
  }

  if (router.pathname === '/auth') return null

  return (
    <nav className="flex justify-between items-center">
      <Link href="/" className="text-black font-normal text-3xl">
        <span aria-label="crab" role="img">
          🦀
        </span>
      </Link>
      <div className="flex space-x-6">
        {!user ? (
          <Button onClick={() => setVisible(true)}>
            <UserGroupIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
            Create a community
          </Button>
        ) : (
          <div className="space-x-4">
            {wallet.connected ? (
              <>
                {supabaseUser?.user_metadata?.username && (
                  <>
                    <Button buttonType="slate">
                      <Link href="/c">See more communities</Link>
                    </Button>
                    <Link href={`/u/${supabaseUser.user_metadata.username}`}>
                      <Button buttonType="slate">My Profile</Button>
                    </Link>
                  </>
                )}
                <Button buttonType="slate" onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button onClick={() => setVisible(true)}>Connect wallet</Button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
