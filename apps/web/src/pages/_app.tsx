import '@/styles/globals.css'
import '@solana/wallet-adapter-react-ui/styles.css'
import { useWallet } from '@solana/wallet-adapter-react'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider, Session, useSupabaseClient } from '@supabase/auth-helpers-react'
import { Analytics } from '@vercel/analytics/react'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Toaster } from 'react-hot-toast'

import { WalletAdapter, Navbar } from '@/components'
import { MainLayout } from '@/layouts/MainLayout'
import { useSplingStore, useUserStore } from '@/stores'
import { Database } from '@/types/supabase'

function CrabApp({
  Component,
  pageProps,
}: AppProps<{
  initialSession: Session
}>) {
  const [supabaseClient] = useState(() => createBrowserSupabaseClient<Database>())

  return (
    <SessionContextProvider supabaseClient={supabaseClient} initialSession={pageProps.initialSession}>
      <MainLayout>
        <WalletAdapter>
          <App>
            <Navbar />
            <Component {...pageProps} />
          </App>
        </WalletAdapter>
      </MainLayout>
    </SessionContextProvider>
  )
}

const App = ({ children }: { children: React.ReactNode }) => {
  const wallet = useWallet()
  const router = useRouter()
  const { setUser } = useUserStore()
  const supabaseClient = useSupabaseClient()
  const { socialProtocol, startSocialProtocol } = useSplingStore()

  useEffect(() => {
    async function start() {
      // This prevents a user with a current connected wallet from being logged out when entering this page.
      if (router.pathname === '/home?action=connect') {
        await wallet.disconnect()
      }

      if (!wallet?.connected || !wallet.publicKey) return

      // Check that the logged in user is using the same wallet as the one they used to create their account.
      const {
        data: { session },
      } = await supabaseClient.auth.getSession()

      const {
        data: { user },
      } = await supabaseClient.auth.getUser()

      if (session && user) {
        if (
          user.user_metadata?.publicKey !== undefined &&
          user.user_metadata?.publicKey !== wallet.publicKey.toString()
        ) {
          await wallet.disconnect()
          await supabaseClient.auth.signOut()
          window.location.reload()
        } else {
          await startSocialProtocol({ wallet })
        }
      }
    }

    start()
  }, [router, wallet, startSocialProtocol, supabaseClient])

  useEffect(() => {
    async function saveCurrentUser() {
      if (!socialProtocol || !wallet?.publicKey) return

      const currentUser = await socialProtocol.getUserByPublicKey(wallet.publicKey)

      if (currentUser) setUser(currentUser)
    }

    saveCurrentUser()
  }, [socialProtocol, wallet, setUser])

  return (
    <div className="mt-4">
      {children}
      <Toaster />
      <Analytics />
    </div>
  )
}

export default CrabApp
