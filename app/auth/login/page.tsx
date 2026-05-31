"use client";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBackendBaseUrl } from "@/lib/api";

export default function LoginPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>Loading...</main>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get("next") ?? "/";

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`${getBackendBaseUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) return alert("Login failed");
    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    const nextRoute = next.startsWith("/") ? next : "/";
    router.push(nextRoute as never);
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
