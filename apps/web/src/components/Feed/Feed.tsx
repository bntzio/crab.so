import { Post } from '@spling/social-protocol'
import { useState, useEffect } from 'react'

import { PostCard } from '@/components'
import { useSplingStore } from '@/stores'

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const { socialProtocol } = useSplingStore()

  useEffect(() => {
    async function fetchProtocolInfo() {
      setTimeout(async () => {
        const allGroupPosts = await socialProtocol?.getAllPosts(27)

        console.log('all group posts', allGroupPosts)

        if (allGroupPosts && allGroupPosts?.length > 0) setPosts(allGroupPosts)
      }, 1200)
    }

    fetchProtocolInfo()
  }, [socialProtocol])

  const renderPosts = () => {
    return posts.map(post => <PostCard key={post.publicKey.toString()} post={post} />)
  }

  return (
    <section>
      <div className="mb-4">
        <p className="text-gray-600 font-medium text-sm">Latest posts</p>
      </div>
      <ul role="list" className="divide-y divide-gray-200">
        {posts.length === 0 ? <li className="text-gray-500">No posts yet!</li> : renderPosts()}
      </ul>
    </section>
  )
}
