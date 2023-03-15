import { Keypair } from '@solana/web3.js'
import { ProtocolOptions, SocialProtocol } from '@spling/social-protocol'
import type { NextApiRequest, NextApiResponse } from 'next'

import { supabase } from '@/lib'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { type } = req.query

  const keyPair = Keypair.generate()

  const socialProtocol = await new SocialProtocol(keyPair, null, { useIndexer: true } as ProtocolOptions).init()

  const groups = await socialProtocol.getAllGroups()

  if (type === 'direct') return res.status(200).json(groups)

  const { data, error } = await supabase.from('communities').select('*')

  if (error) return res.status(500).json({ error: error.message })

  const pks = data.map(community => community.public_key)

  const communities = groups.filter(group => pks.includes(group.publicKey.toString()))

  res.status(200).json(communities)
}
