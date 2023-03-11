import { PublicKey } from '@solana/web3.js'
import { Post, Reply } from '@spling/social-protocol'
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
  const [replies, setReplies] = useState<Reply[] | null>(null)

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

      if (replies) setReplies(replies)
    }

    getReplies()
  }, [post, socialProtocol])

  const renderReplies = () => {
    if (replies === null) return <div>Loading comments...</div>
    if (replies?.length === 0) return <div>There are no comments.</div>

    return replies.map(reply => (
      <div key={reply.publicKey.toString()} className="flex space-x-3 border-b px-3 py-6">
        <img
          className="inline-block h-12 w-12 rounded-full border p-[2px]"
          // TODO: Add a default avatar as fallback
          src={reply.user.avatar || '/images/0xPegasus.png'}
          alt={reply.user.nickname}
        />
        <p className="text-gray-800">{reply.text}</p>
      </div>
    ))
  }

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

      {renderReplies()}

      <br />
      <br />

      <ReplyForm postId={post.postId} />
    </main>
  )
}
