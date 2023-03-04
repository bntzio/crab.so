import Image from 'next/image'
import { useEffect, useState } from 'react'

import { supabase } from '@/lib'

const CommunityShowcase = () => {
  const [communities, setCommunities] = useState<any[]>([])

  useEffect(() => {
    async function getCommunities() {
      const { data, error } = await supabase.from('communities').select('*').limit(6)

      if (error) return error

      setCommunities(data)
    }

    getCommunities()
  }, [])

  const renderCommunities = () => {
    return communities.map(community => (
      <div className="flex flex-col justify-center items-center p-3 space-y-2">
        <Image src="/images/genesysgo.png" alt={community.name} width={66} height={66} />
        <div className="space-y-1 flex flex-col items-center">
          <h4 className="text-gray-500 font-normal">{community.name}</h4>
          <p className="text-gray-400 text-xs">117 members</p>
        </div>
      </div>
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
