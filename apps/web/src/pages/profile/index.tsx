import { useWallet } from '@solana/wallet-adapter-react'
import { Group, User } from '@spling/social-protocol'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { useSplingStore } from '@/stores'

export default function Profile() {
  const wallet = useWallet()
  const router = useRouter()
  const { getAllGroups, socialProtocol } = useSplingStore()
  // TODO: Manage state in a store
  const [user, setUser] = useState<User>()
  const [communities, setCommunities] = useState<Group[]>()

  useEffect(() => {
    async function fetchUser() {
      if (!wallet.publicKey) return

      const user = await socialProtocol?.getUserByPublicKey(wallet.publicKey)

      if (user) setUser(user)
    }

    if (!user) fetchUser()
  }, [socialProtocol, wallet, user])

  useEffect(() => {
    async function fetchCommunities() {
      const response = await fetch('/api/communities')
      const data = await response.json()

      setCommunities(data)
    }

    fetchCommunities()
  }, [])

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
