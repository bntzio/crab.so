import { UserPlusIcon } from '@heroicons/react/20/solid'
import { Group, Post } from '@spling/social-protocol'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { PostCard, PostForm } from '@/components'
import { useSplingStore } from '@/stores'

export default function Community() {
  const router = useRouter()
  // TODO: Manage state in a store
  const [communities, setCommunities] = useState<Group[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const { socialProtocol } = useSplingStore()

  const { community } = router.query

  const communityData = communities.find(c => c.metadata?.slug === community)

  useEffect(() => {
    async function fetchCommunities() {
      const response = await fetch('/api/communities')
      const data = await response.json()

      setCommunities(data)
    }

    fetchCommunities()
  }, [])

  useEffect(() => {
    async function fetchPosts() {
      const posts = await socialProtocol?.getAllPosts(communityData?.groupId as number)

      if (posts) setPosts(posts)
    }

    if (communityData) fetchPosts()
  }, [communityData, socialProtocol])

  if (communities.length === 0 || !communityData) {
    return <div>Loading...</div>
  }

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
              <Button className="h-7">
                <UserPlusIcon className="w-4 h-4 mr-2 text-white" />
                <span className="text-xs">Join Community</span>
              </Button>
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
