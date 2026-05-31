import Link from "next/link";
import Topbar from "@/components/topbar";

import { loadSiteData } from "@/lib/api";
import { TemplatePreview } from "@/components/microsite-templates";

export default async function TemplatesPage() {
  const data = await loadSiteData();

  return (
    <main className="page-shell">
      <Topbar
        logo={data.brand.logo}
        brandName={data.brand.name}
        ghostHref="/contact"
        ghostLabel="Request a page"
        nav={
          <>
            <Link href="/">Home</Link>
            <a href="#catalog">Catalog</a>
            <Link href="/contact">Contact</Link>
          </>
        }
      />

      <section className="section" id="catalog">
        <div className="section-heading">
          <span className="eyebrow">Template catalog</span>
          <h2>Browse every style and open a full detail page.</h2>
          <p>
            Each template is backed by the same shared data source and can be
            connected to the FastAPI backend for lead capture or future checkout
            flows.
          </p>
        </div>

        <div className="template-grid">
          {data.templates.map((template) => (
            <article key={template.slug} className="template-card">
              <div style={{ marginBottom: 16 }}>
                <TemplatePreview
                  template={template}
                  values={{
                    title: template.title,
                    subtitle: template.summary,
                    message: template.description,
                    photos: [
                      `/assets/generated/${template.slug}.png`,
                    ],
                    audio_url: "",
                    cta_label: "Open preview",
                    cta_url: `/editor?template=${template.slug}`,
                  }}
                />
              </div>
              <div className="template-top">
                <span>{template.category}</span>
                <span>{template.price}</span>
              </div>
              <h3>{template.title}</h3>
              <p>{template.summary}</p>
              <div className="template-actions">
                <Link href={`/templates/${template.slug}`}>
                  Open detail page
                </Link>
                <Link href={`/editor?template=${template.slug}`}>
                  Launch this template
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
