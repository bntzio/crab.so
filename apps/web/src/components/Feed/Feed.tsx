import { useWallet } from '@solana/wallet-adapter-react'
import { Post, User } from '@spling/social-protocol'
import { useState, useEffect } from 'react'

import { PostCard } from '@/components'
import { useSplingStore } from '@/stores'

export default function Feed() {
  const wallet = useWallet()
  const [posts, setPosts] = useState<Post[]>([])
  const { socialProtocol } = useSplingStore()
  // TODO: Manage state in a store
  const [user, setUser] = useState<User>()

  useEffect(() => {
    async function fetchUser() {
      if (!wallet.publicKey) return

      const user = await socialProtocol?.getUserByPublicKey(wallet.publicKey)

      if (user) setUser(user)
    }

    if (!user) fetchUser()
  }, [socialProtocol, wallet, user])

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
