import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { useSplingStore, useCommunityStore, useUserStore } from '@/stores'

export default function Profile() {
  const wallet = useWallet()
  const router = useRouter()
  const { user, fetchUser } = useUserStore()
  const { socialProtocol } = useSplingStore()
  const { communities, fetchCommunities } = useCommunityStore()

  useEffect(() => {
    async function init() {
      if (!wallet.publicKey) return
      if (user) fetchUser(wallet.publicKey)
    }

    if (!user) init()
  }, [fetchUser, wallet, user])

  useEffect(() => {
    async function init() {
      await fetchCommunities()
    }

    init()
  }, [fetchCommunities])

  if (!user || !communities?.length) return <p>Loading...</p>

  const joinedGroupIds = user.groups

  const joinedCommunities = communities.filter(community => {
    return joinedGroupIds.includes(community.groupId)
  })

  return (
    <section className="mt-10">
      <h1 className="text-xl font-bold mb-6">My profile</h1>

      <div>
        <button
          className="bg-red-500 text-white px-2 rounded-sm"
          onClick={async () => await socialProtocol?.deleteGroup()}
        >
          Delete my community
        </button>
      </div>

      <div className="mt-4">
        <button
          className="bg-red-500 text-white px-2 rounded-sm"
          onClick={async () => await socialProtocol?.deleteUser()}
        >
          Delete my account
        </button>
      </div>

      <h3 className="text-lg font-semibold mb-3 mt-6">All Crab communities:</h3>
      <ul className="space-y-3">
        {communities.map(community => (
          <li className="space-x-4 flex">
            <span>{community.name}</span>
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-2 rounded-sm"
                onClick={() => router.push(`/c/${community.metadata?.slug}`)}
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="text-lg font-semibold mb-3 mt-10">Joined to the following Crab communities:</h3>
      <ul className="space-y-3">
        {joinedCommunities.map(joinedCommunity => (
          <li className="space-x-4 flex">
            <span>{joinedCommunity.name}</span>
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-2 rounded-sm"
                onClick={() => router.push(`/c/${joinedCommunity.metadata?.slug}`)}
              >
                View
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
