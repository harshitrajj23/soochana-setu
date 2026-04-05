import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from './lib/supabase';
// Note: Verification in middleware.ts requires jose for Edge compatibility
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'soochana_setu_secret_2026';
const secret = new TextEncoder().encode(JWT_SECRET);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define protected routes
  const protectedPaths = [
    '/api/dashboard',
    '/api/unify-data',
    '/api/detect-fraud',
    '/api/find-exclusion',
    '/api/simulate-policy',
    '/api/upload-data',
    '/api/upload-file',
    '/api/verify-profile',
  ];

  // 2. Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', 'http://localhost:3000');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 3. Handle OPTIONS preflight requests
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  // 4. Check if the path is protected
  const isProtected = protectedPaths.some(path => pathname.startsWith(path));

  if (isProtected) {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ success: false, message: 'Authentication required' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];

    try {
      // Verify JWT token
      const { payload } = await jwtVerify(token, secret);
      
      // Verification success
      // You can also add user info to request headers if needed
      // const res = NextResponse.next();
      // res.headers.set('x-user-id', payload.userId as string);
      return response;
      
    } catch (err) {
      console.error('JWT verification failed:', err);
      return NextResponse.json({ success: false, message: 'Invalid or expired token' }, { status: 401 });
    }
  }

  return response;
}

export const config = {
  matcher: '/api/:path*',
};
