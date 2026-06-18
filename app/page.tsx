import { loadSiteData } from "@/lib/api";
import { Hero } from "@/components/sections/hero";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Templates } from "@/components/sections/templates-section";
import { Examples } from "@/components/sections/examples";
import { Testimonials } from "@/components/sections/testimonials";
import { FAQ } from "@/components/sections/faq";
import { CTASection } from "@/components/sections/cta-section";

export default async function Home() {
  const data = await loadSiteData();

  return (
    <main className="max-w-7xl mx-auto">
      <Hero />
      <HowItWorks />
      <Templates templates={data.templates} />
      <Examples />
      <Testimonials />
      <FAQ />
      <CTASection />
    </main>
  );
}
