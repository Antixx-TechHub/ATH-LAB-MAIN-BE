// ./middleware.js
import { verifyToken } from './lib/auth';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const token = req.cookies.get('authToken')?.value;
//  console.log('Middleware: Token found:', token); 
  if (!token) {
  //  console.log('Middleware: No token, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const payload = await verifyToken(token);
   // console.log('Middleware: Token payload:', payload);
    if (!payload) {
     // console.log('Middleware: Invalid token, redirecting to /login');
      return NextResponse.redirect(new URL('/login', req.url));
    }
    return NextResponse.next();
  } catch (error) {
    console.error('Middleware: Token verification error:', error.message);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};