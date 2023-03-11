import { WalletContextState } from '@solana/wallet-adapter-react'
import { SocialProtocol, ProtocolOptions, Group } from '@spling/social-protocol'
import { create, UseBoundStore, StoreApi } from 'zustand'

import { isProd } from '@/helpers'

interface SplingStore {
  socialProtocol: SocialProtocol | null
  startSocialProtocol: ({ wallet }: { wallet: WalletContextState }) => Promise<void>
  getAllGroups: () => Promise<Group[]>
}

const heliusApiKey = process.env.NEXT_PUBLIC_HELIUS_API_KEY

const rpcUrl = isProd ? 'https://crab.so/api/rpc' : `https://rpc.helius.xyz?api-key=${heliusApiKey}`

const socialProtocolOptions = {
  rpcUrl,
  useIndexer: true,
} as ProtocolOptions

const useSplingStore: UseBoundStore<StoreApi<SplingStore>> = create((set, get) => ({
  socialProtocol: null,
  startSocialProtocol: async ({ wallet }) => {
    const socialProtocol: SocialProtocol = await new SocialProtocol(wallet, null, socialProtocolOptions).init()
    set({ socialProtocol })
  },
  getAllGroups: async () => {
    const socialProtocol = get().socialProtocol

    if (socialProtocol) {
      const allGroups = await socialProtocol.getAllGroups()
      return allGroups
    }

    return []
  },
}))

export default useSplingStore
