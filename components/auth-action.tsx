"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function LogoutIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M16 17v-2h-4v-2h4V11l4 3-4 3Zm-2 4q-3.75 0-6.375-2.625T5 12q0-3.75 2.625-6.375T14 3q2.725 0 4.875 1.5T22 9h-2.2q-.875-1.85-2.45-2.925T14 5q-2.925 0-4.962 2.038T7 12q0 2.925 2.038 4.963T14 19q2.35 0 3.95-1.075T20.4 15H22q-.975 2.45-3.2 3.725T14 20Z"
      />
    </svg>
  );
}

function LoginIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="currentColor"
        d="M10 17v-2h4V9h-4V7l-5 5 5 5Zm2 4q-3.75 0-6.375-2.625T3 12q0-3.75 2.625-6.375T12 3q2.25 0 4.275 1.013T19.45 7.8h-2.25q-.8-1.275-2.1-2.038T12 5q-2.925 0-4.962 2.038T5 12q0 2.925 2.038 4.963T12 19q1.975 0 3.575-.95T17.8 16H20q-1.125 2.55-3.35 4.275T12 22Z"
      />
    </svg>
  );
}

export default function AuthAction() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("token"));

    const onStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  if (token) {
    return (
      <button
        type="button"
        className="ghost-btn"
        onClick={() => {
          localStorage.removeItem("token");
          setToken(null);
          router.refresh();
          router.push("/");
        }}
        style={{ gap: 8 }}
      >
        <LogoutIcon />
        Logout
      </button>
    );
  }

  return (
    <Link className="ghost-btn" href="/auth/login?next=/">
      <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
        <LoginIcon />
        Login
      </span>
    </Link>
  );
}
