"use client";
import React, { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getBackendBaseUrl } from "@/lib/api";
import Link from "next/link";

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
    <main style={{ 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center", 
      minHeight: "80vh",
      padding: "24px",
      position: "relative"
    }}>
      <div className="glow glow-a" style={{ top: "10%", left: "15%" }}></div>
      <div className="glow glow-b" style={{ bottom: "10%", right: "15%" }}></div>

      <div style={{
        width: "100%",
        maxWidth: "400px",
        background: "var(--surface)",
        borderRadius: "28px",
        padding: "36px",
        boxShadow: "var(--shadow)",
        border: "1px solid var(--line)",
        position: "relative",
        zIndex: 2
      }}>
        <h2 style={{ 
          fontSize: "2.2rem", 
          color: "var(--accent)", 
          textAlign: "center", 
          marginBottom: "10px",
          fontWeight: 700
        }}>
          Welcome Back
        </h2>
        <p style={{ 
          textAlign: "center", 
          color: "var(--muted)", 
          marginBottom: "28px",
          fontSize: "0.95rem"
        }}>
          Log in to manage your Loveypages
        </p>

        <form onSubmit={handleLogin} style={{ display: "grid", gap: "20px" }}>
          <div className="field">
            <span>Email Address</span>
            <input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="name@example.com"
              required
            />
          </div>
          <div className="field">
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button type="submit" className="primary-btn" style={{ width: "100%", padding: "14px 20px", marginTop: "10px" }}>
            Log In
          </button>
        </form>

        <p style={{ 
          marginTop: "24px", 
          textAlign: "center", 
          fontSize: "0.9rem", 
          color: "var(--muted)" 
        }}>
          Don't have an account?{" "}
          <Link href={`/auth/register?next=${encodeURIComponent(next)}`} style={{ color: "var(--accent)", fontWeight: 600 }}>
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
