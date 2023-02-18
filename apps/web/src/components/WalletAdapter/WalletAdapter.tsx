import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { GlowWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const isProd = process.env.NODE_ENV === 'production'

const endpoint = isProd ? 'https://crab.so' : 'http://localhost:3000'

const WalletAdapter = ({ children }: Props) => {
  const wallets = useMemo(() => [new GlowWalletAdapter(), new SolflareWalletAdapter()], [])

  return (
    <ConnectionProvider endpoint={endpoint} config={{ commitment: 'max' }}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default WalletAdapter
