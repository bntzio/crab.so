import { useWallet } from '@solana/wallet-adapter-react'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { useState, useRef } from 'react'
import { Button } from 'ui'

import { useSplingStore } from '@/stores'
import { fileToBase64 } from '@/utils'

export default function SignupForm() {
  const user = useUser()
  const wallet = useWallet()
  const router = useRouter()
  const [file, setFile] = useState<File>()
  const inputFile = useRef<HTMLInputElement | null>(null)
  const { socialProtocol } = useSplingStore()
  const supabaseClient = useSupabaseClient()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)

    const username = formData.get('username') as string
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
        if (!user) throw new Error('User not authenticated')
        if (!wallet?.publicKey) throw new Error('Wallet not connected')

        // Check username availability before creating user on the social protocol.
        const { data, error } = await supabaseClient.from('profiles').select('username').eq('username', username)

        if (error) throw new Error(error.message)

        if (data.length) throw new Error('Username already taken')

        const result = await socialProtocol?.createUser(username, avatar, bio)

        if (result) {
          await fetch('/api/register', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bio: result.bio,
              avatar: result.avatar,
              userId: result.userId,
              username: result.nickname,
              publicKey: wallet.publicKey.toString(),
            }),
          })

          router.push('/home')
        }
      } catch (e) {
        console.log('error', e) // TODO: Render error toast
      }
    }
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFile(file)
  }

  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={handleSubmit}>
      <div className="space-y-8 divide-y divide-gray-200">
        <div>
          <div>
            <h3 className="text-lg font-medium leading-6 text-gray-900">Let's create your account</h3>
            <p className="mt-1 text-sm text-gray-500">
              An account is needed to interact with the network and follow other users.
            </p>
          </div>

          <div className="flex my-6 items-center">
            <p className="text-xs text-slate-500">
              Connected as <span className="font-medium">{wallet.publicKey?.toString()}</span>
            </p>
            <a
              className="text-gray-500 hover:text-gray-700 cursor-pointer text-xs font-semibold"
              onClick={async ev => {
                ev.preventDefault()
                await wallet.disconnect()
              }}
            >
              Disconnect
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="username"
                  id="username"
                  autoComplete="off"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500 sm:text-sm"
                />
              </div>
              <p className="mt-2 text-sm text-gray-500">Choose wisely, you won't be able to change it later.</p>
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
