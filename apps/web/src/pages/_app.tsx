import '@/styles/globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { useWallet } from '@solana/wallet-adapter-react'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'

import { WalletAdapter, Navbar } from '@/components'
import { MainLayout } from '@/layouts/MainLayout'
import { useSplingStore, useUserStore } from '@/stores'

function CrabApp({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <WalletAdapter>
        <App>
          <Navbar />
          <Component {...pageProps} />
        </App>
      </WalletAdapter>
    </MainLayout>
  )
}

const App = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet()
  const { setUser } = useUserStore()
  const { socialProtocol, startSocialProtocol } = useSplingStore()

  useEffect(() => {
    async function start() {
      if (!wallet?.publicKey) return
      await startSocialProtocol({ wallet })
    }

    start()
  }, [wallet, startSocialProtocol])

  useEffect(() => {
    async function saveCurrentUser() {
      if (!socialProtocol || !wallet?.publicKey) return

      const currentUser = await socialProtocol.getUserByPublicKey(wallet.publicKey)

      if (currentUser) setUser(currentUser)
    }

    saveCurrentUser()
  }, [socialProtocol, wallet, setUser])

  if (!socialProtocol) return null

  return <div className="mt-4">{children}</div>
}

export default CrabApp
