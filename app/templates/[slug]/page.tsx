import Link from "next/link";
import Topbar from "@/components/topbar";
import { notFound } from "next/navigation";

import { loadTemplate } from "@/lib/api";
import { getTemplateBySlug } from "@/lib/site-data";
import { siteData } from "@/lib/site-data";
import { TemplatePreview } from "@/components/microsite-templates";

export function generateStaticParams() {
  return siteData.templates.map((template) => ({ slug: template.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = getTemplateBySlug(slug);

  if (!template) {
    return {
      title: "Template not found",
    };
  }

  return {
    title: `${template.title} | ${siteData.brand.name}`,
    description: template.description,
  };
}

export default async function TemplateDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const query = (await searchParams) ?? {};
  const template = await loadTemplate(slug);

  if (!template) {
    notFound();
  }

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
      if (parsed && typeof parsed === "object") {
        previewValues = { ...previewValues, ...parsed };
      }
    } catch (error) {
      // fall back to the default preview values
    }
  }

  return (
    <main className="page-shell">
      <Topbar
        logo={siteData.brand.logo}
        brandName={siteData.brand.name}
        ghostHref={`/contact?template=${template.slug}`}
        ghostLabel="Launch this page"
        nav={
          <>
            <Link href="/">Home</Link>
            <Link href="/templates">Templates</Link>
            <Link href="/contact">Contact</Link>
          </>
        }
      />

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">{template.category}</span>
          <h2>{template.title}</h2>
          <p>{template.description}</p>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <span className="eyebrow">Preview</span>
          <h2>
            See how this template renders as a mobile-first greeting card.
          </h2>
          {query.preview && <p>Showing the live editor state in this tab.</p>}
        </div>
        <TemplatePreview template={template} values={previewValues} />
      </section>

      <section className="split-section">
        <article className="template-card">
          <div className="template-top">
            <span>Best for</span>
            <span>{template.price}</span>
          </div>
          <h3>{template.bestFor}</h3>
          <p>{template.summary}</p>
          <div
            className="feature-list"
            style={{ justifyContent: "flex-start" }}
          >
            {template.features.map((feature) => (
              <span key={feature}>{feature}</span>
            ))}
          </div>
        </article>

        <article className="template-card">
          <div className="template-top">
            <span>Included sections</span>
            <span>{template.accent}</span>
          </div>
          <h3>What this template covers</h3>
          <div className="hero-mini-grid">
            {template.sections.map((section) => (
              <div key={section}>
                <span>Section</span>
                <strong>{section}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="cta-panel">
        <div>
          <span className="eyebrow">Next step</span>
          <h2>Open the live preview in a new tab.</h2>
          <p>
            Use a separate tab to inspect the full template without the editor
            controls around it.
          </p>
        </div>
        <a
          className="primary-btn"
          href={`/templates/${template.slug}`}
          target="_blank"
          rel="noreferrer"
        >
          Open live preview in new tab
        </a>
      </section>
    </main>
  );
}
