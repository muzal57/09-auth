import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPrivateRoute = (pathname: string) =>
  pathname.startsWith("/profile") || pathname.startsWith("/notes");

const isAuthRoute = (pathname: string) =>
  pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

const hasAuthCookie = (request: NextRequest) => {
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  return Boolean(accessToken || refreshToken);
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authenticated = hasAuthCookie(request);

  if (isPrivateRoute(pathname) && !authenticated) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute(pathname) && authenticated) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}
