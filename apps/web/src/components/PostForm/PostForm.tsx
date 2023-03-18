import { Post } from '@spling/social-protocol'
import Image from 'next/image'
import Link from 'next/link'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Button } from 'ui'

import { useSplingStore, useUserStore } from '@/stores'

type Inputs = {
  title: string
  body: string
}

interface Props {
  groupId: number
  onPublished: (post: Post) => void
}

export default function PostForm({ groupId, onPublished }: Props) {
  const { user } = useUserStore()
  const { socialProtocol } = useSplingStore()
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const onPost: SubmitHandler<Inputs> = async ({ title, body }) => {
    try {
      const post = await socialProtocol?.createPost(groupId, title, body, [])

      if (post) onPublished(post)

      reset()
    } catch (e) {
      console.error(e)
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
        <form className="relative" onSubmit={handleSubmit(onPost)}>
          <div className="mb-2">
            <label htmlFor="title" className="sr-only">
              Add the title of your post
            </label>
            <div>
              <input
                id="title"
                type="text"
                placeholder="Add a title"
                className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                {...register('title', { required: true })}
              />
              {errors.title && <span className="text-red-500 text-sm font-medium">Title is required</span>}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-300 shadow-sm focus-within:border-orange-500 focus-within:ring-1 focus-within:ring-orange-500">
            <label htmlFor="body" className="sr-only">
              Add the body of your post
            </label>
            <textarea
              rows={3}
              id="body"
              placeholder="Write something..."
              className="block w-full resize-none border-0 py-3 focus:ring-0 sm:text-sm"
              {...register('body', { required: true })}
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
              <Button type="submit" buttonType="primary" disabled={isSubmitting}>
                {!isSubmitting ? (
                  <>Post</>
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
                    Posting...
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
        {errors.body && <span className="text-red-500 text-sm font-medium">Body is required</span>}
      </div>
    </div>
  )
}
