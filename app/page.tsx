import Link from "next/link";
import Topbar from "@/components/topbar";

import { loadSiteData } from "@/lib/api";
import RevealOnScroll from "@/components/reveal-on-scroll";

export default async function Home() {
  const data = await loadSiteData();

  return (
    <main className="page-shell" style={{ position: "relative" }}>
      <section className="hero">
        {/* Glow backgrounds */}
        <div className="glow glow-a"></div>
        <div className="glow glow-b"></div>

        {/* topbar */}
        <Topbar
          logo={data.brand.logo}
          brandName={data.brand.name}
        />

        <div className="hero-grid" style={{ marginTop: "60px", alignItems: "flex-start", position: "relative", zIndex: 2 }}>
          <div className="hero-copy" style={{ paddingTop: "40px" }}>
            <h1 className="fade-in-up" style={{ color: "var(--text)", fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: "1.1" }}>
              {data.hero.title}
            </h1>
            <p className="lead fade-in-up delay-100" style={{ fontSize: "1.2rem", marginTop: "24px", color: "var(--muted)" }}>
              {data.hero.lead}
            </p>
            <div className="hero-actions fade-in-up delay-200">
              <a className="primary-btn" href="#templates" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
                {data.hero.primaryCta}
              </a>
            </div>
          </div>

          <div className="fade-in-up delay-300" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: "280px",
              height: "500px",
              background: "#1a1a1a",
              borderRadius: "36px",
              border: "10px solid #2d2d2d",
              boxShadow: "0 20px 45px rgba(205, 90, 107, 0.2)",
              position: "relative",
              overflow: "hidden",
              backgroundClip: "padding-box"
            }}>
              <iframe
                src="/assets/birthday-template-1/index.html"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                  display: "block"
                }}
                title="Template Preview"
                sandbox="allow-scripts allow-same-origin allow-modals"
              />
            </div>
            <span style={{ marginTop: "16px", color: "var(--muted)", fontSize: "0.95rem", fontWeight: 500 }}>
              ✨ Live Interactive Preview (Try clicking it!)
            </span>
          </div>
        </div>
      </section>

      <RevealOnScroll>
        <section className="section" id="templates" style={{ marginTop: "40px" }}>
          <div style={{ marginBottom: "32px", display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ 
              color: "var(--accent)", 
              fontSize: "3rem",
              margin: 0,
              borderBottom: "4px double var(--accent)",
              paddingBottom: "4px"
            }}>
              Templates
            </h2>
            <span className="heart-icon-pulse" style={{ fontSize: "2rem" }}>💖</span>
          </div>

          <div className="template-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            gap: "32px",
            alignItems: "stretch"
          }}>
            {data.templates.map((template) => (
              <Link 
                href={`/editor?template=${template.slug}`}
                key={template.slug} 
                className="template-card" 
                style={{
                  display: "flex",
                  flexDirection: "column",
                  padding: "24px",
                  borderRadius: "28px",
                  border: "1px solid var(--line)",
                  background: "var(--surface)",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                  textDecoration: "none",
                  transition: "transform 0.25s ease, box-shadow 0.25s ease"
                }}
              >
                <div style={{
                  width: "100%",
                  height: "220px",
                  overflow: "hidden",
                  borderRadius: "20px",
                  marginBottom: "20px",
                  border: "1px solid rgba(0,0,0,0.04)",
                  background: "#fafafa"
                }}>
                  <img
                    src={`/assets/generated/${template.slug}.png`}
                    alt={template.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover"
                    }}
                  />
                </div>
                <h3 style={{ margin: "0 0 8px 0", fontSize: "1.45rem", color: "var(--text)", fontWeight: 700 }}>
                  {template.title}
                </h3>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.55, margin: "0 0 24px 0" }}>
                  {template.summary || template.description}
                </p>
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "auto",
                  paddingTop: "20px",
                  borderTop: "1px solid var(--line)"
                }}>
                  <span style={{ color: "var(--text)", fontWeight: 600, fontSize: "1.05rem" }}>{template.price}</span>
                  <span style={{
                    background: "var(--accent)",
                    color: "white",
                    padding: "10px 24px",
                    borderRadius: "14px",
                    fontWeight: 600,
                    fontSize: "0.95rem"
                  }}>
                    Create
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="section" id="how-it-works" style={{ marginTop: "60px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
            <h2 style={{ 
              color: "var(--accent)", 
              fontSize: "3rem",
              margin: 0,
              borderBottom: "4px double var(--accent)",
              paddingBottom: "4px"
            }}>
              How it works
            </h2>
          </div>

          <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "900px", margin: "0 auto" }}>
            {data.steps.map((step) => (
              <div key={step.number} className="step-card" style={{ padding: "32px" }}>
                <h3 style={{ margin: "0 0 16px 0", color: "var(--accent)", fontSize: "1.3rem", textAlign: "left" }}>
                  {step.number}. {step.title}
                </h3>
                <p style={{ color: "var(--text)", margin: 0, fontSize: "1.05rem" }}>{step.text}</p>
              </div>
            ))}
          </div>
          
          {/* Animated Walking Cat */}
          <div className="cat-container">
            <div className="cat-wrapper">
              <img
                src="/assets/generated/cat.gif"
                alt="Cute walking cat"
                style={{
                  height: "92px",
                  display: "block",
                  imageRendering: "pixelated"
                }}
              />
            </div>
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="section" id="reviews" style={{ marginTop: "60px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
            <h2 style={{ 
              color: "var(--accent)", 
              fontSize: "3rem",
              margin: 0,
              borderBottom: "4px double var(--accent)",
              paddingBottom: "4px"
            }}>
              What people are saying about this ?
            </h2>
          </div>

          <div className="testimonial-grid" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            alignItems: "start"
          }}>
            {data.testimonials.concat(data.testimonials).slice(0, 8).map((item, i) => (
              <blockquote 
                key={`${item.name}-${i}`} 
                className="testimonial-card"
                style={{
                  background: "var(--text)",
                  color: "white",
                  minHeight: "180px",
                  display: "flex",
                  flexDirection: "column",
                  border: "none",
                  marginTop: i % 2 !== 0 ? "40px" : "0" // Staggered masonry
                }}
              >
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>"{item.quote}"</p>
                <footer style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <strong style={{ fontSize: "1.2rem", color: "white" }}>{item.name}</strong>
                  <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>{item.tag}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>
      </RevealOnScroll>

      <RevealOnScroll>
        <section className="section" id="faq" style={{ marginTop: "80px", paddingBottom: "80px" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
            <h2 style={{ 
              color: "var(--accent)", 
              fontSize: "2.5rem",
              margin: 0,
              borderBottom: "4px double var(--accent)",
              paddingBottom: "4px"
            }}>
              FAQ's
            </h2>
          </div>

          <div className="faq-list" style={{ maxWidth: "800px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "16px" }}>
            {data.faqs.map((faq, idx) => (
              <details key={faq.question} className="faq-card" style={{
                borderRadius: "999px",
                padding: "16px 32px",
                background: "var(--surface)",
                border: "1px solid var(--line)"
              }}>
                <summary style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontWeight: 600,
                  color: "var(--accent)",
                  fontSize: "1.1rem"
                }}>
                  <span>{idx + 1}. {faq.question}</span>
                  <span style={{ fontSize: "1.4rem" }}>+</span>
                </summary>
                <p style={{ padding: "16px 0 0 24px", color: "var(--text)" }}>{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </RevealOnScroll>
    </main>
  );
}
