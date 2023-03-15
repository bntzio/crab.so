import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useUser, useSupabaseClient } from '@supabase/auth-helpers-react'
import clsx from 'clsx'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { Feed, CreateCommunityModal } from '@/components'
import { useSplingStore, useModalStore } from '@/stores'

export default function Home() {
  const user = useUser()
  const wallet = useWallet()
  const router = useRouter()
  const supabase = useSupabaseClient()
  const { activeModal } = useModalStore()
  const { setVisible } = useWalletModal()
  const [loading, setLoading] = useState(true)
  const [linkedWallet, setLinkedWallet] = useState()
  const { getAllGroups, socialProtocol } = useSplingStore()

  const { connected } = wallet

  useEffect(() => {
    async function init() {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setLinkedWallet(user.user_metadata?.publicKey)
          setLoading(false)
        }
      } else {
        setLoading(false)
      }
    }

    init()
  }, [supabase.auth])

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

  if (loading) return null

  return (
    <main>
      <section className={clsx(!connected ? 'mt-0' : 'mt-16', 'space-y-12')}>
        <CreateCommunityModal isOpen={activeModal === 'createCommunity'} />
        {user ? (
          <Feed />
        ) : (
          <div className="mt-28 flex flex-col justify-center items-center">
            <div className="space-y-1 flex flex-col items-center mb-6">
              <h1 className="text-xl font-semibold">Almost there!</h1>
              <p className="text-gray-600/90">Connect your Solana wallet to continue</p>
            </div>
            <Button onClick={() => setVisible(true)}>Connect wallet</Button>
            {linkedWallet && (
              <div className="flex flex-col items-center space-y-1 mt-4">
                <p className="text-gray-500/90 text-sm">Your linked wallet address is:</p>
                <span className="text-xs text-gray-500/90 font-semibold">{linkedWallet}</span>
              </div>
            )}
          </div>
        )}
      </section>
    </main>
  )
}
