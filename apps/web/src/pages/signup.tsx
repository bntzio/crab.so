import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useState } from 'react'

import { SignupForm } from '@/components'
import { useSplingStore } from '@/stores'

export default function Signup() {
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const { getAllGroups, socialProtocol } = useSplingStore()
  const [accountFound, setAccountFound] = useState<boolean | undefined>()

  const { connected } = wallet

  return (
    <main className="py-8">
      <h1 className="text-xl font-medium">
        Welcome to Crab!{' '}
        <span role="img" aria-label="waving hand">
          👋
        </span>
      </h1>
      <div className="mt-10">
        <SignupForm />
      </div>
    </main>
  )
}
