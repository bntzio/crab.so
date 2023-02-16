import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { ProtocolOptions, SocialProtocol } from '@spling/social-protocol'
import { useRef, useEffect } from 'react'
import { Button } from 'ui'

import { Navbar, Feed } from '@/components'

export default function Index() {
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const socialProtocolRef = useRef<SocialProtocol | null>(null)

  const { connected } = wallet

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
        <Navbar />
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
