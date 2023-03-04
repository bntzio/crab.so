import Image from 'next/image'

const CommunityShowcase = () => {
  return (
    <section>
      <div className="mb-4">
        <p className="text-gray-600 font-medium text-sm">Active communities</p>
      </div>
      <div className="flex justify-between">
        <div className="flex flex-col justify-center items-center p-3 space-y-2">
          <Image src="/images/genesysgo.png" alt="GenesysGo 1" width={66} height={66} />
          <div className="space-y-1">
            <h4 className="text-gray-500 font-normal">GenesysGo</h4>
            <p className="text-gray-400 text-xs">117 members</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-3 space-y-2">
          <Image src="/images/genesysgo.png" alt="GenesysGo 2" width={66} height={66} />
          <div className="space-y-1 flex flex-col items-center">
            <h4 className="text-gray-500 font-normal">GenesysGo</h4>
            <p className="text-gray-400 text-xs">117 members</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-3 space-y-2">
          <Image src="/images/genesysgo.png" alt="GenesysGo 3" width={66} height={66} />
          <div className="space-y-1 flex flex-col items-center">
            <h4 className="text-gray-500 font-normal">GenesysGo</h4>
            <p className="text-gray-400 text-xs">117 members</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-3 space-y-2">
          <Image src="/images/genesysgo.png" alt="GenesysGo 4" width={66} height={66} />
          <div className="space-y-1 flex flex-col items-center">
            <h4 className="text-gray-500 font-normal">GenesysGo</h4>
            <p className="text-gray-400 text-xs">117 members</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-3 space-y-2">
          <Image src="/images/genesysgo.png" alt="GenesysGo 5" width={66} height={66} />
          <div className="space-y-1 flex flex-col items-center">
            <h4 className="text-gray-500 font-normal">GenesysGo</h4>
            <p className="text-gray-400 text-xs">117 members</p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center p-3 space-y-2">
          <Image src="/images/genesysgo.png" alt="GenesysGo 6" width={66} height={66} />
          <div className="space-y-1 flex flex-col items-center">
            <h4 className="text-gray-500 font-normal">GenesysGo</h4>
            <p className="text-gray-400 text-xs">117 members</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CommunityShowcase
