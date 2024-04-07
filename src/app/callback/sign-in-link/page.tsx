"use client";

import { useEffect } from "react";

import { useAuth } from "@src/hooks/useAuth";

export default function Page() {
  const { verifySignInLink } = useAuth();

  useEffect(() => {
    const email = window.localStorage.getItem("emailForSignIn");
    verifySignInLink(email!).then(() => {
      window.localStorage.removeItem("emailForSignIn");
    });
  }, [verifySignInLink]);

  return null;
}
