import { LockClosedIcon } from '@heroicons/react/20/solid'
import { useForm, SubmitHandler } from 'react-hook-form'

import { isProd } from '@/helpers'
import { supabase } from '@/lib/supabase'

type Inputs = {
  email: string
}

export default function LoginPage() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<Inputs>()

  const onSignIn: SubmitHandler<Inputs> = async ({ email }) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: isProd ? 'https://www.crab.so/auth' : 'http://localhost:3000/auth',
      },
    })

    reset()

    // TODO: Render error toast
    if (error) return console.error(error)
  }

  console.log(isSubmitSuccessful)

  return (
    <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        {isSubmitSuccessful ? (
          <div>
            <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Check your email</h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              We've sent you a <span className="font-medium text-orange-600">magic link</span> to your inbox. Click the
              link to sign in.
            </p>
          </div>
        ) : (
          <>
            <div>
              <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
                Sign in to your account
              </h2>
              <p className="mt-2 text-center text-sm text-gray-600">
                We will send you a <span className="font-medium text-orange-600">magic link</span> to your inbox so you
                can sign in.
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSignIn)}>
              <div className="-space-y-px rounded-md shadow-sm">
                <div>
                  <label htmlFor="email-address" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="email-address"
                    type="email"
                    autoComplete="email"
                    placeholder="Email"
                    className="relative block w-full rounded-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6"
                    {...register('email', { required: true })}
                  />
                  {errors.email && <span className="text-red-500 text-sm font-medium">Email is required</span>}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="group relative flex w-full justify-center rounded-md bg-orange-600 py-2 px-3 text-sm font-semibold text-white hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <LockClosedIcon
                      className="h-5 w-5 text-orange-500 group-hover:text-orange-400"
                      aria-hidden="true"
                    />
                  </span>
                  {!isSubmitting ? (
                    'Sign in'
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
                      Sending...
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
