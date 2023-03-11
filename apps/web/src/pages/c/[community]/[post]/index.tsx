import { PublicKey } from '@solana/web3.js'
import { Post } from '@spling/social-protocol'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { ReplyForm } from '@/components'
import { useSplingStore } from '@/stores'

export default function PostPage() {
  const router = useRouter()
  const { socialProtocol } = useSplingStore()
  const [post, setPost] = useState<Post | null>(null)

  const { community } = router.query

  useEffect(() => {
    async function init() {
      if (!router.query.post || typeof router.query.post !== 'string') return

      const postResult = await socialProtocol?.getPostByPublicKey(new PublicKey(router.query.post))

      if (postResult) setPost(postResult)
    }

    init()
  }, [socialProtocol, router.query.post])

  useEffect(() => {
    async function getReplies() {
      if (!post) return

      const replies = await socialProtocol?.getAllPostReplies(post.postId)

      console.log('Post replies:', replies)
    }

    getReplies()
  }, [post, socialProtocol])

  if (!post) return <div>Loading...</div>

  return (
    <main>
      <h1 className="text-xl font-medium">{post.title}</h1>
      <p>{post.text}</p>

      <div className="mt-6">
        <Button buttonType="slate">
          <Link href="/c/[community]" as={`/c/${community}`}>
            Back to community
          </Link>
        </Button>
      </div>

      <br />
      <br />

      <ReplyForm postId={post.postId} />
    </main>
  )
}
