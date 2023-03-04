import { UserGroupIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { useSplingStore, useModalStore } from '@/stores'

export default function Navbar() {
  const router = useRouter()
  const { setVisible } = useWalletModal()
  const { socialProtocol } = useSplingStore()
  const { setActiveModal } = useModalStore()
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
        {!connected ? (
          <Button onClick={() => setVisible(true)}>
            <UserGroupIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
            Create a community
          </Button>
        ) : (
          <div className="space-x-4">
            {renderNavButtons()}
            <Button buttonType="slate" onClick={async () => await disconnect()}>
              Disconnect
            </Button>
          </div>
        )}
      </div>
    </nav>
  )
}
