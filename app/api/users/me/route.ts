export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { api } from "../../api";
import { cookies } from "next/headers";
import { parse } from "cookie";
import { logErrorResponse } from "../../_utils/utils";
import { isAxiosError } from "axios";

const buildCookieHeader = (cookieStore: Awaited<ReturnType<typeof cookies>>) =>
  cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");

const refreshSession = async (
  cookieStore: Awaited<ReturnType<typeof cookies>>,
) => {
  const cookiesHeader = buildCookieHeader(cookieStore);
  if (!cookiesHeader) return false;

  const apiRes = await api.get("auth/session", {
    headers: {
      Cookie: cookiesHeader,
    },
  });

  const setCookie = apiRes.headers["set-cookie"];
  if (!setCookie) return false;

  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];
  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);
    const options = {
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      path: "/",
      maxAge: Number(parsed["Max-Age"]),
    };

    if (parsed.accessToken)
      cookieStore.set("accessToken", parsed.accessToken, options);
    if (parsed.refreshToken)
      cookieStore.set("refreshToken", parsed.refreshToken, options);
  }

  return true;
};

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") ?? "";

    const makeRequest = async (header: string) =>
      api.get("/users/me", {
        headers: {
          Cookie: header,
        },
      });

    try {
      const res = await makeRequest(cookieHeader);
      return NextResponse.json(res.data, { status: res.status });
    } catch (error) {
      const cookieStore = await cookies();
      if (
        isAxiosError(error) &&
        error.response?.status === 401 &&
        cookieStore.get("refreshToken")?.value
      ) {
        const refreshed = await refreshSession(cookieStore);
        if (refreshed) {
          const refreshedHeader = buildCookieHeader(cookieStore);
          const retry = await api.get("/users/me", {
            headers: {
              Cookie: refreshedHeader,
            },
          });
          return NextResponse.json(retry.data, { status: retry.status });
        }
      }
      throw error;
    }
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = await cookies();
    const body = await request.json();

    const res = await api.patch("/users/me", body, {
      headers: {
        Cookie: cookieStore
          .getAll()
          .map((cookie) => `${cookie.name}=${cookie.value}`)
          .join("; "),
      },
    });
    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.status },
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
