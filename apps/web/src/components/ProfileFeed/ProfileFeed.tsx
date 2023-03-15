import { Post, Group } from '@spling/social-protocol'
import dayjs from 'dayjs'
import Link from 'next/link'
import { useState, useEffect } from 'react'

import { useSplingStore, useUserStore } from '@/stores'

interface Props {
  posts: Post[]
}

export default function ProfileFeed({ posts }: Props) {
  const now = dayjs()
  const { socialProtocol } = useSplingStore()
  const { user } = useUserStore()
  // NOTE: Storing all groups is not an issue now, but it will be in the future, we need to refactor this.
  const [groups, setGroups] = useState<Pick<Group, 'name' | 'groupId' | 'metadata'>[]>()

  useEffect(() => {
    async function getAllGroups() {
      let groups: Group[] | undefined

      if (user) {
        groups = await socialProtocol?.getAllGroups()
      } else {
        const response = await fetch('/api/communities?type=direct', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        groups = await response.json()
      }

      if (groups) {
        const filteredGroups = groups.map(g => ({ name: g.name, groupId: g.groupId, metadata: g.metadata }))
        setGroups(filteredGroups)
      }
    }

    getAllGroups()
  }, [socialProtocol, user])

  if (!groups) return <div>Something went wrong</div>

  return (
    <ul role="list" className="divide-y divide-gray-200">
      {posts.map(post => (
        <li
          key={post.postId}
          className="relative bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-600 hover:bg-gray-50 rounded-lg"
        >
          <div className="flex justify-between space-x-3">
            <div className="min-w-0 flex-1">
              <Link
                href={`/c/${
                  groups && groups.find(g => g.groupId === post.groupId)?.metadata?.slug
                }/${post.publicKey.toString()}`}
                className="block focus:outline-none"
              >
                <span className="absolute inset-0" aria-hidden="true" />
                <p className="truncate text-xs text-gray-600 font-medium">
                  <span>/c/{groups && groups.find(g => g.groupId === post.groupId)?.metadata?.slug}</span>
                </p>
                <p className="truncate text-sm font-medium text-gray-900">{post.title}</p>
              </Link>
            </div>
            <span className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
              Posted <time dateTime={post.timestamp.toString()}>{dayjs(dayjs(post.timestamp * 1000)).from(now)}</time>
            </span>
          </div>
          <div className="mt-1">
            <p className="text-sm text-gray-600 line-clamp-2">{post.text}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
