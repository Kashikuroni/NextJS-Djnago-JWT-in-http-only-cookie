import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authApi from "@/services/backend-api/authApi";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];
const STATIC_ROUTES = ["/_next", "/favicon.ico"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    STATIC_ROUTES.some((route) => pathname.startsWith(route)) ||
    PUBLIC_ROUTES.includes(pathname)
  ) {
    return NextResponse.next();
  }

  const accessToken = req.cookies.get("access_token")?.value;
  const refreshToken = req.cookies.get("refresh_token")?.value;

  try {
    if (accessToken) {
      authApi.api.defaults.headers.Cookie = `access_token=${accessToken};`;
      await authApi.getUser();
      return NextResponse.next();
    }

    if (refreshToken) {
      authApi.api.defaults.headers.Cookie = `refresh_token=${refreshToken};`;
      await authApi.refreshToken();
      return NextResponse.next();
    }
  } catch (error) {
    console.error("Middleware error:", error);
  }

  return NextResponse.redirect(new URL("/auth/login", req.url));
}
