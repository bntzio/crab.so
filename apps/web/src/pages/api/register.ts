import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getServiceSupabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { nickname, publicKey, userId, avatar, bio } = req.body

  if (!nickname || !publicKey || !userId || !avatar || !bio) return res.status(400).json({ error: 'Missing user data' })

  const serviceSupabase = getServiceSupabase()
  const supabaseClient = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const { error: existingError, data: existingData } = await serviceSupabase
    .from('users')
    .select('public_key, nickname')
    .eq('id', session.user.id)
    .single()

  if (existingError) return res.status(500).json({ error: existingError.message })

  // User is already registered, don't allow them to update their username, nickname or public key from this endpoint.
  if (existingData?.public_key && existingData?.nickname) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { error, data } = await serviceSupabase
    .from('users')
    .update({ nickname, public_key: publicKey })
    .eq('id', session.user.id)

  if (error) return res.status(500).json({ error: error.message })

  const { error: profileError } = await serviceSupabase
    .from('profiles')
    .update({ nickname, avatar, bio, user_id: Number(userId), updated_at: new Date().toISOString() })
    .eq('id', session.user.id)

  if (profileError) return res.status(500).json({ error: profileError.message })

  await supabaseClient.auth.updateUser({
    data: {
      nickname,
      publicKey,
      userId: Number(userId),
    },
  })

  return res.status(200).send(data)
}
