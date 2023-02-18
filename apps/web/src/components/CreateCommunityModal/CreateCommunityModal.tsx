import { Dialog, Transition } from '@headlessui/react'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import { Fragment, useRef, useState } from 'react'
import { Button } from 'ui'

import { useSplingStore } from '@/stores'
import { fileToBase64 } from '@/utils'

export default function CreateCommunityModal() {
  const [open, setOpen] = useState(true)
  const [file, setFile] = useState<File>()
  const inputFile = useRef<HTMLInputElement | null>(null)
  const { socialProtocol } = useSplingStore()
  const cancelButtonRef = useRef(null)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)

    const name = formData.get('name') as string
    const file = formData.get('photo') as File
    const bio = formData.get('about') as string

    const metadata = {
      slug: formData.get('slug') as string,
    }

    const encoded = await fileToBase64(file)

    if (encoded && typeof encoded === 'string') {
      const avatar = {
        base64: encoded,
        size: file.size,
        type: file.type,
      }

      try {
        const group = await socialProtocol?.createGroup(name, bio, avatar, metadata)
        console.log('created group: ', group)
        alert('Group created!') // TODO: Render success toast
        setOpen(false)
      } catch (e) {
        console.log(e) // TODO: Render error toast
      }
    }
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFile(file)
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" initialFocus={cancelButtonRef} onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <form onSubmit={handleSubmit}>
                  <div>
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                      <UserGroupIcon className="h-6 w-6 text-orange-600" aria-hidden="true" />
                    </div>
                    <div className="mt-3 text-center sm:mt-5">
                      <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                        Create a Community
                      </Dialog.Title>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Start a community to share your interests with like-minded people.
                        </p>
                      </div>
                      <div className="mt-8">
                        <div className="sm:col-span-6">
                          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 text-left">
                            Photo
                          </label>
                          <div className="mt-1 flex items-center">
                            <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                              {file ? (
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt="Community Photo"
                                  className="h-full w-full text-gray-300"
                                />
                              ) : (
                                <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                              )}
                            </span>
                            <input
                              type="file"
                              id="photo"
                              name="photo"
                              ref={inputFile}
                              onChange={handleFileInput}
                              style={{ display: 'none' }}
                            />
                            <button
                              type="button"
                              className="ml-5 rounded-md border border-gray-300 bg-white py-2 px-3 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
                              onClick={() => inputFile?.current?.click()}
                            >
                              {file ? 'Update image' : 'Select image'}
                            </button>
                          </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                              Name
                            </label>
                            <div className="mt-1">
                              <input
                                type="text"
                                name="name"
                                id="name"
                                autoComplete="off"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 text-left">
                              URL
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                crab.so/c/
                              </span>
                              <input
                                type="text"
                                name="slug"
                                id="slug"
                                autoComplete="off"
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <label htmlFor="about" className="block text-sm font-medium text-gray-700 text-left">
                              About
                            </label>
                            <div className="mt-1">
                              <textarea
                                id="about"
                                name="about"
                                rows={3}
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                defaultValue={''}
                              />
                            </div>
                            <p className="mt-2 text-sm text-gray-500 text-left">
                              Write a few sentences about your community.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 sm:mt-12">
                    <Button
                      type="button"
                      buttonType="slate"
                      onClick={() => setOpen(false)}
                      className="w-full justify-center"
                    >
                      Create Community
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
