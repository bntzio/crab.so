import { useWallet } from '@solana/wallet-adapter-react'
import { Post } from '@spling/social-protocol'
import { useState, useEffect } from 'react'

import { PostCard } from '@/components'
import { useUserStore } from '@/stores'

export interface PostWithGroup extends Post {
  group?: {
    name: string
  }
}

export default function Feed() {
  const wallet = useWallet()
  const [posts, setPosts] = useState<PostWithGroup[]>([])
  const { user, fetchUser } = useUserStore()

  useEffect(() => {
    async function init() {
      if (!wallet.publicKey) return
      if (user) fetchUser(wallet.publicKey)
    }

    if (!user) init()
  }, [fetchUser, wallet, user])

  useEffect(() => {
    async function fetchUserFeed() {
      if (!user) return

      const { userId } = user

      const response = await fetch(`/api/feed?userId=${userId}`)

      const data = await response.json()

      setPosts(data)
    }

    fetchUserFeed()
  }, [user])

  const renderPosts = () => {
    return posts.map(post => <PostCard key={post.publicKey.toString()} post={post} />)
  }

  return (
    <section>
      <div className="mb-4">
        <p className="text-gray-600 font-medium text-sm">Your feed</p>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {posts.length === 0 ? <li className="text-gray-500">No posts yet!</li> : renderPosts()}
      </ul>
    </section>
  )
}
