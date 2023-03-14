import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { Button } from 'ui'

import { SignupForm } from '@/components'

export default function WelcomePage() {
  const wallet = useWallet()
  const { setVisible } = useWalletModal()

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-14">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Welcome to Crab</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Let's get your account ready so you can start using{' '}
            <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
              Crab
            </a>
            !
          </p>
        </div>

        <div className="flex flex-col items-center">
          {!wallet.connected ? (
            <div className="space-y-3">
              <p className="text-slate-500">Connect your Solana wallet to your account</p>
              <div className="flex items-center justify-center">
                <Button onClick={() => setVisible(true)}>Connect wallet</Button>
              </div>
            </div>
          ) : (
            <SignupForm />
          )}
        </div>
      </div>
    </div>
  )
}
