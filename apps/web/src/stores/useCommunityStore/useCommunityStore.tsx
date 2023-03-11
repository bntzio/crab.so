import { Group } from '@spling/social-protocol'
import { create, UseBoundStore, StoreApi } from 'zustand'

interface CommunityStore {
  communities: Group[]
  // setCommunities: (communities: Group[]) => void
  fetchCommunities: () => Promise<void>
}

const useCommunityStore: UseBoundStore<StoreApi<CommunityStore>> = create(set => ({
  communities: [],
  // setCommunities: communities => set({ communities }),
  fetchCommunities: async () => {
    const response = await fetch('/api/communities')
    const data = await response.json()
    set({ communities: data })
  },
}))

export default useCommunityStore
