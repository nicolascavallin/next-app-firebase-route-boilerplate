"use client";

import { useAuth } from "@src/hooks/useAuth";

export default function Page() {
  const { signOut } = useAuth();
  return (
    <div>
      <h2>Index</h2>
      <button onClick={signOut}>Sign out</button>
    </div>
  );
}
