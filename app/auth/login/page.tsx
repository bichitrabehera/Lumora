"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get("next") ?? "/";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(
      (process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.BACKEND_URL ?? "") +
        "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );
    if (!res.ok) return alert("Login failed");
    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    router.push(next);
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </main>
  );
}
