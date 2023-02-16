import { WalletContextState } from '@solana/wallet-adapter-react'
import { SocialProtocol, ProtocolOptions } from '@spling/social-protocol'
import { create, UseBoundStore, StoreApi } from 'zustand'

interface SplingStore {
  socialProtocol: SocialProtocol | null
  startSocialProtocol: ({ wallet }: { wallet: WalletContextState }) => Promise<void>
}

const socialProtocolOptions = {
  rpcUrl: 'https://api.mainnet-beta.solana.com/',
  useIndexer: true,
} as ProtocolOptions

const useSplingStore: UseBoundStore<StoreApi<SplingStore>> = create(set => ({
  socialProtocol: null,
  startSocialProtocol: async ({ wallet }) => {
    const socialProtocol: SocialProtocol = await new SocialProtocol(wallet, null, socialProtocolOptions).init()
    set({ socialProtocol })
  },
}))

export default useSplingStore
