import { Group } from '@spling/social-protocol'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'

import { PostForm } from '@/components'

export const posts = [
  {
    slug: 'first-post',
    title: 'First Post',
  },
  {
    slug: 'second-post',
    title: 'Second Post',
  },
  {
    slug: 'third-post',
    title: 'Third Post',
  },
]

export default function Community() {
  const router = useRouter()
  // TODO: Manage state in a store
  const [communities, setCommunities] = useState<Group[]>([])

  const { community } = router.query

  useEffect(() => {
    async function fetchCommunities() {
      const response = await fetch('/api/communities')
      const data = await response.json()

      setCommunities(data)
    }

    fetchCommunities()
  }, [])

  const communityData = communities.find(c => c.metadata?.slug === community)

  if (communities.length === 0 || !communityData) {
    return <div>Loading...</div>
  }

  return (
    <main>
      <section className="flex items-center space-x-6 mt-8">
        <h1 className="text-xl font-medium">{communityData.name}</h1>
      </section>

      <section className="my-10">
        <PostForm />
      </section>

      <div className="mt-6">
        <ul className="space-y-1">
          {posts.map(post => (
            <li key={post.slug}>
              <Link
                href="/c/[community]/[post]"
                as={`/c/${community}/${post.slug}`}
                className="text-blue-500 hover:underline"
              >
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
