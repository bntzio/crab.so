import { Post } from '@spling/social-protocol'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from 'ui'

import { useSplingStore, useUserStore } from '@/stores'

interface Props {
  groupId: number
  onPublished: (post: Post) => void
}

export default function PostForm({ groupId, onPublished }: Props) {
  const { user } = useUserStore()
  const { socialProtocol } = useSplingStore()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    const title = formData.get('title') as string
    const body = formData.get('body') as string

    if (!title || !body) return alert('Please fill out all the fields.')

    try {
      const post = await socialProtocol?.createPost(groupId, title, body, [])

      if (post) onPublished(post)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <Link href={`/u/${user?.nickname}`}>
          <div className="relative h-10 w-10">
            <Image
              className="inline-block rounded-full"
              // TODO: Add a default avatar as fallback
              src={user?.avatar || '/images/0xPegasus.png'}
              alt={user?.nickname || '0xPegasus Avatar'}
              fill
            />
          </div>
        </Link>
      </div>
      <div className="min-w-0 flex-1">
        <form className="relative" onSubmit={handleSubmit}>
          <div className="mb-2">
            <label htmlFor="title" className="sr-only">
              Add the title of your post
            </label>
            <div>
              <input
                type="text"
                name="title"
                id="title"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                placeholder="Add a title"
              />
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
            <label htmlFor="body" className="sr-only">
              Add the body of your post
            </label>
            <textarea
              rows={3}
              name="body"
              id="body"
              className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
              placeholder="Write something..."
              defaultValue={''}
            />

            {/* Spacer element to match the height of the toolbar */}
            <div className="py-2" aria-hidden="true">
              {/* Matches height of button in toolbar (1px border + 36px content height) */}
              <div className="py-px">
                <div className="h-9" />
              </div>
            </div>
          </div>

          <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
            <div className="flex items-center space-x-5"></div>
            <div className="flex-shrink-0">
              <Button type="submit" buttonType="primary">
                Post
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
