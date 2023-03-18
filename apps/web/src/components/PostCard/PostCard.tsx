import { ChevronUpIcon } from '@heroicons/react/24/solid'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'

import { PostWithGroup } from '@/components/Feed'
import { useSplingStore, useUserStore } from '@/stores'

dayjs.extend(relativeTime)

interface Props {
  post: PostWithGroup
}

const PostCard = ({ post }: Props) => {
  const router = useRouter()
  const { user } = useUserStore()
  const { socialProtocol } = useSplingStore()
  const [isUpvoted, setIsUpvoted] = useState(false)
  const [votes, setVotes] = useState(post.likes.length)

  useEffect(() => {
    if (user) {
      const hasLiked = post.likes.includes(user.userId)
      setIsUpvoted(hasLiked)
    }
  }, [user, post])

  const handleNavigate = () =>
    router.push(`/c/${router.query?.community || post.group?.slug}/${post.publicKey.toString()}`)

  const handleVoteDownvote = async (ev: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    ev.stopPropagation()

    try {
      await socialProtocol?.likePost(post.publicKey)

      if (isUpvoted) {
        setVotes(prevState => prevState - 1)

        toast.success('Removed vote!', {
          position: 'bottom-center',
        })
      } else {
        setVotes(prevState => prevState + 1)

        toast.success('Added vote!', {
          position: 'bottom-center',
        })
      }

      setIsUpvoted(!isUpvoted)
    } catch (e) {
      console.error(e)
    }
  }

  const now = dayjs()
  const unix = dayjs(post.timestamp * 1000)
  const publishedAt = dayjs(unix).from(now)

  return (
    <div className="hover:cursor-pointer" onClick={handleNavigate}>
      <li className="relative py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-600 hover:bg-gray-50 rounded-lg">
        <div className="flex justify-between space-x-3 items-center">
          <div className="mb-1 mr-1">
            {/* <span className="absolute inset-0" aria-hidden="true" /> */}
            <div className="rounded-full p-[2px]" onClick={handleVoteDownvote}>
              <span className="sr-only">Upvote</span>
              <ChevronUpIcon
                className={`h-5 w-5 ${isUpvoted ? 'text-orange-400' : 'text-gray-400'} hover:text-orange-600`}
                aria-hidden="true"
              />
            </div>
            <div className="flex justify-center">
              <span className="text-xs font-medium text-gray-500 py-1">{votes}</span>
            </div>
          </div>

          <div className="min-w-0 flex-1 -mt-1">
            {/* <a href="#" className="block focus:outline-none"> */}
            {/* <span className="absolute inset-0" aria-hidden="true" /> */}
            <p className="truncate text-sm font-medium text-gray-900">{post.title}</p>
            <p className="truncate text-xs text-gray-500">
              <Link
                onClick={ev => ev.stopPropagation()}
                href={`/u/${post.user.nickname}`}
                className="hover:text-orange-500 font-medium"
              >
                {post.user.nickname}
              </Link>{' '}
              on{' '}
              <Link
                onClick={ev => ev.stopPropagation()}
                href={`/c/${post.group?.slug}`}
                className="hover:text-orange-500 font-medium"
              >
                /c/{post.group?.slug}
              </Link>
            </p>
            {/* </a> */}
          </div>

          <time dateTime={unix.toISOString()} className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
            {publishedAt}
          </time>
        </div>

        <div className="mt-1">
          <p className="text-sm text-gray-600 line-clamp-2 text-ellipsis">{post.text}</p>
        </div>
      </li>
    </div>
  )
}

export default PostCard
