import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { Button } from 'ui'

import { CommunityShowcase } from '@/components'
import { useSplingStore } from '@/stores'

export default function Index() {
  const wallet = useWallet()
  const router = useRouter()
  const { getAllGroups, socialProtocol } = useSplingStore()

  useEffect(() => {
    async function fetchProtocolInfo() {
      setTimeout(async () => {
        const allGroups = await getAllGroups()
        console.log('all groups', allGroups)

        if (wallet?.publicKey) {
          const user = await socialProtocol?.getUserByPublicKey(wallet.publicKey)
          console.log('my user', user)
        }
      }, 1200)
    }

    fetchProtocolInfo()
  }, [wallet, socialProtocol, getAllGroups, router])

  return (
    <main>
      <section>
        <div className="flex flex-col space-y-6 py-20">
          <h1 className="text-xl font-medium leading-normal">
            Crab is a community-driven, open-source, decentralized network for thriving communities in Web3
          </h1>
          <div className="flex flex-col items-start space-y-3">
            <Button buttonType="slate" onClick={() => router.push('/login')}>
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
      </section>
      <CommunityShowcase />
    </main>
  )
}
