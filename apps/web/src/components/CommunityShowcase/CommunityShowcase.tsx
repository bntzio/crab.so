import { Group } from '@spling/social-protocol'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CommunityShowcase = () => {
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

  const renderCommunities = () => {
    return communities.map(community => (
      <Link href={`/c/${community.metadata?.slug}`} key={community.groupId}>
        <div className="flex flex-col justify-center items-center">
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
        </div>
      </Link>
    ))
  }

  return (
    <section>
      <div className="flex justify-start space-x-3">{renderCommunities()}</div>
    </section>
  )
}

export default CommunityShowcase
