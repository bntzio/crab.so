import { NextRequest, NextResponse } from 'next/server'

const heliusApiKey = process.env.HELIUS_API_KEY

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname === '/api/rpc') {
    const url = new URL('https://rpc.helius.xyz', request.url)

    if (heliusApiKey) url.searchParams.set('api-key', heliusApiKey)

    const response = NextResponse.rewrite(url)

    return response
  }
}

export const config = {
  matcher: ['/api/rpc'],
}
