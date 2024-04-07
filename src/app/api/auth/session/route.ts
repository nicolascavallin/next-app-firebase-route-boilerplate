
import { cookies as next_cookies } from "next/headers";
import { ReadonlyRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies";

import { auth } from "@src/utils/firebase-admin";
import { COOKIE_ID_CSRF, COOKIE_ID_TOKEN, encryptToken } from "@src/utils/session";
import { jwtDecode } from "jwt-decode";

const createSessionCookies = (cookies: ReadonlyRequestCookies, idToken: string) => {
  const { exp } = jwtDecode(idToken);

  cookies.set(COOKIE_ID_TOKEN, idToken, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    priority: "high",
    path: '/',
    ...(!!exp && { expires: exp * 1000 }),
  });

  cookies.set(COOKIE_ID_CSRF, encryptToken(idToken), {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    priority: "high",
    path: '/',
    ...(!!exp && { expires: exp * 1000 }),
  });
};

const removeSessionCookie = (cookies: ReadonlyRequestCookies) => {
  cookies.delete(COOKIE_ID_TOKEN);
  cookies.delete(COOKIE_ID_CSRF);
};

export async function GET(request: Request) {
  const cookies = next_cookies();

  const url = new URL(request.url);

  const idToken = url.searchParams.get('idToken');

  const verifiedToken = await auth().verifyIdToken(idToken || "", true).catch(() => null);

  if (!idToken || !verifiedToken) {
    removeSessionCookie(cookies);
    return Response.json(null, { status: 200 });
  }

  const isSameToken = cookies.get(COOKIE_ID_TOKEN)?.value === idToken;

  if (!isSameToken) {
    /**
     * If the token is not the same as the one in the cookie, we update the cookie.
     */
    createSessionCookies(cookies, idToken);
  }

  return Response.json(null, { status: 200 });
}