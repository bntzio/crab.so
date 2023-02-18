import { NextRequest, NextResponse } from 'next/server'

const heliusApiKey = process.env.HELIUS_API_KEY

export async function middleware(request: NextRequest): Promise<Response | undefined> {
  const { pathname } = request.nextUrl

  if (pathname === '/api/rpc') {
    const url = new URL('https://rpc.helius.xyz')

    if (heliusApiKey) url.searchParams.set('api-key', heliusApiKey)

    const res = NextResponse.rewrite(url, request)

    return res
  }
}

export const config = {
  matcher: ['/api/rpc'],
}
