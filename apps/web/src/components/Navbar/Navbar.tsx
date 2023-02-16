import { UserGroupIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useRouter } from 'next/router'
import { Button } from 'ui'

export default function Navbar() {
  const router = useRouter()
  const { setVisible } = useWalletModal()
  const { connected, disconnect } = useWallet()

  return (
    <nav className="flex justify-between items-center">
      <p className="text-black font-normal text-2xl">
        <span aria-label="crab" role="img">
          🦀
        </span>
      </p>
      {!connected ? (
        <Button onClick={() => setVisible(true)}>
          <UserGroupIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
          Create a community
        </Button>
      ) : (
        <div className="space-x-4">
          <Button onClick={async () => router.push('/c/new')}>Create a Community</Button>
          <Button buttonType="slate" onClick={async () => await disconnect()}>
            Disconnect
          </Button>
        </div>
      )}
    </nav>
  )
}
