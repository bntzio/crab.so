import { NewCommunityForm } from '@/components'

export default function NewCommunity() {
  return (
    <main className="py-8">
      <h1 className="text-xl font-medium">Create a new community</h1>
      <div className="mt-10">
        <NewCommunityForm />
      </div>
    </main>
  )
}
