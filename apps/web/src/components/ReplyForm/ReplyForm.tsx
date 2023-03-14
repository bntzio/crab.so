import { PaperClipIcon } from '@heroicons/react/24/outline'
import { Reply } from '@spling/social-protocol'
import Image from 'next/image'
import Link from 'next/link'

import { useSplingStore, useUserStore } from '@/stores'

interface Props {
  postId: number
  onPublished: (comment: Reply) => void
}

export default function ReplyForm({ postId, onPublished }: Props) {
  const { user } = useUserStore()
  const { socialProtocol } = useSplingStore()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    const comment = formData.get('comment') as string

    if (!comment) return alert('Please fill out all the fields.')

    try {
      const reply = await socialProtocol?.createPostReply(postId, comment)

      if (reply) onPublished(reply)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <Link href={`/u/${user?.nickname}`}>
          <div className="relative h-12 w-12">
            <Image
              className="inline-block rounded-full"
              // TODO: Add a default avatar as fallback
              src={user?.avatar || '/images/0xPegasus.png'}
              alt={user?.nickname || '0xPegasus avatar'}
              fill
            />
          </div>
        </Link>
      </div>
      <div className="min-w-0 flex-1">
        <form onSubmit={handleSubmit}>
          <div className="border-b border-gray-200 focus-within:border-orange-600">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              name="comment"
              id="comment"
              className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-600 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              defaultValue={''}
            />
          </div>
          <div className="flex justify-between pt-2">
            <div className="flex items-center space-x-5">
              <div className="flow-root">
                <button
                  type="button"
                  className="-m-2 hidden h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperClipIcon className="h-6 w-6" aria-hidden="true" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
            </div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
