import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { GlowWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo, ReactNode } from 'react'

import { isProd } from '@/helpers'

interface Props {
  children: ReactNode
}

const endpoint = isProd ? 'https://crab.so/api/rpc' : 'http://localhost:3000/api/rpc'

const WalletAdapter = ({ children }: Props) => {
  const wallets = useMemo(() => [new GlowWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'confirmed' }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletAdapter
