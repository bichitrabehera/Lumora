import Link from "next/link";
import { notFound } from "next/navigation";
import { loadTemplate } from "@/lib/api";
import { getTemplateBySlug, siteData } from "@/lib/site-data";
import { TemplatePreview } from "@/components/microsite-templates";

export function generateStaticParams() {
  return siteData.templates.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);
  if (!template) return { title: "Template not found" };
  return { title: `${template.title} | lovey page`, description: template.description };
}

export default async function TemplateDetailPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams?: Promise<{ preview?: string }> }) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const template = await loadTemplate(slug);
  if (!template) notFound();

  let previewValues: Record<string, any> = {
    title: template.title,
    subtitle: template.summary,
    message: template.description,
    photos: [`/assets/generated/${template.slug}.png`],
    audio_url: "",
  };

  if (query.preview) {
    try {
      const parsed = JSON.parse(decodeURIComponent(query.preview));
      if (parsed && typeof parsed === "object") previewValues = { ...previewValues, ...parsed };
    } catch {}
  }

  return (
    <main>
      <section className="px-4 md:px-6 lg:px-8 pt-20 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="mb-12">
            <p className="text-sm font-medium tracking-wider uppercase text-muted mb-3">{template.category}</p>
            <h1 className="text-4xl md:text-5xl leading-tight font-heading font-medium text-heading tracking-tight mb-4">{template.title}</h1>
            <p className="text-base text-muted max-w-[500px] leading-relaxed">{template.description}</p>
          </div>

          <div className="p-6 rounded-md border border-border bg-white mb-12">
            <div className="flex justify-between items-center mb-4">
              <p className="text-sm font-medium tracking-wider uppercase text-muted">Preview</p>
              {query.preview && <span className="text-sm text-primary">Live editor state</span>}
            </div>
            <TemplatePreview template={template} values={previewValues} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
            <div className="p-6 rounded-md border border-border bg-white">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium tracking-wider uppercase text-muted">Best for</span>
                <span className="text-sm text-primary">{template.price}</span>
              </div>
              <h3 className="text-lg font-heading font-medium text-heading mb-2">{template.bestFor}</h3>
              <p className="text-sm text-muted leading-relaxed mb-4">{template.summary}</p>
              <div className="flex flex-wrap gap-2">
                {template.features.map((feature) => (
                  <span key={feature} className="text-xs font-medium px-3 py-1.5 rounded-md border border-border bg-background text-body">{feature}</span>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-md border border-border bg-white">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium tracking-wider uppercase text-muted">Included sections</span>
                <span className="text-sm text-primary">{template.accent}</span>
              </div>
              <h3 className="text-lg font-heading font-medium text-heading mb-4">What this template covers</h3>
              <div className="grid grid-cols-2 gap-2.5">
                {template.sections.map((section) => (
                  <div key={section} className="px-4 py-3 rounded-md border border-border bg-background">
                    <p className="text-xs text-muted tracking-wider uppercase mb-1">Section</p>
                    <strong className="text-sm font-medium text-heading">{section}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-6 rounded-md border border-border bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
            <div>
              <p className="text-sm font-medium tracking-wider uppercase text-muted mb-2">Next step</p>
              <h2 className="text-xl font-heading font-medium text-heading mb-1">See it in action.</h2>
              <p className="text-sm text-muted">Open the full preview in a new tab to see every detail.</p>
            </div>
            <a href={(template as any).assets?.bundle ?? `/assets/${template.slug}/index.html`} target="_blank" rel="noreferrer" className="inline-flex items-center px-6 py-3 rounded-md bg-primary text-white text-sm font-medium no-underline whitespace-nowrap shrink-0 hover:bg-[#A64850] transition-all duration-200">
              Open live preview
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
