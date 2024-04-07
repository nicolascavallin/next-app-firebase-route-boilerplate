"use client";

import Link from "next/link";

import { useAuth } from "@src/hooks/useAuth";

export default function Page() {
  const { signInWithEmailAndPassword, onGoogleSignIn, requestSignInLink } =
    useAuth();

  const firstMethod = async () => {
    const email = document.getElementById("email") as HTMLInputElement;
    const password = document.getElementById("password") as HTMLInputElement;

    try {
      await signInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      console.error(error);
    }
  };

  const secondMethod = async () => {
    const email = document.getElementById("link") as HTMLInputElement;

    window?.localStorage.setItem("emailForSignIn", email.value);

    try {
      await requestSignInLink(email.value);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Sign In</h1>
      <Link href="/">Back</Link>
      <hr />
      <div>
        <input id="email" placeholder="email" type="email" />
        <input id="password" placeholder="password" type="password" />
        <button onClick={firstMethod}>SignIn</button>
      </div>
      <hr />
      <div>
        <input id="link" placeholder="email" type="email" />
        <button onClick={secondMethod}>Link Sign In</button>
      </div>
      <hr />
      <button
        onClick={async () => {
          try {
            onGoogleSignIn();
          } catch (error) {
            console.error(error);
          }
        }}
      >
        Google Sign In
      </button>
    </div>
  );
}
