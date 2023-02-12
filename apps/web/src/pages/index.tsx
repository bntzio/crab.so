import { Feed } from '@/components/Feed'

export default function Index() {
  return (
    <main>
      <section className="mt-4">
        <div className="flex justify-between">
          <h1 className="text-black font-medium items-center flex">
            <span aria-label="crab" role="img" className="mr-3">
              🦀
            </span>
            <span>the front page of web3</span>
          </h1>
          <button>Create a community</button>
        </div>
        <div className="flex flex-col space-y-4 py-20">
          <h2 className="font-semibold">
            Crab is a community-driven, open-source, decentralized network for thriving communities.
          </h2>
          <div className="flex flex-col items-start space-y-3">
            <button>Join the network</button>
            <p className="text-sm">
              or{' '}
              <a href="#" className="text-blue-500 border-b-2 border-blue-100 hover:border-blue-300">
                learn more about it
              </a>
            </p>
          </div>
        </div>
      </section>
      <div>
        <div>
          <p className="text-black font-medium items-center flex">
            <span aria-label="crab" role="img" className="mr-3">
              ✍️
            </span>
            <span>recent posts</span>
          </p>
        </div>
        <Feed />
      </div>
    </main>
  )
}
