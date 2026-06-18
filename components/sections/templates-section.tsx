import Link from "next/link";
import type { Template } from "@/lib/site-data";

type Props = {
  templates: Template[];
};

export function Templates({ templates }: Props) {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
          
          <h2 className="text-4xl md:text-5xl leading-tight font-heading font-medium text-heading tracking-tight mb-4">
            Curated pages, ready for your story.
          </h2>
          <Link
            href="/templates"
            className="text-sm font-medium text-primary no-underline border-b border-primary pb-0.5 hover:opacity-80 transition-opacity duration-200"
          >
            View All Templates
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {templates.slice(0, 4).map((t) => (
            <Link
              key={t.slug}
              href={`/editor?template=${t.slug}`}
              className="flex flex-col rounded-md overflow-hidden border border-border bg-white transition-all duration-200 no-underline"
            >
              <div className="flex flex-col flex-1 p-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-medium tracking-wider uppercase text-primary">
                    {t.category}
                  </span>
                  <span className="text-xs text-muted">{t.price}</span>
                </div>
                <h3 className="text-lg font-heading font-medium text-heading mb-1">
                  {t.title}
                </h3>
                <p className="text-sm text-muted leading-relaxed flex-1">
                  {t.summary}
                </p>
                <span className="mt-auto inline-block text-sm font-medium text-primary pt-4">
                  Create with this
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
