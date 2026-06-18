import Link from "next/link";
import { HERO } from "@/constants/hero";

export function Hero() {
  return (
    <section className="min-h-[70vh] px-4 py-20 md:py-24">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">
        {/* Content */}
        <div className="max-w-4xl">
          <h1 className="mb-6 font-heading text-heading text-5xl md:text-6xl lg:text-7xl leading-none tracking-tighter">
            {HERO.title}
            <span className="italic text-primary">{HERO.titleAccent}</span>
            {HERO.titleSuffix}
          </h1>

          <p className="max-w-xl mx-auto mb-10 text-base leading-relaxed text-body">
            {HERO.lead}
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href={HERO.primaryCta.href}
              className="inline-flex items-center rounded-md bg-primary px-6 py-3 text-base font-medium text-white no-underline transition-all duration-200 hover:bg-[#A64850]"
            >
              {HERO.primaryCta.label}
            </Link>

            <Link
              href={HERO.secondaryCta.href}
              className="inline-flex items-center rounded-md border border-border bg-white px-6 py-3 text-base font-medium text-heading no-underline transition-all duration-200 hover:bg-background"
            >
              {HERO.secondaryCta.label}
            </Link>
          </div>
        </div>

        {/* Laptop Preview */}
        <div className="mt-16 md:mt-20 w-full">
          <div className="relative mx-auto max-w-5xl">
            {/* Glow */}
            <div className="absolute inset-0 -z-10 bg-primary/10 blur-3xl" />

            {/* Laptop Screen */}
            <div className="rounded-xl border border-zinc-700 bg-zinc-900 p-2 shadow-[0_60px_120px_rgba(0,0,0,0.25)]">
              {/* Browser Header */}
              <div className="flex items-center gap-2 px-2 pb-2">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <div className="h-2 w-2 rounded-full bg-yellow-500" />
                <div className="h-2 w-2 rounded-full bg-green-500" />
              </div>

              {/* 16:9 Screen */}
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
