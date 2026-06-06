import Link from "next/link";
import Topbar from "@/components/topbar";
import AuthAction from "@/components/auth-action";

import { loadSiteData } from "@/lib/api";
import RevealOnScroll from "@/components/reveal-on-scroll";

export default async function Home() {
  const data = await loadSiteData();

  return (
    <main className="page-shell">
      <section className="hero">
        <div className="glow glow-a" />
        <div className="glow glow-b" />

        {/* topbar */}
        <Topbar
          logo={data.brand.logo}
          brandName={data.brand.name}
          ghostHref="/editor"
          ghostLabel="Create yours →"
          authAction={<AuthAction />}
          nav={
            <>
              <a href="#templates">Templates</a>
              <a href="#how-it-works">How it works</a>
              <a href="#pricing">Pricing</a>
            </>
          }
        />

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow fade-in-up">{data.hero.eyebrow}</span>
            <h1 className="fade-in-up delay-100">{data.hero.title}</h1>
            <p className="lead fade-in-up delay-200">{data.hero.lead}</p>
            <div className="hero-actions fade-in-up delay-300">
              <a className="primary-btn" href="#templates">
                {data.hero.primaryCta}
              </a>
              <a className="secondary-btn" href="#how-it-works">
                {data.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="hero-card fade-in-up delay-300">
            <div className="hero-card-top">
              <span>Featured moment</span>
              <span className="status-dot">Live preview</span>
            </div>
            <div className="poster">
              <div className="poster-orb poster-orb-one" />
              <div className="poster-orb poster-orb-two" />
              <div className="poster-note">
                <p>
                  For the one person who deserves something more thoughtful than
                  a text.
                </p>
                <strong>Open when ready</strong>
              </div>
            </div>
            <div className="hero-mini-grid">
              {data.featureCards.map((card) => (
                <div key={card.title}>
                  <span>{card.label}</span>
                  <strong>{card.title}</strong>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Highlights">
        <div className="ticker-track">
          {data.highlights.concat(data.highlights).map((item, index) => (
            <span key={`${item}-${index}`}>{item}</span>
          ))}
        </div>
      </section>

      <RevealOnScroll><section className="section" id="templates">
        <div className="section-heading">
          <span className="eyebrow">Templates</span>
          <h2>Clean, emotional layouts that you can adapt to any occasion.</h2>
          <p>
            This is a full-stack rebuild with a shared data source, template
            detail pages, and a backend lead form so the site behaves like a
            real product instead of a static mockup.
          </p>
        </div>

        <div className="template-grid">
          {data.templates.map((template) => (
            <article key={template.slug} className="template-card">
              <div className="template-top">
                <span>{template.category}</span>
                <span>{template.price}</span>
              </div>
              <h3>{template.title}</h3>
              <p>{template.description}</p>
              <div className="template-actions">
                <Link href={`/templates/${template.slug}`}>View details</Link>
                <Link href={`/editor?template=${template.slug}`}>
                  Use this style
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section></RevealOnScroll>

      <RevealOnScroll><section className="section split-section" id="how-it-works">
        <div className="section-heading narrow">
          <span className="eyebrow">How it works</span>
          <h2>
            Simple enough for a one-time surprise, detailed enough to feel
            custom.
          </h2>
          <p>
            The structure stays familiar: choose, personalize, preview, and
            share. The styling makes it feel more editorial and less like a
            generic card site.
          </p>
        </div>

        <div className="steps-grid">
          {data.steps.map((step) => (
            <div key={step.number} className="step-card">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section></RevealOnScroll>

      <RevealOnScroll><section className="section" id="reviews">
        <div className="section-heading">
          <span className="eyebrow">Reviews</span>
          <h2>People use it when they want the moment to land properly.</h2>
          <p>
            The goal is not just to look good. It is to make a shared link feel
            like a real gesture.
          </p>
        </div>

        <div className="testimonial-grid">
          {data.testimonials.map((item) => (
            <blockquote key={item.name} className="testimonial-card">
              <p>{item.quote}</p>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.tag}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section></RevealOnScroll>

      <RevealOnScroll><section className="section feature-band">
        <div>
          <span className="eyebrow">Built for sharing</span>
          <h2>Make it personal without touching code.</h2>
        </div>
        <div className="feature-list">
          {data.templates.slice(0, 6).map((template) => (
            <span key={template.slug}>{template.bestFor}</span>
          ))}
        </div>
      </section></RevealOnScroll>

      <RevealOnScroll><section className="section" id="faq">
        <div className="section-heading">
          <span className="eyebrow">FAQ</span>
          <h2>
            Questions people usually ask before they share a page like this.
          </h2>
        </div>

        <div className="faq-grid">
          {data.faqs.map((faq) => (
            <details key={faq.question} className="faq-card">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section></RevealOnScroll>

      <RevealOnScroll><section className="cta-panel">
        <div>
          <span className="eyebrow">Ready to launch</span>
          <h2>Use this as the base for your own gift website brand.</h2>
          <p>
            Swap the copy, change the template grid, and connect your own
            product or checkout flow when you are ready.
          </p>
        </div>
        <Link className="primary-btn" href="/contact">
          Start with a template
        </Link>
      </section></RevealOnScroll>
    </main>
  );
}
