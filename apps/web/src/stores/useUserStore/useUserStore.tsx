import type { PublicKey } from '@solana/web3.js'
import { User } from '@spling/social-protocol'
import { create, UseBoundStore, StoreApi } from 'zustand'

import { useSplingStore } from '@/stores'

interface UserStore {
  user: User | null
  fetchUser: (publicKey: PublicKey) => Promise<void>
}

const useUserStore: UseBoundStore<StoreApi<UserStore>> = create(set => ({
  user: null,
  fetchUser: async publicKey => {
    const { socialProtocol } = useSplingStore.getState()

    const user = await socialProtocol?.getUserByPublicKey(publicKey)

    if (user) set({ user })
  },
}))

export default useUserStore
