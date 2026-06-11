import Link from "next/link";
import Topbar from "@/components/topbar";
import AuthAction from "@/components/auth-action";

import { loadSiteData } from "@/lib/api";
import RevealOnScroll from "@/components/reveal-on-scroll";

export default async function Home() {
  const data = await loadSiteData();

  return (
    <main className="page-shell" style={{ position: "relative" }}>
      <div className="announcement-bar">Try New "Birthday Template" now</div>
      
      <section className="hero">
        {/* topbar */}
        <Topbar
          logo="loveypage"
          brandName={data.brand.name}
          ghostHref="/editor"
          ghostLabel="Login/Signup"
          authAction={<AuthAction />}
        />

        <div className="hero-grid" style={{ marginTop: "60px", alignItems: "flex-start" }}>
          <div className="hero-copy" style={{ paddingTop: "40px" }}>
            <h1 className="fade-in-up" style={{ color: "var(--rd-text)" }}>
              The New Way<br/>to Celebrate<br/>Birthdays
            </h1>
            <p className="lead fade-in-up delay-100" style={{ fontSize: "1.2rem", marginTop: "24px" }}>
              Pick a template, Fill in your story
            </p>
            <div className="hero-actions fade-in-up delay-200">
              <a className="primary-btn" href="#templates" style={{ padding: "16px 32px", fontSize: "1.1rem" }}>
                Create you Loveypage
              </a>
            </div>
          </div>

          <div className="fade-in-up delay-300" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: "100%",
              height: "400px",
              background: "var(--surface)",
              borderRadius: "24px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text)",
              fontSize: "1.2rem",
              boxShadow: "0 8px 24px rgba(205, 90, 107, 0.15)",
              border: "1px solid var(--line)"
            }}>
              preview here
            </div>
            <span style={{ marginTop: "16px", color: "var(--text)", fontSize: "1.1rem" }}>cat</span>
          </div>
        </div>
      </section>

      <RevealOnScroll><section className="section" id="templates" style={{ marginTop: "40px" }}>
        <div style={{ marginBottom: "32px", display: "flex", alignItems: "baseline", gap: "12px" }}>
          <h2 style={{ 
            color: "var(--rd-solid)", 
            fontSize: "3rem",
            margin: 0,
            borderBottom: "4px double var(--rd-solid)",
            paddingBottom: "4px"
          }}>
            Templates
          </h2>
          <span style={{ color: "var(--text)", fontSize: "1.1rem" }}>cat</span>
        </div>

        <div className="template-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "24px",
          alignItems: "start"
        }}>
          {data.templates.map((template, i) => (
            <Link 
              href={`/templates/${template.slug}`}
              key={template.slug} 
              className="template-card" 
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: i % 2 === 0 ? "240px" : "300px", // Staggered masonry effect
                marginTop: i === 1 ? "40px" : i === 4 ? "40px" : "0", // Offset middle column
                textDecoration: "none"
              }}
            >
              <h3 style={{ textAlign: "center", marginTop: "24px", fontSize: "1.4rem", color: "var(--rd-text)" }}>
                {template.title}
              </h3>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginTop: "auto",
                paddingTop: "24px"
              }}>
                <span style={{ color: "var(--rd-text)", fontWeight: 500 }}>Pricing</span>
                <span style={{
                  background: "var(--rd-solid)",
                  color: "white",
                  padding: "8px 20px",
                  borderRadius: "8px",
                  fontWeight: 600,
                  fontSize: "0.9rem"
                }}>
                  Create
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section></RevealOnScroll>

      <RevealOnScroll><section className="section" id="how-it-works" style={{ marginTop: "60px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
          <h2 style={{ 
            color: "var(--rd-solid)", 
            fontSize: "3rem",
            margin: 0,
            borderBottom: "4px double var(--rd-solid)",
            paddingBottom: "4px"
          }}>
            How it works
          </h2>
        </div>

        <div className="steps-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px", maxWidth: "900px", margin: "0 auto" }}>
          {data.steps.map((step) => (
            <div key={step.number} className="step-card" style={{ padding: "32px" }}>
              <h3 style={{ margin: "0 0 16px 0", color: "var(--rd-solid)", fontSize: "1.3rem", textAlign: "left" }}>
                {step.number}. {step.title}
              </h3>
              <p style={{ color: "var(--rd-text)", margin: 0, fontSize: "1.05rem" }}>{step.text}</p>
            </div>
          ))}
        </div>
        
        <div style={{
          marginTop: "60px",
          borderBottom: "2px solid var(--rd-solid)",
          paddingBottom: "12px",
          textAlign: "center",
          color: "var(--text)",
          fontSize: "1.2rem",
          maxWidth: "600px",
          margin: "60px auto 0"
        }}>
          cat walking...
        </div>
      </section></RevealOnScroll>

      <RevealOnScroll><section className="section" id="reviews" style={{ marginTop: "60px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
          <h2 style={{ 
            color: "var(--rd-solid)", 
            fontSize: "3rem",
            margin: 0,
            borderBottom: "4px double var(--rd-solid)",
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
                background: "var(--rd-text)",
                color: "white",
                minHeight: "180px",
                display: "flex",
                flexDirection: "column",
                border: "none",
                marginTop: i % 2 !== 0 ? "40px" : "0" // Staggered masonry
              }}
            >
              <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.95rem" }}>There Comments...</p>
              <footer style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <strong style={{ fontSize: "1.2rem", color: "white" }}>Name</strong>
                <span style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.8)" }}>Template name</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </section></RevealOnScroll>

      <RevealOnScroll><section className="section" id="faq" style={{ marginTop: "80px", paddingBottom: "80px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "48px" }}>
          <h2 style={{ 
            color: "var(--rd-solid)", 
            fontSize: "2.5rem",
            margin: 0,
            borderBottom: "4px double var(--rd-solid)",
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
                color: "var(--rd-solid)",
                fontSize: "1.1rem"
              }}>
                <span>{idx + 1}. {faq.question}</span>
                <span style={{ fontSize: "1.4rem" }}>+</span>
              </summary>
              <p style={{ padding: "16px 0 0 24px", color: "var(--text)" }}>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section></RevealOnScroll>
    </main>
  );
}
