import { useWallet } from '@solana/wallet-adapter-react'
import { useUser } from '@supabase/auth-helpers-react'
import { useState, useEffect, useRef } from 'react'
import { Button } from 'ui'

import { useSplingStore } from '@/stores'
import { fileToBase64 } from '@/utils'

export default function SignupForm() {
  const user = useUser()
  const wallet = useWallet()
  const [file, setFile] = useState<File>()
  const inputFile = useRef<HTMLInputElement | null>(null)
  const { socialProtocol } = useSplingStore()
  const [userAlert, setUserAlert] = useState<boolean>()
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    async function check() {
      if (wallet?.publicKey) {
        const response = await fetch(`/api/user?publicKey=${wallet.publicKey.toString()}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await response.json()

        if (data) setUserAlert(true)
      }
    }

    if (!userAlert) check()
  }, [wallet, userAlert])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const formData = new FormData(event.target as HTMLFormElement)

    const nickname = formData.get('nickname') as string
    const file = formData.get('avatar') as File
    const bio = formData.get('bio') as string

    if (!nickname || !file || !bio) return

    const encoded = await fileToBase64(file)

    if (encoded && typeof encoded === 'string') {
      setSubmitting(true)

      const avatar = {
        base64: encoded,
        size: file.size,
        type: file.type,
      }

      try {
        if (!user) throw new Error('User not authenticated')
        if (!wallet?.publicKey) throw new Error('Wallet not connected')

        const result = await socialProtocol?.createUser(nickname, avatar, bio)

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
              nickname: result.nickname,
              publicKey: wallet.publicKey.toString(),
            }),
          })

          window.location.href = '/home'
        }
      } catch (e) {
        console.error(e) // TODO: Render error toast
      } finally {
        setSubmitting(false)
      }
    }
  }

  const handleFileInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    setFile(file)
  }

  const onDeleteAccount = async () => {
    try {
      setSubmitting(true)
      await socialProtocol?.deleteUser()
      setUserAlert(false)
    } catch (e) {
      console.error(e) // TODO: Render error toast
    } finally {
      setSubmitting(false)
    }
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

          {userAlert ? (
            <div className="bg-red-50 px-4 py-3 rounded-md">
              <p className="text-sm text-red-500/90">
                You already have an account associated with this wallet. Please use another wallet or{' '}
                <span
                  className="cursor-pointer text-red-500 font-medium hover:underline"
                  onClick={async () => {
                    await socialProtocol?.deleteUser()
                    setUserAlert(false)
                  }}
                >
                  delete your existing account
                </span>
                .
              </p>
              {/* TODO: Render existing user details */}
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-6">
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
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">You can always change it later.</p>
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
                    required
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
                    required
                  />
                </div>
                <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          {userAlert ? (
            <Button buttonType="danger" disabled={submitting} onClick={onDeleteAccount}>
              {!submitting ? (
                <>Delete your account</>
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
                  Deleting your account...
                </>
              )}
            </Button>
          ) : (
            <Button type="submit" buttonType="slate" disabled={submitting}>
              {!submitting ? (
                <>Create your account</>
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
                  Creating account...
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </form>
  )
}
