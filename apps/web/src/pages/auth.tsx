import { useEffect } from 'react'

export default function AuthPage() {
  useEffect(() => {
    setTimeout(() => {
      window.location.href = '/home'
    }, 2000)
  }, [])

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="mt-16">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Authenticating...</h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            We'll redirect you to your{' '}
            <a href="#" className="font-medium text-orange-600 hover:text-orange-500">
              account
            </a>{' '}
            in just a moment.
          </p>
        </div>
      </div>
    </div>
  )
}
