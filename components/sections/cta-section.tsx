import Link from "next/link";
import { HERO } from "@/constants/hero";

export function CTASection() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-20 md:py-24 text-center">
      <div className="max-w-7xl mx-auto w-full">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl md:text-5xl leading-tight font-heading font-medium text-heading tracking-tight mb-4">
            Ready to create something beautiful?
          </h2>
          <p className="text-base text-muted leading-relaxed mb-10">
            A few clicks is all it takes. No account needed to start.
          </p>
          <Link href={HERO.primaryCta.href} className="inline-flex items-center px-8 py-4 rounded-md bg-primary text-white text-base font-medium no-underline hover:bg-[#A64850] transition-all duration-200">
            {HERO.primaryCta.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
