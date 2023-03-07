import { ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/solid'
import Link from 'next/link'

import { PostWithGroup } from '@/components/Feed'

interface Props {
  post: PostWithGroup
}

const PostCard = ({ post }: Props) => {
  return (
    <Link key={post.publicKey.toString()} href={'#'}>
      <li className="relative bg-white py-5 px-4 focus-within:ring-2 focus-within:ring-inset focus-within:ring-orange-600 hover:bg-gray-50">
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
            {/* <a href="#" className="block focus:outline-none"> */}
            <span className="absolute inset-0" aria-hidden="true" />
            <p className="truncate text-sm font-medium text-gray-900">{post.title}</p>
            <p className="truncate text-sm text-gray-500">
              {post.user.nickname} {post?.group ? `on ${post.group.name}` : ''}
            </p>
            {/* </a> */}
          </div>

          <time dateTime={post.timestamp.toString()} className="flex-shrink-0 whitespace-nowrap text-sm text-gray-500">
            {post.timestamp.toString()}
          </time>
        </div>

        <div className="mt-1">
          <p className="text-sm text-gray-600 line-clamp-2 text-ellipsis">{post.text}</p>
        </div>
      </li>
    </Link>
  )
}

export default PostCard
