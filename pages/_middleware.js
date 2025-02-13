import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// cookies desde para next 12 v=zBbqrcvdJjQ
const getCookies = (cookieHeader) => {
  if (!cookieHeader) return {};
  return cookieHeader.split(";").reduce((cookies, cookie) => {
    const [name, value] = cookie.trim().split("=");
    cookies[name] = value;
    return cookies;
  }, {});
};
// en servidor
export async function middleware(req) {
  const cookieHeader = req.headers.get("cookie");
  const cookies = getCookies(cookieHeader); 

  const jwt = cookies.jwt; 
  if (req.url.includes("/login")) {
    return NextResponse.next();
  }

  if (!jwt) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verificar el JWT
    await jwtVerify(jwt, new TextEncoder().encode("CLave#12548MIentrasMas45566Mejor____%%%dddd"));
    return NextResponse.next();
  } catch (error) {
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/:path*"], // Protege todas las rutas
};
