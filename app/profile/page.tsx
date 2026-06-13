"use client";

import React, { useState, useEffect } from "react";
import Topbar from "@/components/topbar";
import { siteData } from "@/lib/site-data";
import { listMyPages, deletePage } from "@/lib/api";
import { PageQrCode } from "@/app/editor/editor";
import Link from "next/link";

function readToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function ProfilePage() {
  const [token, setToken] = useState<string | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Authenticate user & load pages
  useEffect(() => {
    const t = readToken();
    if (!t) {
      const next = encodeURIComponent("/profile");
      window.location.href = `/auth/login?next=${next}`;
      return;
    }
    setToken(t);

    (async () => {
      try {
        const res = await listMyPages(t);
        if (res && Array.isArray(res.items)) {
          // Sort by ID descending to show newest first
          const sorted = [...res.items].sort((a: any, b: any) => b.id - a.id);
          setPages(sorted);
        }
      } catch (err) {
        console.error("Error loading user pages:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (pageId: number) => {
    if (!token) return;
    if (!window.confirm("Are you sure you want to delete this draft? This action cannot be undone.")) {
      return;
    }
    try {
      await deletePage(pageId, token);
      setPages(prev => prev.filter(p => p.id !== pageId));
    } catch (err: any) {
      alert(err?.message ?? "Failed to delete draft");
    }
  };

  return (
    <main className="page-shell">
      <Topbar
        logo={siteData.brand.logo}
        brandName={siteData.brand.name}
      />

      <section style={{ maxWidth: 1000, margin: "40px auto 80px", padding: "0 24px" }}>
        {/* Profile Premium Header Banner */}
        <div style={{
          background: "linear-gradient(135deg, rgba(255,199,154,0.2), rgba(255,255,255,0.96))",
          border: "1px solid rgba(188,83,91,0.12)",
          padding: "48px 40px",
          borderRadius: 32,
          boxShadow: "0 20px 45px rgba(205, 90, 107, 0.04)",
          marginBottom: 40,
        }}>
          <span style={{
            textTransform: "uppercase",
            letterSpacing: 2.5,
            fontSize: 11.5,
            fontWeight: 700,
            color: "var(--accent)",
            display: "inline-block",
            marginBottom: 8
          }}>
            User Account
          </span>
          <h2 style={{ fontSize: "2.3rem", fontWeight: 700, color: "var(--text)", margin: "0 0 12px" }}>
            My Claimed Pages
          </h2>
          <p style={{ color: "var(--muted)", margin: 0, fontSize: "1.08rem", lineHeight: 1.6, maxWidth: 640 }}>
            Manage your custom digital greeting cards, view active QR codes, and edit your claimed drafts here.
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px 0", color: "var(--muted)", fontSize: "1.1rem" }}>
            Loading claimed pages...
          </div>
        ) : pages.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "80px 40px",
            border: "2px dashed var(--line)",
            borderRadius: 28,
            background: "rgba(0,0,0,0.01)"
          }}>
            <span style={{ fontSize: "3rem", display: "inline-block", marginBottom: 20 }}>🥺</span>
            <h3 style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--text)", marginBottom: 10 }}>No Pages Claimed Yet</h3>
            <p style={{ color: "var(--muted)", marginBottom: 24, fontSize: "0.98rem" }}>
              Start customizing a template to save or publish a custom microsite.
            </p>
            <Link className="primary-btn" href="/editor" style={{ padding: "12px 28px", borderRadius: 16, display: "inline-block", textDecoration: "none" }}>
              Explore Templates
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gap: 28 }}>
            {pages.map((page) => {
              const hasSlug = !!page.requested_slug;
              const isPublished = page.is_published;
              const templateTitle = page.template_slug
                ? siteData.templates.find(t => t.slug === page.template_slug)?.title ?? page.template_slug
                : "Standard";

              return (
                <div
                  key={page.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 32,
                    padding: 32,
                    borderRadius: 28,
                    border: "1px solid var(--line)",
                    background: "var(--surface)",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
                    flexWrap: "wrap",
                    alignItems: "center"
                  }}
                >
                  {/* Left Side: Metadata & Status */}
                  <div style={{ flex: "1 1 400px", display: "grid", gap: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <span style={{
                        padding: "6px 14px",
                        borderRadius: 999,
                        background: isPublished ? "rgba(79,195,132,0.1)" : "rgba(255,167,38,0.1)",
                        color: isPublished ? "#2e7d32" : "#e65100",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        textTransform: "uppercase",
                        letterSpacing: "0.05em"
                      }}>
                        {isPublished ? "Published" : "Draft"}
                      </span>
                      <span style={{ color: "var(--muted)", fontSize: "0.85rem" }}>
                        Template: <strong>{templateTitle}</strong>
                      </span>
                    </div>

                    <div>
                      <h3 style={{ margin: "0 0 8px", fontSize: "1.45rem", fontWeight: 700, color: "var(--text)" }}>
                        {page.title || "Untitled Card"}
                      </h3>
                      {hasSlug ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                          <span style={{ fontSize: "0.88rem", color: "var(--muted)" }}>
                            URL path: <code style={{
                              background: "rgba(0,0,0,0.04)",
                              padding: "2px 6px",
                              borderRadius: 6,
                              fontFamily: "monospace",
                              color: "var(--text)"
                            }}>{page.requested_slug}</code>
                          </span>
                          {isPublished && (
                            <a
                              href={`/p/${page.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                fontSize: "0.92rem",
                                color: "var(--accent)",
                                fontWeight: 600,
                                textDecoration: "underline",
                                width: "fit-content",
                                marginTop: 4
                              }}
                            >
                              Open Live Site
                            </a>
                          )}
                        </div>
                      ) : (
                        <span style={{ fontSize: "0.88rem", color: "var(--muted)", fontStyle: "italic" }}>
                          No URL path claimed yet.
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: 12, marginTop: 4 }}>
                      {page.template_slug !== "birthday-template-1" && (
                        <Link
                          href={`/editor?template=${page.template_slug}`}
                          style={{
                            padding: "10px 20px",
                            borderRadius: 14,
                            border: "1px solid var(--line)",
                            background: "var(--surface)",
                            color: "var(--text)",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            textDecoration: "none",
                            textAlign: "center"
                          }}
                        >
                          {isPublished ? "View Config" : "Resume Editor"}
                        </Link>
                      )}
                      {!isPublished && (
                        <button
                          onClick={() => handleDelete(page.id)}
                          style={{
                            padding: "10px 20px",
                            borderRadius: 14,
                            border: "1px solid rgba(220, 38, 38, 0.2)",
                            background: "rgba(220, 38, 38, 0.05)",
                            color: "var(--accent)",
                            fontSize: "0.9rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            outline: "none"
                          }}
                        >
                          Delete Draft
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right Side: QR Code (if URL claimed) */}
                  {hasSlug && (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <PageQrCode pageId={page.id} />
                      <span style={{ fontSize: "0.78rem", color: "var(--muted)", fontWeight: 500 }}>
                        Scan QR Code
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
