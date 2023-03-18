import { Dialog, Transition } from '@headlessui/react'
import { UserGroupIcon } from '@heroicons/react/24/outline'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { Fragment, useEffect, useRef } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Button } from 'ui'

import { Database } from '@/types/supabase'

type Inputs = {
  name: string
  slug: string
  about: string
}

interface Props {
  open: boolean
  setOpen: (open: boolean) => void
}

export default function SubmitCommunityModal({ open, setOpen }: Props) {
  const user = useUser()
  const supabaseClient = useSupabaseClient<Database>()
  const cancelButtonRef = useRef(null)
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  useEffect(() => {
    if (!open) reset()
  }, [open, reset])

  const onSubmit: SubmitHandler<Inputs> = async ({ name, slug, about }) => {
    if (!user) return

    try {
      const result = await supabaseClient
        .from('community_requests')
        .select('id', {
          count: 'exact',
        })
        .eq('user_id', user?.id)

      // Only allow 3 requests per user
      if (result?.count && result.count > 2) {
        toast.error(`You've already submitted the maximum number of requests!`, {
          position: 'bottom-center',
        })
      } else {
        await supabaseClient.from('community_requests').insert({ name, slug, about, user_id: user.id })

        toast.success(`Thanks! We'll reach out via email!`, {
          position: 'bottom-center',
          duration: 5000,
        })

        setOpen(false)
      }
    } catch (e) {
      console.error(e) // TODO: Render error toast
    }
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
                <form onSubmit={handleSubmit(onSubmit)}>
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
                          Tell us about your community. We'll review it and get back to you.
                        </p>
                      </div>
                      <div className="mt-8">
                        <div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                          <div className="sm:col-span-6">
                            <div className="flex justify-between items-center">
                              <label htmlFor="name" className="block text-sm font-medium text-gray-700 text-left">
                                Community name
                              </label>
                              {errors.name && (
                                <span className="text-red-500 text-sm font-medium">This field is required</span>
                              )}
                            </div>
                            <div className="mt-1">
                              <input
                                id="name"
                                type="text"
                                autoComplete="off"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                {...register('name', { required: true })}
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <div className="flex justify-between items-center">
                              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 text-left">
                                Desired URL
                              </label>
                              {errors.slug && (
                                <span className="text-red-500 text-sm font-medium">This field is required</span>
                              )}
                            </div>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-gray-500 sm:text-sm">
                                crab.so/c/
                              </span>
                              <input
                                id="slug"
                                type="text"
                                autoComplete="off"
                                className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-gray-300 focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                {...register('slug', { required: true })}
                              />
                            </div>
                          </div>

                          <div className="sm:col-span-6">
                            <div className="flex justify-between items-center">
                              <label htmlFor="about" className="block text-sm font-medium text-gray-700 text-left">
                                About
                              </label>
                              {errors.about && (
                                <span className="text-red-500 text-sm font-medium">This field is required</span>
                              )}
                            </div>
                            <div className="mt-1">
                              <textarea
                                rows={3}
                                id="about"
                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                                {...register('about', { required: true })}
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
                    <Button type="submit" buttonType="slate" className="w-full justify-center" disabled={isSubmitting}>
                      {!isSubmitting ? (
                        <>Submit</>
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
                          Submitting...
                        </>
                      )}
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
