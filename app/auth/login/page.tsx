"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getBackendBaseUrl } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { AUTH_LINKS } from "@/constants/navigation";

export default function LoginPage() {
  return (
    <Suspense fallback={<main className="p-6">Loading...</main>}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const next = params?.get("next") ?? "/";
  const { addToast } = useToast();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${getBackendBaseUrl()}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setLoading(false);
      return addToast("Login failed. Check your email and password.", "error");
    }
    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    addToast("Logged in successfully!", "success");
    const nextRoute = (next ?? "/").startsWith("/") ? next : "/";
    window.location.href = nextRoute;
  }

  const inputBase = "w-full border border-border rounded-md bg-white text-body text-base px-4 h-11 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200";

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-4 md:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-[400px] rounded-md border border-border bg-white p-8">
        <h2 className="text-3xl font-heading font-medium text-heading text-center mb-2">Welcome Back</h2>
        <p className="text-center text-muted text-sm mb-8">Log in to manage your pages</p>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium tracking-wider uppercase text-muted">Email Address</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              required
              className={inputBase}
            />
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-xs font-medium tracking-wider uppercase text-muted">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={inputBase}
            />
          </label>
          <Button type="submit" loading={loading} className="w-full mt-2">
            Log In
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Don&apos;t have an account?{" "}
          <Link href={`/auth/register?next=${encodeURIComponent(next)}`} className="text-primary font-medium">
            {AUTH_LINKS.signUp.label}
          </Link>
        </p>
      </div>
    </main>
  );
}
