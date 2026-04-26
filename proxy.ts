import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkSession } from "./lib/api/serverApi";

const isPrivateRoute = (pathname: string) =>
  pathname.startsWith("/profile") || pathname.startsWith("/notes");

const isAuthRoute = (pathname: string) =>
  pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

const getAccessToken = (request: NextRequest) =>
  request.cookies.get("accessToken")?.value;

const getRefreshToken = (request: NextRequest) =>
  request.cookies.get("refreshToken")?.value;

const parseSetCookie = (cookieStr: string) => {
  const [cookiePair, ...attributes] = cookieStr
    .split(";")
    .map((part) => part.trim());
  const [name, ...valueParts] = cookiePair.split("=");
  const value = valueParts.join("=");
  const attrs = Object.fromEntries(
    attributes.map((attribute) => {
      const [key, ...rest] = attribute.split("=");
      return [key.toLowerCase(), rest.join("=")];
    }),
  );

  return { name, value, attrs } as {
    name: string;
    value: string;
    attrs: Record<string, string>;
  };
};

const applySetCookieHeaders = (
  response: NextResponse,
  setCookie: string | string[],
) => {
  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const cookieStr of cookieArray) {
    const { name, value, attrs } = parseSetCookie(cookieStr);
    response.cookies.set(name, value, {
      path: attrs.path ?? "/",
      maxAge: attrs["max-age"] ? Number(attrs["max-age"]) : undefined,
      expires: attrs.expires ? new Date(attrs.expires) : undefined,
      httpOnly: attrs.httponly !== undefined,
      secure: attrs.secure !== undefined,
      sameSite: attrs.samesite as "lax" | "strict" | "none" | undefined,
    });
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = getAccessToken(request);
  const refreshToken = getRefreshToken(request);

  if (isPrivateRoute(pathname)) {
    if (accessToken) {
      return NextResponse.next();
    }

    if (refreshToken) {
      try {
        const sessionResponse = await checkSession(
          request.headers.get("cookie") ?? "",
        );
        if (sessionResponse.data?.success) {
          const response = NextResponse.next();
          const setCookie = sessionResponse.headers["set-cookie"];
          if (setCookie) {
            applySetCookieHeaders(response, setCookie);
          }
          return response;
        }
      } catch {
        // fall through to redirect
      }
    }

    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuthRoute(pathname)) {
    if (accessToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    if (refreshToken) {
      try {
        const sessionResponse = await checkSession(
          request.headers.get("cookie") ?? "",
        );
        if (sessionResponse.data?.success) {
          const response = NextResponse.redirect(new URL("/", request.url));
          const setCookie = sessionResponse.headers["set-cookie"];
          if (setCookie) {
            applySetCookieHeaders(response, setCookie);
          }
          return response;
        }
      } catch {
        // allow unauthenticated auth route access
      }
    }
  }

  return NextResponse.next();
}
