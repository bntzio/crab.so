import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useEffect } from 'react'
import { Button } from 'ui'

import { Feed } from '@/components'
import { useSplingStore } from '@/stores'

export default function Index() {
  const wallet = useWallet()
  const { setVisible } = useWalletModal()
  const { startSocialProtocol, socialProtocol } = useSplingStore()

  const { connected } = wallet

  useEffect(() => {
    if (wallet?.publicKey) startSocialProtocol({ wallet })
  }, [wallet, startSocialProtocol])

  useEffect(() => {
    async function getGroups() {
      if (socialProtocol) {
        const allGroups = await socialProtocol.getAllGroups()
        console.log(allGroups)
      }
    }

    getGroups()
  }, [socialProtocol])

  return (
    <main>
      <section>
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
