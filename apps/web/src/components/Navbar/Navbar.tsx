import { UserGroupIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { useSplingStore } from '@/stores'

export default function Navbar() {
  const router = useRouter()
  const { setVisible } = useWalletModal()
  const { socialProtocol } = useSplingStore()
  const { connected, disconnect, publicKey } = useWallet()
  const [isRegistered, setIsRegistered] = useState<boolean | undefined>()

  useEffect(() => {
    async function checkAccount() {
      if (publicKey) {
        const currentUser = await socialProtocol?.getUserByPublicKey(publicKey)
        console.log('currentUser', currentUser)

        if (currentUser) {
          setIsRegistered(true)
        } else {
          setIsRegistered(false)
        }
      }
    }

    checkAccount()
  }, [socialProtocol, publicKey])

  return (
    <nav className="flex justify-between items-center">
      <Link href="/" className="text-black font-normal text-2xl">
        <span aria-label="crab" role="img">
          🦀
        </span>
      </Link>
      {!connected ? (
        <Button onClick={() => setVisible(true)}>
          <UserGroupIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
          Create a community
        </Button>
      ) : (
        <div className="space-x-4">
          {isRegistered ? (
            <Button onClick={async () => router.push('/c/new')}>Create a Community</Button>
          ) : (
            <Button onClick={async () => router.push('/signup')}>Create your account</Button>
          )}
          <Button buttonType="slate" onClick={async () => await disconnect()}>
            Disconnect
          </Button>
        </div>
      )}
    </nav>
  )
}
