import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react'
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui'
import { GlowWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets'
import { useMemo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY

const endpoint = `https://rpc.helius.xyz?api-key=${heliusApiKey}`

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
