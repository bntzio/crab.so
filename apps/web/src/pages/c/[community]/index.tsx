import Link from 'next/link'
import { useRouter } from 'next/router'
import { Button } from 'ui'

import { communities } from '@/pages/c'

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

  const { community } = router.query

  return (
    <main>
      <h1 className="text-xl font-medium">Welcome to {communities.find(c => c.slug === community)?.name}</h1>

      <div className="mt-6">
        <Button buttonType="slate">
          <Link href="/c">See more communities</Link>
        </Button>
      </div>

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
