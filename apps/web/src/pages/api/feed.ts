import { Keypair } from '@solana/web3.js'
import { ProtocolOptions, SocialProtocol } from '@spling/social-protocol'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { userId } = req.query

  if (!userId) return res.status(400).json({ error: 'Missing userId' })

  const keyPair = Keypair.generate()

  const socialProtocol = await new SocialProtocol(keyPair, null, { useIndexer: true } as ProtocolOptions).init()

  const user = await socialProtocol.getUser(Number(userId))

  if (!user) return res.status(404).json({ error: 'User not found' })

  if (!user.groups.length) return res.status(200).json([])

  const feed = []

  for (const group of user.groups) {
    const g = await socialProtocol.getGroup(group)

    const posts = await socialProtocol.getAllPosts(group)

    if (!g) return feed.push(...posts)

    const postsWithGroup = posts.map(post => ({
      ...post,
      group: {
        name: g.name,
      },
    }))

    feed.push(...postsWithGroup)
  }

  res.status(200).json(feed)
}
