import Link from "next/link";
import { HERO } from "@/constants/hero";

export function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden px-4 py-20 md:py-24">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Left */}
        <div className="absolute -left-80 top-20 h-[900px] w-[900px] rounded-full bg-pink-300/30 blur-[180px]" />

        {/* Right */}
        <div className="absolute -right-80 top-20 h-[900px] w-[900px] rounded-full bg-pink-300/30 blur-[180px]" />

        {/* Bottom */}
        <div className="absolute left-1/2 bottom-[-500px] h-[900px] w-[900px] -translate-x-1/2 rounded-full bg-pink-300/20 blur-[220px]" />

        {/* Center glow */}
        <div className="absolute left-1/2 top-40 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-rose-200/20 blur-[150px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center text-center">
        <div className="">
          <h1 className="mb-6 text-heading text-5xl leading-none tracking-tighter md:text-6xl lg:text-7xl">
            {HERO.title}
            <span className="text-primary">{HERO.titleAccent}</span>
            {HERO.titleSuffix}
          </h1>

          <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-body">
            {HERO.lead}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={HERO.primaryCta.href}
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white transition hover:bg-[#A64850]"
            >
              {HERO.primaryCta.label}
            </Link>

            <Link
              href={HERO.secondaryCta.href}
              className="inline-flex items-center rounded-md border border-border bg-white px-6 py-3 text-base font-medium text-heading transition hover:bg-background"
            >
              {HERO.secondaryCta.label}
            </Link>
          </div>
        </div>

        {/* Laptop */}
        <div className="mt-16 w-full md:mt-20">
          <div className="relative mx-auto max-w-5xl">
            <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-3xl" />

            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-[0_60px_120px_rgba(0,0,0,0.25)]">
              <div className="flex items-center gap-2 px-2 pb-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>

              <div className="aspect-video overflow-hidden rounded border border-zinc-800 bg-white">
                <img
                  src="/assets/generated/afterglow-anniversary.png"
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// import React from "react";

// export function Hero() {
//   return <div className="h-screen">hero</div>;
// }
