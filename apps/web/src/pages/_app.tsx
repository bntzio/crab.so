import '@/styles/globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import type { AppProps } from 'next/app'

import { WalletAdapter } from '@/components'
import { MainLayout } from '@/layouts/MainLayout'

function App({ Component, pageProps }: AppProps) {
  return (
    <MainLayout>
      <WalletAdapter>
        <Component {...pageProps} />
      </WalletAdapter>
    </MainLayout>
  )
}

export default App
