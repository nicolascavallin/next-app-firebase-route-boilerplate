"use client";

import Link from "next/link";

import { useAuth } from "@src/hooks/useAuth";
import { AuthProvider } from "@src/hooks/AuthContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { signOut } = useAuth();

  return (
    <section>
      <h1>Dashboard</h1>
      <Link href="/">Back</Link>
      <div style={{ gap: 8, flexDirection: "row", display: "flex" }}>
        <Link href="/dashboard">Index</Link>
        <Link href="/dashboard/account">Account</Link>
        <Link href="/dashboard/payments">Payments</Link>
        <button onClick={signOut}>Sign out</button>
      </div>
      <AuthProvider>{children}</AuthProvider>
    </section>
  );
}
