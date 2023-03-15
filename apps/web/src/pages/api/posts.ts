import { Keypair } from '@solana/web3.js'
import { ProtocolOptions, SocialProtocol } from '@spling/social-protocol'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { groupId } = req.query

  if (!groupId) return res.status(400).json({ error: 'Incomplete query' })

  const keyPair = Keypair.generate()

  const socialProtocol = await new SocialProtocol(keyPair, null, { useIndexer: true } as ProtocolOptions).init()

  const posts = await socialProtocol.getAllPosts(Number(groupId))

  res.status(200).json(posts)
}
