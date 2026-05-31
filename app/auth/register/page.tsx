"use client";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function RegisterPage() {
  return (
    <Suspense fallback={<main style={{ padding: 24 }}>Loading...</main>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const params = useSearchParams();
  const next = params?.get("next") ?? "/";

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(
      (process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.BACKEND_URL ?? "") +
        "/api/auth/register",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      },
    );
    if (!res.ok) return alert("Register failed");
    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    const nextRoute = next.startsWith("/") ? next : "/";
    router.push(nextRoute as never);
  }

  return (
    <main style={{ padding: 24 }}>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
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
        <button type="submit">Register</button>
      </form>
    </main>
  );
}
