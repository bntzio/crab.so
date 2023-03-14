import { ChevronUpIcon } from '@heroicons/react/24/solid'
import { PublicKey } from '@solana/web3.js'
import { Post, Group, Reply } from '@spling/social-protocol'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { ReplyForm } from '@/components'
import { useSplingStore, useUserStore } from '@/stores'

dayjs.extend(relativeTime)

export default function PostPage() {
  const router = useRouter()
  const { user } = useUserStore()
  const { socialProtocol } = useSplingStore()
  const [post, setPost] = useState<Post | null>(null)
  const [group, setGroup] = useState<Group | null>(null)
  const [replies, setReplies] = useState<Reply[] | null>(null)
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [votes, setVotes] = useState<number | null>(null)

  const { community } = router.query

  useEffect(() => {
    if (router.query?.deleted && router.query.deleted === 'true') {
      router.push(`/c/${community}`)
    }
  }, [community, router])

  useEffect(() => {
    if (user && post) {
      const hasLiked = post.likes.includes(user.userId)
      setIsUpvoted(hasLiked)
    }
  }, [user, post])

  useEffect(() => {
    async function init() {
      if (!router.query.post || typeof router.query.post !== 'string') return

      const postResult = await socialProtocol?.getPostByPublicKey(new PublicKey(router.query.post))

      if (postResult) {
        setPost(postResult)
        setVotes(postResult.likes.length)

        const group = await socialProtocol?.getGroup(postResult.groupId)

        if (group) {
          setGroup(group)
        }
      }
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

  const handleVoteDownvote = async (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    ev.stopPropagation()

    if (!post || votes === null) return

    try {
      await socialProtocol?.likePost(post.publicKey)

      if (isUpvoted) setVotes(votes - 1)
      else setVotes(votes + 1)

      setIsUpvoted(!isUpvoted)
    } catch (e) {
      console.error(e)
    }
  }

  const renderReplies = () => {
    if (replies === null) return <div>Loading comments...</div>
    if (replies?.length === 0) return <div>There are no comments.</div>

    return replies.map(reply => {
      const now = dayjs()
      const unix = dayjs(reply.timestamp * 1000)
      const publishedAt = dayjs(unix).from(now)

      return (
        <div key={reply.publicKey.toString()} className="flex space-x-3 border-b border-gray-200/90 py-6">
          <Link href={`/u/${reply.user.nickname}`}>
            <div className="relative h-10 w-10">
              <Image
                className="inline-block rounded-full border p-[1px]"
                // TODO: Add a default avatar as fallback
                src={reply.user.avatar || '/images/0xPegasus.png'}
                alt={`${reply.user.nickname} avatar`}
                fill
              />
            </div>
          </Link>
          <div className="flex flex-col space-y-1 justify-center">
            <div className="flex items-center text-xs space-x-1">
              <Link href={`/u/${reply.user.nickname}`}>
                <p className="font-medium mr-[1px] hover:text-orange-500">{reply.user.nickname}</p>
              </Link>

              <time dateTime={unix.toISOString()} className="text-gray-600/90">
                {publishedAt}
              </time>
            </div>
            <p className="text-sm text-gray-800">{reply.text}</p>
          </div>
        </div>
      )
    })
  }

  if (!post) return <div>Loading...</div>

  const handlePublishedReply = (reply: Reply) => {
    if (replies && replies.length > 0) {
      setReplies([...replies, reply])
    } else {
      setReplies([reply])
    }
  }

  const handlePostDelete = async () => {
    try {
      const pk = post.publicKey
      await socialProtocol?.deletePost(pk)
      document.location.href = `/c/${community}/${pk}?deleted=true`
    } catch (e) {
      // TODO: Replace with a toast
      console.error(e)
    }
  }

  return (
    <main>
      <div className="mt-6">
        <Button buttonType="slate">
          <Link href="/c/[community]" as={`/c/${community}`}>
            Back to community
          </Link>
        </Button>
      </div>

      <br />
      <br />

      <div className="flex items-start space-x-6">
        <div className="flex justify-between space-x-3 items-center">
          <div className="mt-5">
            <div className="rounded-full p-[2px]" onClick={handleVoteDownvote}>
              <span className="sr-only">Upvote</span>
              <ChevronUpIcon
                className={`h-5 w-5 ${isUpvoted ? 'text-orange-400' : 'text-gray-400'}`}
                aria-hidden="true"
              />
            </div>
            <div className="flex justify-center">
              {votes && <span className="text-xs font-medium text-gray-500 py-1">{votes}</span>}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <span className="text-xs text-gray-500/90">
              Posted by{' '}
              <Link href={`/u/${post.user.nickname}`} className="font-medium hover:text-orange-500">
                {post.user.nickname}
              </Link>{' '}
              <time dateTime={dayjs(post.timestamp * 1000).toISOString()}>
                {dayjs(post.timestamp * 1000).from(dayjs())}
              </time>
              {group && (
                <>
                  {' '}
                  on{' '}
                  <Link href={`/c/${group?.metadata?.slug}`} className="font-medium hover:text-orange-500">
                    /c/{group?.metadata?.slug}
                  </Link>
                </>
              )}
              <span>
                <span className="mx-1">•</span>
                <span className="cursor-pointer font-medium hover:text-blue-500">Share</span>
                {user?.publicKey && post.user.publicKey.equals(user.publicKey) && (
                  <>
                    <span className="mx-1">•</span>
                    <span className="cursor-pointer font-medium hover:text-red-500" onClick={handlePostDelete}>
                      Delete
                    </span>
                  </>
                )}
              </span>
            </span>
          </div>
          <div className="space-y-4">
            <h1 className="text-xl font-medium">{post.title}</h1>
            <p>{post.text}</p>
          </div>
        </div>
      </div>

      <br />
      <br />

      {renderReplies()}

      <br />
      <br />

      <ReplyForm postId={post.postId} onPublished={handlePublishedReply} />
    </main>
  )
}
