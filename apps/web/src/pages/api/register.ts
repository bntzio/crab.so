import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import type { NextApiRequest, NextApiResponse } from 'next'

import { getServiceSupabase } from '@/lib/supabase'
import { Database } from '@/types/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { username, publicKey } = req.body

  if (!username || !publicKey) return res.status(400).json({ error: 'Missing user data' })

  const serviceSupabase = getServiceSupabase()
  const supabaseClient = createServerSupabaseClient<Database>({ req, res })

  const {
    data: { session },
  } = await supabaseClient.auth.getSession()

  if (!session) return res.status(401).json({ error: 'Unauthorized' })

  const { error: existingError, data: existingData } = await serviceSupabase
    .from('users')
    .select('public_key, username')
    .eq('id', session.user.id)
    .single()

  if (existingError) return res.status(500).json({ error: existingError.message })

  // User is already registered, don't allow them to update their username or public key.
  if (existingData?.public_key && existingData?.username) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  const { error, data } = await serviceSupabase
    .from('users')
    .update({ username, public_key: publicKey })
    .eq('id', session.user.id)

  if (error) return res.status(500).json({ error: error.message })

  await supabaseClient.auth.updateUser({
    data: {
      publicKey,
    },
  })

  return res.status(200).send(data)
}
