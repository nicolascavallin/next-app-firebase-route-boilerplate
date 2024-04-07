import { cookies as next_cookies } from "next/headers";

import { auth } from "@src/utils/firebase-admin";
import { COOKIE_ID_CSRF, COOKIE_ID_TOKEN, encryptToken } from "@src/utils/session";

const authMiddleware = async (next: Function) => {
  const cookies = next_cookies();

  const idToken = cookies.get(COOKIE_ID_TOKEN)?.value;
  const csrf = cookies.get(COOKIE_ID_CSRF)?.value;

  if (!idToken || !csrf) {
    return Response.json({ hey: "nope" }, { status: 400 });
  }

  const isSameToken = csrf === encryptToken(idToken);

  if (!isSameToken) {
    return Response.json({ hey: false }, { status: 401 });
  }

  const verifiedToken = await auth().verifyIdToken(idToken, true).catch(() => null);

  if (!verifiedToken) {
    return Response.json({ hey: "expired" }, { status: 417 });
  }

  return next();
};

export default authMiddleware;