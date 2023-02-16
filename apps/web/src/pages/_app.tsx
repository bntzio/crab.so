import '@/styles/globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import type { AppProps } from 'next/app'

import { WalletAdapter, Navbar } from '@/components'
import { MainLayout } from '@/layouts/MainLayout'

function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <WalletAdapter>
        <div className="mt-4">
          <Navbar />
          <Component {...pageProps} />
        </div>
      </WalletAdapter>
    </MainLayout>
  )
}

export default App
