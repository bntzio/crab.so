import { Reply } from '@spling/social-protocol'
import Image from 'next/image'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'

import { useSplingStore, useUserStore } from '@/stores'

type Inputs = {
  comment: string
}

interface Props {
  postId: number
  onPublished: (comment: Reply) => void
}

export default function ReplyForm({ postId, onPublished }: Props) {
  const { user } = useUserStore()
  const { socialProtocol } = useSplingStore()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const onReply: SubmitHandler<Inputs> = async ({ comment }) => {
    try {
      const reply = await socialProtocol?.createPostReply(postId, comment)

      if (reply) onPublished(reply)

      reset()
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
        <form onSubmit={handleSubmit(onReply)}>
          <div className="border-b border-gray-200 focus-within:border-orange-600">
            <label htmlFor="comment" className="sr-only">
              Add your comment
            </label>
            <textarea
              rows={3}
              id="comment"
              className="block w-full resize-none border-0 border-b border-transparent p-0 pb-2 text-gray-900 placeholder:text-gray-400 focus:border-orange-600 focus:ring-0 sm:text-sm sm:leading-6"
              placeholder="Add your comment..."
              {...register('comment', { required: true })}
            />
          </div>
          <div className="flex justify-between pt-2">
            {errors.comment && <span className="text-red-500 text-sm font-medium">Comment is required</span>}
            <div className="flex items-center space-x-5"></div>
            <div className="flex-shrink-0">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center rounded-md bg-orange-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
              >
                {!isSubmitting ? (
                  <>Comment</>
                ) : (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Commenting...
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
