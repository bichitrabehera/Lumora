"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { NAVIGATION, AUTH_LINKS } from "@/constants/navigation";
import Image from "next/image";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setToken(localStorage.getItem("token"));
    const onStorage = () => setToken(localStorage.getItem("token"));
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    router.refresh();
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-50 h-16 flex items-center bg-background border-b border-border">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image
            src="/assets/logo.png"
            alt="lovey page logo"
            width={64}
            height={64}
          />
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden sm:flex items-center gap-1"
          aria-label="Main navigation"
        >
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-4 py-2 rounded-md text-sm text-body hover:bg-background transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {token ? (
            <div className="hidden sm:flex items-center gap-3">
              <Link
                href="/profile"
                className="text-sm text-body hover:text-primary"
              >
                My Pages
              </Link>

              <button
                onClick={handleLogout}
                className="text-sm border-none bg-transparent cursor-pointer text-muted hover:text-primary"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href={AUTH_LINKS.signIn.href}
              className="hidden sm:inline text-sm text-body hover:text-primary px-6 py-2 rounded-md border border-border hover:bg-background transition-colors"
            >
              {AUTH_LINKS.signIn.label}
            </Link>
          )}

          <Link
            href="/editor"
            className="hidden md:inline px-6 py-2 rounded-md bg-primary text-white text font-medium"
          >
            Create Page
          </Link>

          <button
            type="button"
            className="sm:hidden flex items-center justify-center w-10 h-10 rounded-md border border-border"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileOpen ? (
                <path d="M5 15L15 5M5 5l10 10" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          className="fixed top-16 left-0 right-0 bottom-0 z-40 sm:hidden"
          style={{ backgroundColor: "#ffeff0" }}
        >
          <div className="flex h-full flex-col px-6 py-8">
            <nav className="flex flex-col gap-6">
              {NAVIGATION.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="text font-medium text-body"
                >
                  {item.label}
                </Link>
              ))}

              <div className="mt-auto flex flex-col gap-6 pt-8">
                {token ? (
                  <>
                    <Link
                      href="/profile"
                      onClick={() => setMobileOpen(false)}
                      className="text font-medium text-body"
                    >
                      My Pages
                    </Link>

                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileOpen(false);
                      }}
                      className="text-left text font-medium bg-transparent border-none p-0 cursor-pointer text-body"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <Link
                    href={AUTH_LINKS.signIn.href}
                    onClick={() => setMobileOpen(false)}
                    className="text font-medium text-body px-6 py-3 rounded-md bg-background text-center border border-border"
                  >
                    {AUTH_LINKS.signIn.label}
                  </Link>
                )}

                <Link
                  href="/editor"
                  onClick={() => setMobileOpen(false)}
                  className="px-6 py-3 rounded-md bg-primary text-white text-center font-medium"
                >
                  Create Page
                </Link>
              </div>
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
