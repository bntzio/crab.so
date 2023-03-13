import { createMiddlewareSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const heliusApiKey = process.env.HELIUS_API_KEY

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/api/rpc') {
    const url = new URL('https://rpc.helius.xyz', req.url)

    if (heliusApiKey) url.searchParams.set('api-key', heliusApiKey)

    const res = NextResponse.rewrite(url)

    return res
  }

  if (pathname === '/home') {
    const res = NextResponse.next()

    const supabase = createMiddlewareSupabaseClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (session) return res

    const redirectUrl = req.nextUrl.clone()

    redirectUrl.pathname = '/'
    redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname)

    return NextResponse.redirect(redirectUrl)
  }

  if (pathname === '/') {
    const res = NextResponse.next()

    const supabase = createMiddlewareSupabaseClient({ req, res })

    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) return res

    const redirectUrl = req.nextUrl.clone()

    redirectUrl.pathname = '/home'

    return NextResponse.redirect(redirectUrl)
  }
}

export const config = {
  matcher: ['/api/rpc', '/home', '/'],
}
