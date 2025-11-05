import { NextResponse, type NextRequest } from "next/server";
import { PROTECTED_ROUTES } from "./config/middleware";
import { verificarAuthToken } from "./utils/verificarAuthToken";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Rotas ignoradas
  if (pathname.startsWith("/login")) return NextResponse.next();

  // Verifica se é uma rota protegida
  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );
  if (!isProtected) return NextResponse.next();

  const token = req.cookies.get("token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Verifica e decodifica o token
  const user = await verificarAuthToken(token);
  if (!user) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Analisar necessidade quando for implementar Barear de request padrão para o frontend
  const res = NextResponse.next();
  res.headers.set("x-user-id", String(user.id));
  res.headers.set("x-user-role", user.role as unknown as string);
  return res;
}

// Rotas gatilho para o middleware 
export const config = {
  matcher: ["/dashboard/:path*"],
};
