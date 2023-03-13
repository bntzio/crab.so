import { useWallet } from '@solana/wallet-adapter-react'
import { useUser } from '@supabase/auth-helpers-react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

import { Feed, CreateCommunityModal } from '@/components'
import { useSplingStore, useModalStore } from '@/stores'

export default function Home() {
  const user = useUser()
  const wallet = useWallet()
  const router = useRouter()
  const { activeModal } = useModalStore()
  const { getAllGroups, socialProtocol } = useSplingStore()

  const { connected } = wallet

  useEffect(() => {
    console.log('Supabase user:', user)
  }, [user])

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
      <section className={clsx(!connected ? 'mt-0' : 'mt-16', 'space-y-12')}>
        <CreateCommunityModal isOpen={activeModal === 'createCommunity'} />
        {connected && <Feed />}
      </section>
    </main>
  )
}
