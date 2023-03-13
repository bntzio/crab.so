import { useState, useRef } from 'react'
import { Button } from 'ui'

import { isProd } from '@/helpers'
import { supabase } from '@/lib'
import { useSplingStore } from '@/stores'
import { fileToBase64 } from '@/utils'

export default function SignupForm() {
  const [file, setFile] = useState<File>()
  const inputFile = useRef<HTMLInputElement | null>(null)
  const { socialProtocol } = useSplingStore()

  // eslint-disable-next-line unused-imports/no-unused-vars
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)

    const nickname = formData.get('nickname') as string
    const file = formData.get('avatar') as File
    const bio = formData.get('bio') as string

    const encoded = await fileToBase64(file)

    if (encoded && typeof encoded === 'string') {
      const avatar = {
        base64: encoded,
        size: file.size,
        type: file.type,
      }

      try {
        await socialProtocol?.createUser(nickname, avatar, bio, null)
      } catch (e) {
        console.log(e) // TODO: Render error toast
      }
    }
  }

  const signInWithEmail = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)

    const email = formData.get('email') as string

    if (!email) return

    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: isProd ? 'https://crab.so/home' : 'http://localhost:3000/home',
      },
    })

    if (error) {
      console.log(error)
    }

    if (data) {
      console.log(data)
    }
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFile(file)
  }

  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={signInWithEmail}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Let's create your account</h3>
            <p className="mt-1 text-sm text-gray-500">
              An account is needed to interact with the network and follow other users.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700">
                Nickname
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="nickname"
                  id="nickname"
                  autoComplete="off"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  name="email"
                  id="email"
                  autoComplete="off"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="avatar" className="block text-sm font-medium text-gray-700">
                Avatar
              </label>
              <div className="mt-1 flex items-center">
                <span className="h-12 w-12 overflow-hidden rounded-full bg-gray-100">
                  {file ? (
                    <img src={URL.createObjectURL(file)} alt="avatar" className="h-full w-full text-gray-300" />
                  ) : (
                    <svg className="h-full w-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  )}
                </span>
                <input
                  type="file"
                  id="avatar"
                  name="avatar"
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

            <div className="sm:col-span-6">
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <div className="mt-1">
                <textarea
                  id="bio"
                  name="bio"
                  rows={3}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                  defaultValue={''}
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Button type="submit" buttonType="slate">
            Create your account
          </Button>
        </div>
      </div>
    </form>
  )
}
