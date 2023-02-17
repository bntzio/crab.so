import { WalletContextState } from '@solana/wallet-adapter-react'
import { SocialProtocol, ProtocolOptions, Group } from '@spling/social-protocol'
import { create, UseBoundStore, StoreApi } from 'zustand'

interface SplingStore {
  socialProtocol: SocialProtocol | null
  startSocialProtocol: ({ wallet }: { wallet: WalletContextState }) => Promise<void>
  getAllGroups: () => Promise<Group[]>
}

const socialProtocolOptions = {
  rpcUrl: 'https://api.mainnet-beta.solana.com/',
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
