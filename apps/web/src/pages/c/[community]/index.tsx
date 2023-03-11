import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/20/solid'
import { useWallet } from '@solana/wallet-adapter-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { PostCard, PostForm } from '@/components'
import { PostWithGroup } from '@/components/Feed'
import { useSplingStore, useCommunityStore, useUserStore } from '@/stores'

export default function Community() {
  const wallet = useWallet()
  const router = useRouter()
  const [joined, setJoined] = useState<boolean | null>(null)
  const { communities, fetchCommunities } = useCommunityStore()
  const [posts, setPosts] = useState<PostWithGroup[]>([])
  const { socialProtocol } = useSplingStore()
  const { user, fetchUser } = useUserStore()

  const { community } = router.query

  const communityData = communities.find(c => c.metadata?.slug === community)

  useEffect(() => {
    async function init() {
      if (!wallet.publicKey) return
      await fetchUser(wallet.publicKey)
    }

    if (!user) init()
  }, [fetchUser, wallet, user])

  useEffect(() => {
    async function init() {
      await fetchCommunities()
    }

    init()
  }, [fetchCommunities])

  useEffect(() => {
    if (user && communityData) {
      const hasJoined = user.groups.includes(communityData?.groupId)

      setJoined(hasJoined)
    }
  }, [user, communityData])

  useEffect(() => {
    async function fetchPosts() {
      if (!communityData || !communityData.metadata?.slug) return

      const posts = await socialProtocol?.getAllPosts(communityData.groupId)

      const postsWithGroup = posts?.map(post => ({
        ...post,
        group: {
          name: communityData.name,
          slug: communityData.metadata.slug,
        },
      }))

      if (postsWithGroup) setPosts(postsWithGroup)
    }

    fetchPosts()
  }, [communityData, socialProtocol])

  const handleGroupAction = async ({ action }: { action: 'join' | 'leave' }) => {
    try {
      if (!communityData) throw new Error('Community not found')

      if (action === 'join') {
        await socialProtocol?.joinGroup(communityData.groupId)
      } else {
        await socialProtocol?.leaveGroup(communityData.groupId)
      }

      setJoined(action === 'join')
    } catch (e) {
      // TODO: Handle error
      console.error(e)
    }
  }

  if (communities.length === 0 || !communityData || !user || joined === null) return <div>Loading...</div>

  return (
    <main className="mt-16">
      <div className="flex flex-col space-y-6">
        <div className="flex items-start space-x-4">
          <div className="mt-1">
            <Image
              src={communityData.avatar as string}
              alt={communityData.name}
              width={44}
              height={44}
              style={{ width: '44px', height: '44px' }}
              className="rounded-full bg-cover bg-no-repeat"
            />
          </div>
          <div className="space-y-2">
            <div className="-space-y-1">
              <h1 className="text-lg font-medium mr-1 text-gray-800">{communityData.name}</h1>
              <h2 className="text-gray-600">{communityData.bio}</h2>
            </div>
            <div>
              {joined ? (
                <Button
                  className="h-7 bg-red-500 hover:bg-red-600 focus:ring-red-400"
                  onClick={() => handleGroupAction({ action: 'leave' })}
                >
                  <UserMinusIcon className="w-4 h-4 mr-2 text-white" />
                  <span className="text-xs">Leave Community</span>
                </Button>
              ) : (
                <Button className="h-7" onClick={() => handleGroupAction({ action: 'join' })}>
                  <UserPlusIcon className="w-4 h-4 mr-2 text-white" />
                  <span className="text-xs">Join Community</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="my-10">
        <PostForm groupId={communityData.groupId} />
      </section>

      <div className="mt-6">
        <ul className="space-y-1">
          {posts.map(post => (
            <PostCard key={post.publicKey.toString()} post={post} />
          ))}
        </ul>
      </div>
    </main>
  )
}
