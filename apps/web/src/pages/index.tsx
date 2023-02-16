import { UserGroupIcon } from '@heroicons/react/24/outline'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { ProtocolOptions, SocialProtocol } from '@spling/social-protocol'
import { useRouter } from 'next/router'
import { useRef, useEffect } from 'react'
import { Button } from 'ui'

import { Feed } from '@/components/Feed'

export default function Index() {
  const wallet = useWallet()
  const router = useRouter()
  const { setVisible } = useWalletModal()
  const socialProtocolRef = useRef<SocialProtocol | null>(null)

  const { connected, disconnect } = wallet

  useEffect(() => {
    async function init() {
      const options = {
        rpcUrl: 'https://api.mainnet-beta.solana.com/',
        useIndexer: true,
      } as ProtocolOptions

      const socialProtocol: SocialProtocol = await new SocialProtocol(wallet, null, options).init()

      socialProtocolRef.current = socialProtocol

      const groups = await socialProtocolRef.current?.getAllGroups()

      console.log(groups)
    }

    if (wallet?.publicKey) init()
  }, [wallet])

  return (
    <main>
      <section className="mt-4">
        <div className="flex justify-between items-center">
          <p className="text-black font-normal text-2xl">
            <span aria-label="crab" role="img">
              🦀
            </span>
          </p>
          {!connected ? (
            <Button onClick={() => setVisible(true)}>
              <UserGroupIcon className="h-5 w-5 text-white mr-2" aria-hidden="true" />
              Create a community
            </Button>
          ) : (
            <div className="space-x-4">
              <Button onClick={async () => router.push('/c/new')}>Create a Community</Button>
              <Button buttonType="slate" onClick={async () => await disconnect()}>
                Disconnect
              </Button>
            </div>
          )}
        </div>
        {!connected && (
          <div className="flex flex-col space-y-6 py-20">
            <h1 className="text-xl font-medium leading-normal">
              Crab is a community-driven, open-source, decentralized network for thriving communities in Web3
            </h1>
            <div className="flex flex-col items-start space-y-3">
              <Button buttonType="slate" onClick={() => setVisible(true)}>
                Join the network
              </Button>
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
        )}
      </section>
      <div className={!connected ? 'mt-0' : 'mt-16'}>
        <div className="mb-5">
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
