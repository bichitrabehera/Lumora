import React from "react";
import Link from "next/link";
import { FOOTER } from "@/constants/footer";

export default function Footer() {
  return (
    <footer className="border-t border-border px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-7xl mx-auto flex flex-col gap-12 md:flex-row md:justify-between md:gap-20">
        <div className="max-w">
          <h3 className="mb-4 text-lg font-heading text-heading font-medium tracking-tight">
            lovey page
          </h3>
          <p className="text max-w-lg text-muted leading-relaxed">
            {FOOTER.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-10 md:gap-16">
          {FOOTER.columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text font-medium uppercase tracking-wider text-muted">
                {col.title}
              </h4>
              <nav className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="text text-body transition-colors duration-200 hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 flex flex-col gap-3 border-t border-border pt-6 text text-muted sm:flex-row sm:items-center sm:justify-between">
        <span>&copy; {new Date().getFullYear()} lovey page</span>
        <span>Made with care</span>
      </div>
    </footer>
  );
}
