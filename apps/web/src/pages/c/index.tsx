import Link from 'next/link'

export const communities = [
  {
    name: 'Solana',
    slug: 'solana',
  },
  {
    name: 'Solana Mobile',
    slug: 'solana-mobile',
  },
  {
    name: 'Grizzlython',
    slug: 'grizzlython',
  },
  {
    name: 'LamportDAO',
    slug: 'lamportdao',
  },
  {
    name: 'Breakpoint',
    slug: 'breakpoint',
  },
  {
    name: 'Rust',
    slug: 'rust',
  },
  {
    name: 'Anchor',
    slug: 'anchor',
  },
  {
    name: 'xNFT',
    slug: 'xnft',
  },
  {
    name: 'Backpack',
    slug: 'backpack',
  },
  {
    name: 'Phantom',
    slug: 'phantom',
  },
  {
    name: 'Magic Eden',
    slug: 'magiceden',
  },
  {
    name: 'GenesysGo',
    slug: 'genesysgo',
  },
  {
    name: 'Degen Ape Academy',
    slug: 'degen-ape-academy',
  },
]

export default function Communities() {
  return (
    <main>
      <h1 className="text-xl font-medium">Communities</h1>

      <div className="mt-6">
        <ul className="space-y-1">
          {communities.map(community => (
            <li key={community.slug}>
              <Link href="/c/[community]" as={`/c/${community.slug}`} className="text-blue-500 hover:underline">
                {community.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  )
}
