import type { NextApiRequest, NextApiResponse } from 'next'

import { supabase } from '@/lib'

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { data, error } = await supabase.from('communities').select('*')

  if (error) return res.status(500).json({ error: error.message })

  res.status(200).json(data)
}
