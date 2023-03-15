import { HomeIcon, RocketLaunchIcon } from '@heroicons/react/20/solid'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@solana/wallet-adapter-react'
import { useUser, useSupabaseClient, User } from '@supabase/auth-helpers-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { DropdownMenu } from '@/components'
import { useUserStore } from '@/stores'

export default function Navbar() {
  const user = useUser()
  const router = useRouter()
  const wallet = useWallet()
  const supabaseClient = useSupabaseClient()
  const { user: splingUser } = useUserStore()
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
      <div className={`flex w-full ${!user && router.pathname === '/' ? 'justify-end' : ''}`}>
        {user === null && router.pathname === '/' ? (
          <Button onClick={() => router.push('/login')}>
            <UserGroupIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
            Create a community
          </Button>
        ) : (
          <div className="w-full flex justify-center relative">
            {wallet.connected && (
              <>
                {supabaseUser?.user_metadata?.username && (
                  <div className="flex items-center justify-center space-x-6">
                    <Link href="/home" className="flex flex-col items-center group">
                      <HomeIcon className="h-5 w-5 text-gray-400 group-hover:text-orange-500" aria-hidden="true" />
                      <span className="text-gray-600/90 text-sm group-hover:text-orange-500 mt-[2px]">Home</span>
                    </Link>
                    <Link href="/discover" className="flex flex-col items-center group">
                      <RocketLaunchIcon
                        className="h-5 w-5 text-gray-400 group-hover:text-orange-500"
                        aria-hidden="true"
                      />
                      <span className="text-gray-600/90 text-sm group-hover:text-orange-500 mt-[2px]">Discover</span>
                    </Link>
                  </div>
                )}
              </>
            )}
            {supabaseUser?.email && supabaseUser.user_metadata?.username && splingUser?.avatar && wallet?.publicKey && (
              <div className="absolute right-0">
                <DropdownMenu
                  avatar={splingUser.avatar}
                  username={supabaseUser.user_metadata.username}
                  email={supabaseUser.email}
                  wallet={wallet.publicKey.toString()}
                  onLogout={handleLogout}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
