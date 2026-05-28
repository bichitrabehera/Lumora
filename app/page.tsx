const templates = [
  {
    title: "Moonlit Birthday",
    category: "Birthday",
    price: "From $19",
    description:
      "A playful birthday landing page with a reveal moment, photo wall, and handwritten closing note.",
  },
  {
    title: "Afterglow Anniversary",
    category: "Anniversary",
    price: "From $29",
    description:
      "Warm story blocks, a timeline, and a polished music section made for relationship milestones.",
  },
  {
    title: "Soft Apology",
    category: "Apology",
    price: "Free",
    description:
      "A calm, thoughtful page with a message reveal, memory cards, and a gentle call-to-action.",
  },
  {
    title: "Wedding Invite",
    category: "Wedding",
    price: "From $49",
    description:
      "An elegant invite with venue details, RSVP section, countdown, and a memorable opening screen.",
  },
  {
    title: "Love Note",
    category: "Just Because",
    price: "Free",
    description:
      "Minimal, intimate, and easy to personalize when the message matters more than the medium.",
  },
  {
    title: "Milestone Story",
    category: "Special Day",
    price: "From $24",
    description:
      "A layered page for birthdays, graduations, and the kind of wins you want to remember properly.",
  },
];

const testimonials = [
  {
    quote:
      "It felt like a boutique website, not a template. We edited it in minutes and shared it the same day.",
    name: "Aarohi S.",
    tag: "Birthday gift",
  },
  {
    quote:
      "The page looked polished on mobile, which mattered because we shared it straight through chat.",
    name: "Daniel K.",
    tag: "Anniversary surprise",
  },
  {
    quote:
      "The structure is simple, but the presentation feels premium. It made the moment feel bigger.",
    name: "Meera P.",
    tag: "Wedding invite",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose a mood",
    text: "Start with a template style that fits the moment: romantic, playful, soft, or elegant.",
  },
  {
    number: "02",
    title: "Add your story",
    text: "Swap in photos, words, dates, and a song so the page feels like it belongs to one person.",
  },
  {
    number: "03",
    title: "Preview and polish",
    text: "Check the flow, adjust the colors, and make sure every section feels right on desktop and phone.",
  },
  {
    number: "04",
    title: "Share the link",
    text: "Send it in a chat, attach it to a QR card, or drop it into a surprise message at the right time.",
  },
];

const faqs = [
  {
    question: "What is this site for?",
    answer:
      "It is a landing page concept for personalized celebration websites that can be shared as a single link.",
  },
  {
    question: "Can the pages be customized?",
    answer:
      "Yes. The idea is to swap colors, copy, photos, and a few sections so every page feels personal.",
  },
  {
    question: "Is this mobile friendly?",
    answer:
      "The layout is built to stack cleanly on smaller screens so the experience stays polished on phones.",
  },
  {
    question: "Can I turn this into a real product site?",
    answer:
      "Yes. You can replace the sample content with your own products, pricing, and checkout flow later.",
  },
];

const stats = [
  ["7k+", "pages shared"],
  ["15+", "template styles"],
  ["30 sec", "to launch"],
  ["4.9/5", "average rating"],
];

export default function Home() {
  return (
    <main className="page-shell">
      <section className="hero">
        <div className="glow glow-a" />
        <div className="glow glow-b" />

        <header className="topbar">
          <div className="brand-mark">LL</div>
          <nav>
            <a href="#templates">Templates</a>
            <a href="#how-it-works">How it works</a>
            <a href="#reviews">Reviews</a>
            <a href="#faq">FAQ</a>
          </nav>
          <a className="ghost-btn" href="#templates">
            View demos
          </a>
        </header>

        <div className="hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Premium websites for life moments</span>
            <h1>Make a gift page that feels bespoke from the first scroll.</h1>
            <p className="lead">
              Build a beautiful one-page experience for birthdays,
              anniversaries, proposals, apologies, and quiet celebrations. Start
              with a polished design, then make it yours in minutes.
            </p>
            <div className="hero-actions">
              <a className="primary-btn" href="#templates">
                Explore templates
              </a>
              <a className="secondary-btn" href="#how-it-works">
                See how it works
              </a>
            </div>

            <div className="trust-row">
              {stats.map(([value, label]) => (
                <div key={label} className="trust-pill">
                  <strong>{value}</strong>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="hero-card">
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
              <div>
                <span>Music</span>
                <strong>Dedication card</strong>
              </div>
              <div>
                <span>Photos</span>
                <strong>Polaroid wall</strong>
              </div>
              <div>
                <span>Reveal</span>
                <strong>Letter moment</strong>
              </div>
              <div>
                <span>Share</span>
                <strong>Single link</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ticker" aria-label="Highlights">
        <div className="ticker-track">
          <span>WEDDING INVITES</span>
          <span>ANNIVERSARY SURPRISES</span>
          <span>BIRTHDAY PAGES</span>
          <span>APOLOGY NOTES</span>
          <span>JUST BECAUSE</span>
          <span>MEMORY ROOMS</span>
          <span>WEDDING INVITES</span>
          <span>ANNIVERSARY SURPRISES</span>
          <span>BIRTHDAY PAGES</span>
          <span>APOLOGY NOTES</span>
        </div>
      </section>

      <section className="section" id="templates">
        <div className="section-heading">
          <span className="eyebrow">Templates</span>
          <h2>Clean, emotional layouts that you can adapt to any occasion.</h2>
          <p>
            This is a fresh design system inspired by gift pages and celebration
            microsites, but built with its own mood, spacing, and visual
            language.
          </p>
        </div>

        <div className="template-grid">
          {templates.map((template) => (
            <article key={template.title} className="template-card">
              <div className="template-top">
                <span>{template.category}</span>
                <span>{template.price}</span>
              </div>
              <h3>{template.title}</h3>
              <p>{template.description}</p>
              <div className="template-actions">
                <a href="#faq">Preview flow</a>
                <a href="#how-it-works">Use this style</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section" id="how-it-works">
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
          {steps.map((step) => (
            <div key={step.number} className="step-card">
              <span className="step-number">{step.number}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="reviews">
        <div className="section-heading">
          <span className="eyebrow">Reviews</span>
          <h2>People use it when they want the moment to land properly.</h2>
          <p>
            The goal is not just to look good. It is to make a shared link feel
            like a real gesture.
          </p>
        </div>

        <div className="testimonial-grid">
          {testimonials.map((item) => (
            <blockquote key={item.name} className="testimonial-card">
              <p>{item.quote}</p>
              <footer>
                <strong>{item.name}</strong>
                <span>{item.tag}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="section feature-band">
        <div>
          <span className="eyebrow">Built for sharing</span>
          <h2>Make it personal without touching code.</h2>
        </div>
        <div className="feature-list">
          <span>Mobile-first layouts</span>
          <span>Elegant typography</span>
          <span>Story-led sections</span>
          <span>Fast launch</span>
          <span>Custom colors</span>
          <span>Single-link sharing</span>
        </div>
      </section>

      <section className="section" id="faq">
        <div className="section-heading">
          <span className="eyebrow">FAQ</span>
          <h2>
            Questions people usually ask before they share a page like this.
          </h2>
        </div>

        <div className="faq-grid">
          {faqs.map((faq) => (
            <details key={faq.question} className="faq-card">
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="cta-panel">
        <div>
          <span className="eyebrow">Ready to launch</span>
          <h2>Use this as the base for your own gift website brand.</h2>
          <p>
            Swap the copy, change the template grid, and connect your own
            product or checkout flow when you are ready.
          </p>
        </div>
        <a className="primary-btn" href="#templates">
          Start with a template
        </a>
      </section>
    </main>
  );
}
