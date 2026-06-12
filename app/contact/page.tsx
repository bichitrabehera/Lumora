import Link from "next/link";
import Topbar from "@/components/topbar";

import { loadSiteData } from "@/lib/api";

import LeadForm from "./lead-form";

export default async function ContactPage({
  searchParams,
}: {
  searchParams?: { template?: string | string[] };
}) {
  const data = await loadSiteData();
  const templateSlug = Array.isArray(searchParams?.template)
    ? searchParams.template[0]
    : (searchParams?.template ?? "");

  return (
    <main className="page-shell">
      <Topbar
        logo={data.brand.logo}
        brandName={data.brand.name}
        nav={
          <>
            <Link href="/">Home</Link>
            <Link href="/templates">Templates</Link>
            <a href="#request">Contact</a>
          </>
        }
      />

      <section className="section" id="request">
        <div className="section-heading">
          <span className="eyebrow">{data.contact.title}</span>
          <h2>Tell us what you want to launch.</h2>
          <p>{data.contact.lead}</p>
        </div>
      </section>

      <section className="split-section">
        <article className="template-card">
          <div className="template-top">
            <span>What happens next</span>
            <span>FastAPI</span>
          </div>
          <h3>Lead capture, ready for a real workflow.</h3>
          <p>
            Submitting the form sends JSON to the backend. You can later attach
            the response to email automation, analytics, or a checkout system.
          </p>
          <div
            className="feature-list"
            style={{ justifyContent: "flex-start" }}
          >
            <span>Template request</span>
            <span>Occasion</span>
            <span>Contact email</span>
            <span>Project message</span>
          </div>
        </article>

        <LeadForm
          templates={data.templates}
          initialTemplateSlug={templateSlug}
        />
      </section>
    </main>
  );
}
