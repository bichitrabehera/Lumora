"use client";
import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { getBackendBaseUrl } from "@/lib/api";
import { useToast } from "@/components/ui/Toast";
import { Button } from "@/components/ui/Button";
import { AUTH_LINKS } from "@/constants/navigation";

export default function RegisterPage() {
  return (
    <Suspense fallback={<main className="p-6">Loading...</main>}>
      <RegisterForm />
    </Suspense>
  );
}

function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const params = useSearchParams();
  const next = params?.get("next") ?? "/";
  const { addToast } = useToast();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const res = await fetch(`${getBackendBaseUrl()}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      setLoading(false);
      return addToast("Register failed. Please try again.", "error");
    }
    const data = await res.json();
    localStorage.setItem("token", data.access_token);
    addToast("Account created successfully!", "success");
    const nextRoute = (next ?? "/").startsWith("/") ? next : "/";
    window.location.href = nextRoute;
  }

  const inputBase = "w-full border border-border rounded-md bg-white text-body text-base px-4 h-11 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all duration-200";

  return (
    <main className="flex items-center justify-center min-h-[80vh] px-4 md:px-6 lg:px-8 pt-20">
      <div className="w-full max-w-[400px] rounded-md border border-border bg-white p-8">
        <h2 className="text-3xl font-heading font-medium text-heading text-center mb-2">Create Account</h2>
        <p className="text-center text-muted text-sm mb-8">Start building personal interactive pages</p>

        <form onSubmit={handleRegister} className="flex flex-col gap-5">
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
              placeholder="Min. 8 characters"
              required
              className={inputBase}
            />
          </label>
          <Button type="submit" loading={loading} className="w-full mt-2">
            {AUTH_LINKS.signUp.label}
          </Button>
        </form>

        <p className="mt-8 text-center text-sm text-muted">
          Already have an account?{" "}
          <Link href={`/auth/login?next=${encodeURIComponent(next)}`} className="text-primary font-medium">
            {AUTH_LINKS.signIn.label}
          </Link>
        </p>
      </div>
    </main>
  );
}
