
import { Dispatch, SetStateAction } from "react";

import { useRouter } from "next/navigation";

import { auth, googleProvider } from "@src/utils/firebase-app";
import {
  signOut as _signOut,
  signInWithEmailAndPassword as _signInWithEmailAndPassword,
  UserCredential,
  User,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  signInWithPopup,
} from "firebase/auth";

const useAuth = () => {
  const { refresh, push } = useRouter();

  const callback = async (user: UserCredential | void) => {
    const idToken = await user?.user?.getIdToken();

    await fetch(`/api/auth/session?idToken=${idToken}`);

    refresh();
  };

  const emailCallback = async (user: UserCredential | void) => {
    const idToken = await user?.user?.getIdToken();

    await fetch(`/api/auth/session?idToken=${idToken}`);

    push("/dashboard");
  };

  const signOut = () => _signOut(auth).then(callback);

  const signInWithEmailAndPassword = (email: string, password: string) => _signInWithEmailAndPassword(auth, email, password).then(callback);

  const onGoogleSignIn = () => signInWithPopup(auth, googleProvider).then(emailCallback);

  const requestSignInLink = (email: string) => sendSignInLinkToEmail(auth, email, {
    url: "https://test.mylocalhost.dev/callback/sign-in-link",
    handleCodeInApp: true,
  });

  const verifySignInLink = async (email: string) => {
    signInWithEmailLink(auth, email, window.location.href).then((x) => {
      console.log(x);
      emailCallback(x);
    });
  };

  return {
    signOut,
    signInWithEmailAndPassword,
    onIdTokenChanged,
    onGoogleSignIn,
    verifySignInLink,
    requestSignInLink,
  };
};

const onIdTokenChanged = (setUser: Dispatch<SetStateAction<User | null>>) => auth.onIdTokenChanged(async (user) => {
  const idToken = await user?.getIdToken();
  await fetch(`/api/auth/session?idToken=${idToken}`);
  setUser(user);
});

export {
  useAuth,
  onIdTokenChanged,
};