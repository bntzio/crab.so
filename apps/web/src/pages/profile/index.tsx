import { useWallet } from '@solana/wallet-adapter-react'
import { Group } from '@spling/social-protocol'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { useSplingStore } from '@/stores'

export default function Profile() {
  const wallet = useWallet()
  const router = useRouter()
  const [groups, setGroups] = useState<Group[]>([])
  const { getAllGroups, socialProtocol } = useSplingStore()

  useEffect(() => {
    async function fetchProtocolInfo() {
      setTimeout(async () => {
        const allGroups = await getAllGroups()

        const crabGroups = allGroups.filter(group => group.metadata?.slug)

        setGroups(crabGroups)

        if (wallet?.publicKey) {
          const user = await socialProtocol?.getUserByPublicKey(wallet.publicKey)
          console.log('my user', user)
        }
      }, 1200)
    }

    fetchProtocolInfo()
  }, [wallet, socialProtocol, getAllGroups])

  const handleDelete = async () => {
    await socialProtocol?.deleteGroup()
  }

  return (
    <section className="mt-10">
      <h1 className="text-xl font-bold mb-6">Profile</h1>
      <h3 className="text-lg font-semibold mb-3">Your communities</h3>
      <ul className="space-y-3">
        {groups.map(group => (
          <li className="space-x-4 flex">
            <span>{group.name}</span>
            <div className="space-x-2">
              <button
                className="bg-blue-500 text-white px-2 rounded-sm"
                onClick={() => router.push(`/c/${group.metadata?.slug}`)}
              >
                View
              </button>
              <button className="bg-red-500 text-white px-2 rounded-sm" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
