import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import authApi from "@/services/backend-api/authApi";

export const config = {
  matcher: ["/profile", "/profile/:path*"],
};

export async function middleware(req: NextRequest) {
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
    console.error("Middleware error (token invalid?):", error);
  }

  return NextResponse.redirect(new URL("/auth/login", req.url));
}
