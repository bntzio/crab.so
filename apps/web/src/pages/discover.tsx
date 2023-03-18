import { Group } from '@spling/social-protocol'
import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from 'ui'

import { CreateCommunityModal, SubmitCommunityModal } from '@/components'
import { useModalStore } from '@/stores'

export default function Discover() {
  const { activeModal, setActiveModal } = useModalStore()
  const [communities, setCommunities] = useState<Group[]>([])
  const [isSubmitCommunityModalOpen, setIsSubmitCommunityModalOpen] = useState(false)

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

  useEffect(() => {
    function cmdk(e: KeyboardEvent) {
      if (e.metaKey && e.key === 'k') {
        setActiveModal('createCommunity')
      }
    }

    addEventListener('keydown', cmdk)

    return () => {
      removeEventListener('keydown', cmdk)
    }
  }, [setActiveModal])

  return (
    <main>
      <div className="flex items-center mt-10 justify-between">
        <h1 className="text-xl font-medium">Discover Communities</h1>
        <Button onClick={() => setIsSubmitCommunityModalOpen(true)}>Create a community</Button>
      </div>

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
      <CreateCommunityModal isOpen={activeModal === 'createCommunity'} />
      <SubmitCommunityModal open={isSubmitCommunityModalOpen} setOpen={setIsSubmitCommunityModalOpen} />
    </main>
  )
}
