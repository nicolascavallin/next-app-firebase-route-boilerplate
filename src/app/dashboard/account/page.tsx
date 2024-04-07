"use client";

import { useAuthContext } from "@src/hooks/AuthContext";

export default function Page() {
  const { user } = useAuthContext();
  return (
    <div>
      <h2>Account</h2>
      <p>User: {user?.email}</p>
    </div>
  );
}
