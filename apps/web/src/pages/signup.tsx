import { SignupForm } from '@/components'

export default function Signup() {
  return (
    <main className="py-8">
      <h1 className="text-xl font-medium">
        Welcome to Crab!{' '}
        <span role="img" aria-label="waving hand">
          👋
        </span>
      </h1>
      <div className="mt-10">
        <SignupForm />
      </div>
    </main>
  )
}
