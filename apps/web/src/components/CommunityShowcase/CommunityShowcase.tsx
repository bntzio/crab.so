import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CommunityShowcase = () => {
  const [communities, setCommunities] = useState<any[]>([])

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
        <div className="flex flex-col justify-center items-center p-3 space-y-2">
          {community?.avatar ? (
            <Image
              src={community.avatar}
              alt={community.name}
              width={66}
              height={66}
              style={{ width: '66px', height: '66px' }}
              className="rounded-full bg-cover bg-no-repeat"
            />
          ) : (
            <div className="flex justify-center items-center w-[66px] h-[66px] bg-orange-600 text-white font-medium rounded-full">
              {community.name[0].toUpperCase()}
            </div>
          )}
          <div className="space-y-1 flex flex-col items-center">
            <h4 className="text-gray-500 font-normal">{community.name}</h4>
            <p className="text-gray-400 text-xs">117 members</p>
          </div>
        </div>
      </Link>
    ))
  }

  return (
    <section>
      <div className="mb-4">
        <p className="text-gray-600 font-medium text-sm">Active communities</p>
      </div>
      <div className="flex justify-between">{renderCommunities()}</div>
    </section>
  )
}

export default CommunityShowcase
