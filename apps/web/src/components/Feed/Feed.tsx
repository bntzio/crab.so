import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import { Post } from '@spling/social-protocol'
import { useState, useEffect } from 'react'

import { useSplingStore } from '@/stores'

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([])
  const { socialProtocol } = useSplingStore()

  useEffect(() => {
    async function fetchProtocolInfo() {
      setTimeout(async () => {
        const allGroupPosts = await socialProtocol?.getAllPosts(1, 20, 10)

        console.log('all group posts', allGroupPosts)

        if (allGroupPosts && allGroupPosts?.length > 0) setPosts(allGroupPosts)
      }, 1200)
    }

    fetchProtocolInfo()
  }, [socialProtocol])

  const renderPosts = () => {
    return posts.map(post => (
      <li
        key={post.publicKey.toString()}
        className="relative bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-600 hover:bg-gray-50"
      >
        <div className="flex justify-between space-x-3 items-center">
          <div className="mb-1 mr-1">
            <span className="absolute inset-0" aria-hidden="true" />
            <div>
              <span className="sr-only">Upvote</span>
              <ChevronUpIcon className="h-5 w-5 text-orange-400" aria-hidden="true" />
            </div>
            <div className="flex justify-center">
              <span className="text-xs text-gray-500 py-1">{post.likes.length}</span>
            </div>
            <div>
              <span className="sr-only">Downvote</span>
              <ChevronDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
          </div>

          <div className="min-w-0 flex-1 -mt-1">
            <a href="#" className="block focus:outline-none">
              <span className="absolute inset-0" aria-hidden="true" />
              <p className="truncate text-sm font-medium text-gray-900">{post.title}</p>
              <p className="truncate text-sm text-gray-500">
                {post.user.nickname} on {post.groupId}
              </p>
            </a>
          </div>

          <time dateTime={post.timestamp.toString()} className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
            {post.timestamp.toString()}
          </time>
        </div>

        <div className="mt-1">
          <p className="text-sm text-gray-600 line-clamp-2">
            Doloremque dolorem maiores assumenda dolorem facilis. Velit vel in a rerum natus facere. Enim rerum eaque
            qui facilis. Numquam laudantium sed id dolores omnis in. Eos reiciendis deserunt maiores et accusamus quod
            dolor.
          </p>
        </div>
      </li>
    ))
  }

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {posts.length === 0 ? <li className="text-gray-500">No posts yet!</li> : renderPosts()}
    </ul>
  )
}
