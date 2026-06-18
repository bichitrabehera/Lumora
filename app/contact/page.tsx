import { loadSiteData } from "@/lib/api";
import LeadForm from "./lead-form";

export default async function ContactPage({ searchParams }: { searchParams?: { template?: string | string[] } }) {
  const data = await loadSiteData();
  const templateSlug = Array.isArray(searchParams?.template) ? searchParams.template[0] : (searchParams?.template ?? "");

  return (
    <main>
      <section className="px-4 md:px-6 lg:px-8 pt-20 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto w-full px-0 md:px-8">
          <div className="mb-12">
            <p className="text-sm font-medium tracking-wider uppercase text-muted mb-3">{data.contact.title}</p>
            <h1 className="text-4xl md:text-5xl leading-tight font-heading font-medium text-heading tracking-tight mb-4">Tell us about your project.</h1>
            <p className="text-base text-muted max-w-xl leading-relaxed">{data.contact.lead}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="p-6 rounded-md border border-border bg-white">
              <h3 className="text-base font-medium text-heading mb-2">What happens next?</h3>
              <p className="text-sm text-muted leading-relaxed mb-5">Submitting the form sends your request to the team. You&apos;ll hear back about your custom page, usually within a day.</p>
              <div className="flex flex-wrap gap-2">
                {["Custom page", "Occasion", "Contact info", "Timeline"].map((label) => (
                  <span key={label} className="text-xs font-medium px-3 py-1.5 rounded-md border border-border bg-background text-body">{label}</span>
                ))}
              </div>
            </div>

            <LeadForm templates={data.templates} initialTemplateSlug={templateSlug} />
          </div>
        </div>
      </section>
    </main>
  );
}
