import { Group } from '@spling/social-protocol'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export default function Communities() {
  const [communities, setCommunities] = useState<Group[]>([])

  useEffect(() => {
    async function getCommunities() {
      try {
        const response = await fetch('/api/communities')
        const data = await response.json()

        setCommunities(data)
      } catch (e) {
        console.error(e)
      }
    }

    getCommunities()
  }, [])

  return (
    <main>
      <h1 className="text-xl font-medium mt-10">Communities</h1>

      <div className="mt-6">
        <ul className="space-y-3">
          {communities.map(community => (
            <li key={community.groupId}>
              <Link href="/c/[community]" as={`/c/${community.metadata?.slug}`} className="group">
                <div className="flex items-center space-x-3">
                  {community?.avatar ? (
                    <Image
                      src={community.avatar}
                      alt={community.name}
                      width={44}
                      height={44}
                      style={{ width: '44px', height: '44px' }}
                      className="rounded-full bg-cover bg-no-repeat"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-[44px] h-[44px] bg-orange-600 text-white font-medium rounded-full">
                      {community.name[0].toUpperCase()}
                    </div>
                  )}
                  <span className="text-gray-600 group-hover:text-orange-600">{community.name}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
