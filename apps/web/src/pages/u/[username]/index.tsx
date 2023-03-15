import { UserPlusIcon, UserMinusIcon, BoltIcon } from '@heroicons/react/20/solid'
import { User, Post } from '@spling/social-protocol'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { ProfileFeed } from '@/components'
import { useSplingStore, useUserStore } from '@/stores'
import { Database } from '@/types/supabase'

export default function UserProfile() {
  const router = useRouter()
  const { socialProtocol } = useSplingStore()
  const supabaseClient = useSupabaseClient<Database>()
  const [user, setUser] = useState<User | null>()
  const { user: currentUser } = useUserStore()
  const [posts, setPosts] = useState<Post[]>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const supabaseProfile = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('username', router.query.username)
        .single()

      if (supabaseProfile.data?.user_id) {
        let usr: User | null | undefined
        let usrPosts: Post[] | null | undefined

        if (currentUser) {
          usr = await socialProtocol?.getUser(supabaseProfile.data.user_id)
          usrPosts = await socialProtocol?.getAllPostsByUserId(supabaseProfile.data.user_id)
        } else {
          const userResponse = await fetch(`/api/user?id=${supabaseProfile.data.user_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          usr = (await userResponse.json()) as User

          const userPostsResponse = await fetch(`/api/user/posts?id=${supabaseProfile.data.user_id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          })

          usrPosts = (await userPostsResponse.json()) as Post[]
        }

        if (usr) {
          setUser(usr)
        } else {
          setUser(null)
        }

        if (usrPosts && usrPosts.length > 0) {
          setPosts(usrPosts)
        } else {
          setPosts([])
        }
      } else {
        setUser(null)
      }
    }

    init()
  }, [supabaseClient, socialProtocol, currentUser, router])

  useEffect(() => {
    if (user !== undefined) setLoading(false)
  }, [user])

  if (loading || !user) return null

  const handleFollowUser = async () => await socialProtocol?.followUser(user?.userId)

  const handleUnfollowUser = async () => await socialProtocol?.unfollowUser(user?.userId)

  return (
    <main className="mt-16">
      <section className="flex flex-col items-center space-y-5">
        <div className="relative w-32 h-32">
          <Image
            // TODO: Add default empty avatar image
            src={user.avatar || ''}
            alt={`${user.nickname} avatar`}
            className="rounded-full"
            fill
          />
        </div>
        <div className="flex flex-col items-center space-y-1">
          <h1 className="text-lg font-semibold text-gray-800">{user.nickname}</h1>
          <h2 className="text-sm text-gray-600/90">{user.bio}</h2>
        </div>
        {!currentUser || currentUser?.userId === user.userId ? null : (
          <div>
            {currentUser?.following.includes(user.userId) ? (
              <Button className="h-7 bg-red-500 hover:bg-red-600 focus:ring-red-400" onClick={handleUnfollowUser}>
                <UserMinusIcon className="w-4 h-4 mr-2 text-white" />
                <span className="text-xs">Unfollow {user.nickname}</span>
              </Button>
            ) : (
              <Button className="h-7" onClick={handleFollowUser}>
                <UserPlusIcon className="w-4 h-4 mr-2 text-white" />
                <span className="text-xs">Follow {user.nickname}</span>
              </Button>
            )}
          </div>
        )}
        <div className="flex items-center space-x-5 pt-2">
          <div className="flex flex-col items-center space-y-1 text-sm text-gray-500/90 w-20">
            <p className="">Following</p>
            <span className="font-semibold">{user.following.length}</span>
          </div>
          <div className="flex flex-col items-center space-y-1 text-sm text-gray-500/90 w-20">
            <p className="">Communities</p>
            <span className="font-semibold">{user.groups.length}</span>
          </div>
          <div className="flex flex-col items-center space-y-1 text-sm text-gray-500/90 w-20">
            <p className="">Publications</p>
            <span className="font-semibold">{posts?.length}</span>
          </div>
        </div>
      </section>
      <section className="flex flex-col mt-12 space-y-4">
        <p className="text-gray-500/90 text-sm flex items-center">
          <BoltIcon className="w-4 h-4 mr-1" />
          <span>Latest activity</span>
        </p>
        {!posts?.length ? (
          <div className="text-gray-400/90 text-sm">No activity from {user.nickname}</div>
        ) : (
          <ProfileFeed posts={posts} />
        )}
      </section>
    </main>
  )
}
