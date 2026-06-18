import Link from "next/link";
import { CATEGORIES } from "@/constants/categories";

export function Examples() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          <p className="text-sm font-medium tracking-wider uppercase text-muted mb-3">
            Examples
          </p>
          <h2 className="text-4xl md:text-5xl leading-tight font-heading font-medium text-heading tracking-tight">
            Every relationship has a story worth telling.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((story) => (
            <Link
              key={story.id}
              href="/editor"
              className="flex flex-col rounded-md overflow-hidden border border-border bg-white transition-all duration-200 no-underline"
            >
              <div className="flex flex-col flex-1 p-6">
                <h3 className="text-base font-heading font-medium text-heading mb-2">
                  {story.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  {story.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
