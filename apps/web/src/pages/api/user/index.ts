import { Keypair, PublicKey } from '@solana/web3.js'
import { ProtocolOptions, SocialProtocol } from '@spling/social-protocol'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id, publicKey } = req.query

  if (!id && !publicKey) return res.status(400).json({ error: 'Missing user id or publicKey' })

  const keyPair = Keypair.generate()

  const socialProtocol = await new SocialProtocol(keyPair, null, { useIndexer: true } as ProtocolOptions).init()

  if (id) {
    const user = await socialProtocol.getUser(Number(id))

    return res.status(200).json(user)
  }

  if (publicKey) {
    const user = await socialProtocol.getUserByPublicKey(new PublicKey(publicKey))

    return res.status(200).json(user)
  }

  return res.status(400).json({ error: 'Missing user id or publicKey' })
}
