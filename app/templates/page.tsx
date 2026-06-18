import Link from "next/link";
import { loadSiteData } from "@/lib/api";

export default async function TemplatesPage() {
  const data = await loadSiteData();

  return (
    <main>
      <section className="px-4 md:px-6 lg:px-8 pt-20 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto w-full px-0 md:px-8">
          <div className="mb-12">
            <p className="text-sm font-medium tracking-wider uppercase text-muted mb-3">
              The Collection
            </p>
            <h1 className="text-4xl md:text-5xl leading-tight font-heading font-medium text-heading tracking-tight mb-4">
              Every template is a starting point.
            </h1>
            <p className="text-base text-muted max-w-[500px] leading-relaxed">
              Each one can be filled with your photos, your words, your music.
              The structure is ready &mdash; the story is yours.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {data.templates.map((template) => (
              <article
                key={template.slug}
                className="flex flex-col rounded-md overflow-hidden border border-border bg-white transition-all duration-200"
              >
                <div className="flex flex-col flex-1 p-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium tracking-wider uppercase text-primary">
                      {template.category}
                    </span>
                    <span className="text-xs text-muted">{template.price}</span>
                  </div>
                  <h2 className="text-lg font-heading font-medium text-heading mb-1">
                    {template.title}
                  </h2>
                  <p className="text-sm text-muted leading-relaxed flex-1">
                    {template.summary}
                  </p>
                  <div className="flex gap-2 mt-auto pt-4">
                    <Link
                      href={`/editor?template=${template.slug}`}
                      className="flex-1 inline-flex items-center justify-center px-4 py-2 rounded-md bg-primary text-white text-sm font-medium no-underline hover:bg-[#A64850] transition-all duration-200"
                    >
                      Create
                    </Link>
                    <Link
                      href={`/templates/${template.slug}`}
                      className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-white border border-border text-heading text-sm font-medium no-underline hover:bg-background transition-all duration-200"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
