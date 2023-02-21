import { Listbox, Transition } from '@headlessui/react'
import {
  AcademicCapIcon,
  NewspaperIcon,
  FireIcon,
  LockClosedIcon,
  HandThumbUpIcon,
  HeartIcon,
  XMarkIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/20/solid'
import { PaperClipIcon, ChatBubbleBottomCenterTextIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'
import { Button } from 'ui'

import { classNames } from '@/helpers'
import { useSplingStore } from '@/stores'

const postTypes = [
  { name: 'Announcement', value: 'announcement', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
  { name: 'News', value: 'news', icon: NewspaperIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
  { name: 'Donation', value: 'donation', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
  { name: 'Private', value: 'private', icon: LockClosedIcon, iconColor: 'text-white', bgColor: 'bg-indigo-500' },
  {
    name: 'Poll',
    value: 'poll',
    icon: PresentationChartLineIcon,
    iconColor: 'text-white',
    bgColor: 'bg-orange-500',
  },
  { name: 'Article', value: 'article', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
  {
    name: 'Tutorial',
    value: 'tutorial',
    icon: AcademicCapIcon,
    iconColor: 'text-white',
    bgColor: 'bg-yellow-400',
  },
  { name: 'Normal', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
]

export default function PostForm() {
  const [postType, setPostType] = useState(postTypes[postTypes.length - 1])
  const { socialProtocol } = useSplingStore()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    const title = formData.get('title') as string
    const body = formData.get('body') as string

    if (!title || !body) return alert('Please fill out all the fields.')

    try {
      const post = await socialProtocol?.createPost(27, title, body, [])
      console.log(post)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0">
        <img className="inline-block h-10 w-10 rounded-full" src="/images/0xPegasus.png" alt="0xPegasus's Avatar" />
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
              placeholder="Add your contribution..."
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
            <div className="flex items-center space-x-5">
              <div className="flex items-center">
                <button
                  type="button"
                  className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                >
                  <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                  <span className="sr-only">Attach a file</span>
                </button>
              </div>
              <div className="flex items-center">
                <Listbox value={postType} onChange={setPostType}>
                  {({ open }) => (
                    <>
                      <Listbox.Label className="sr-only"> Post type </Listbox.Label>
                      <div className="relative">
                        <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                          <span className="flex items-center justify-center">
                            {postType.value === null ? (
                              <span>
                                <ChatBubbleBottomCenterTextIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                <span className="sr-only"> Type of your post </span>
                              </span>
                            ) : (
                              <span>
                                <span
                                  className={classNames(
                                    postType.bgColor,
                                    'flex h-8 w-8 items-center justify-center rounded-full',
                                  )}
                                >
                                  <postType.icon className="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />
                                </span>
                                <span className="sr-only">{postType.name}</span>
                              </span>
                            )}
                          </span>
                        </Listbox.Button>

                        <Transition
                          show={open}
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                        >
                          <Listbox.Options className="absolute z-10 mt-1 -ml-6 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                            {postTypes.map(postType => (
                              <Listbox.Option
                                key={postType.value}
                                className={({ active }) =>
                                  classNames(
                                    active ? 'bg-gray-100' : 'bg-white',
                                    'relative cursor-default select-none py-2 px-3',
                                  )
                                }
                                value={postType}
                              >
                                <div className="flex items-center">
                                  <div
                                    className={classNames(
                                      postType.bgColor,
                                      'w-8 h-8 rounded-full flex items-center justify-center',
                                    )}
                                  >
                                    <postType.icon
                                      className={classNames(postType.iconColor, 'flex-shrink-0 h-5 w-5')}
                                      aria-hidden="true"
                                    />
                                  </div>
                                  <span className="ml-3 block truncate font-medium">{postType.name}</span>
                                </div>
                              </Listbox.Option>
                            ))}
                          </Listbox.Options>
                        </Transition>
                      </div>
                    </>
                  )}
                </Listbox>
              </div>
            </div>
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
