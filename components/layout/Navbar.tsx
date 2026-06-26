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
    <header className="sticky top-0 z-50 bg-white border-b border-border">
      <div className="mx-auto flex max-w-7xl items-center px-4 py-4 md:px-6">
        <Link href="/">
          <Image
            src="/assets/logo.png"
            alt="lovey page logo"
            width={64}
            height={64}
          />
        </Link>

        <div className="ml-auto hidden sm:flex items-center gap-2">
          {NAVIGATION.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-2 py-1 rounded-md text text-neutral-700 hover:bg-background transition-colors"
            >
              {item.label}
            </Link>
          ))}

          {token ? (
            <>
              <Link
                href="/profile"
                className="px-2 py-1 rounded-md text text-neutral-700 hover:text-primary transition-colors"
              >
                My Pages
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-md bg-transparent border-none cursor-pointer text text-neutral-700 hover:text-primary transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href={AUTH_LINKS.signIn.href}
              className="px-6 py-2 rounded-md border border-border text-sm hover:bg-background transition-colors"
            >
              {AUTH_LINKS.signIn.label}
            </Link>
          )}

          <Link
            href="/editor"
            className="px-6 py-2 rounded-md bg-primary text-white font-medium"
          >
            Create Page
          </Link>
        </div>

        <button
          type="button"
          className="ml-auto sm:hidden flex items-center justify-center px-2 py-1 rounded-md border border-border"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          Menu
        </button>
      </div>

      {mobileOpen && (
        <div className="fixed top-16 left-0 right-0 bottom-0 z-40 sm:hidden bg-background">
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

              <div className="mt-auto flex flex-col gap-6">
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
                      className="text-center text font-medium bg-transparent border border-neutral-300 px-6 py-3 cursor-pointer text-body rounded"
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
