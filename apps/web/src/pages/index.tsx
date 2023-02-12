import { UserGroupIcon } from '@heroicons/react/24/outline'
import { Button } from 'ui'

import { Feed } from '@/components/Feed'

export default function Index() {
  return (
    <main>
      <section className="mt-4">
        <div className="flex justify-between items-center">
          <h1 className="text-black font-normal">
            <span aria-label="crab" role="img" className="mr-3">
              🦀
            </span>
            <span>the front page of web3</span>
          </h1>
          <Button>
            <UserGroupIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
            Create a community
          </Button>
        </div>
        <div className="flex flex-col space-y-6 py-20">
          <h2 className="text-xl font-medium leading-normal">
            Crab is a community-driven, open-source, decentralized network for thriving communities around the world.
          </h2>
          <div className="flex flex-col items-start space-y-3">
            <Button buttonType="slate">Join the network</Button>
            <p className="text-xs">
              or{' '}
              <a
                href="#"
                className="text-orange-400 hover:text-orange-500 border-b-2 border-orange-200 hover:border-orange-400"
              >
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
