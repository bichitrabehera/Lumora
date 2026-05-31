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
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await loadTemplate(slug);

  if (!template) {
    notFound();
  }

  const isFreeTemplate = String(template.price ?? "")
    .toLowerCase()
    .includes("free");

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
        </div>
        <TemplatePreview
          template={template}
          values={{
            title: template.title,
            subtitle: template.summary,
            message: template.description,
            photos: [
              "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=900&q=80",
              "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80",
            ],
            audio_url: "",
            cta_label: isFreeTemplate ? "Claim for free" : "Make it yours",
            cta_url: `/editor?template=${template.slug}`,
          }}
        />
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
          <h2>Send the request to the FastAPI backend.</h2>
          <p>
            The lead form stores the template choice, occasion, and message so
            you can connect it to email or a CRM later.
          </p>
        </div>
        <Link
          className="primary-btn"
          href={`/editor?template=${template.slug}`}
        >
          {isFreeTemplate ? "Claim for free" : "Make it yours"}
        </Link>
      </section>
    </main>
  );
}
