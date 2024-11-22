import { NextResponse } from 'next/server';

export function middleware(req) {
  const token = req.cookies['jwt']; // Recupera el token desde las cookies
  const url = req.nextUrl.clone();

  if (!token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  try {
    // Decodificar y validar token básico
    const decoded = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString('utf8')
    );

    const currentTime = Math.floor(Date.now() / 1000);
    if (decoded.exp < currentTime) {
      throw new Error('Token expirado');
    }
  } catch (err) {
    console.error('Token inválido:', err);
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}
