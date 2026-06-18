"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { siteData } from "@/lib/site-data";
import { listMyPages, deletePage } from "@/lib/api";
import { PageQrCode } from "@/components/editor/QRCodeDisplay";
import { useToast } from "@/components/ui/Toast";
import { ConfirmModal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

function readToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

export default function ProfilePage() {
  const [token, setToken] = useState<string | null>(null);
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);
  const { addToast } = useToast();

  useEffect(() => {
    const t = readToken();
    if (!t) {
      window.location.href = `/auth/login?next=${encodeURIComponent("/profile")}`;
      return;
    }
    setToken(t);
    (async () => {
      try {
        const res = await listMyPages(t);
        if (res && Array.isArray(res.items)) {
          setPages([...res.items].sort((a: any, b: any) => b.id - a.id));
        }
      } catch {
        addToast("Error loading your pages", "error");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (pageId: number) => {
    if (!token) return;
    try {
      await deletePage(pageId, token);
      setPages((prev) => prev.filter((p) => p.id !== pageId));
      addToast("Draft deleted successfully", "success");
    } catch (err: any) {
      addToast(err?.message ?? "Failed to delete draft", "error");
    }
  };

  return (
    <main>
      <section className="px-4 md:px-6 lg:px-8 pt-20 pb-16 md:pb-20">
        <div className="max-w-7xl mx-auto w-full">
          <div className="p-8 rounded-md border border-border bg-white mb-10">
            <p className="text-xs font-medium tracking-wider uppercase text-muted mb-2">User Account</p>
            <h2 className="text-3xl font-heading font-medium text-heading mb-3">My Pages</h2>
            <p className="text-sm text-muted max-w-[640px] leading-relaxed">
              Manage your custom digital greeting cards, view active QR codes, and edit your claimed drafts here.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-16 text-muted text-sm">Loading your pages...</div>
          ) : pages.length === 0 ? (
            <EmptyState icon="🥺" title="No Pages Yet" message="Start customizing a template to save or publish a custom page." actionLabel="Explore Templates" actionHref="/editor" />
          ) : (
            <div className="flex flex-col gap-6">
              {pages.map((page) => {
                const hasSlug = !!page.requested_slug;
                const isPublished = page.is_published;
                const templateTitle = page.template_slug
                  ? siteData.templates.find((t) => t.slug === page.template_slug)?.title ?? page.template_slug
                  : "Standard";
                return (
                  <div key={page.id} className="flex flex-col sm:flex-row justify-between gap-6 p-6 rounded-md border border-border bg-white items-start sm:items-center">
                    <div className="flex-1 min-w-0 w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-md text-xs font-medium uppercase tracking-wider ${isPublished ? "bg-success-bg text-success-text" : "bg-[rgba(255,167,38,0.1)] text-[#e65100]"}`}>
                          {isPublished ? "Published" : "Draft"}
                        </span>
                        <span className="text-xs text-muted">Template: <strong className="text-heading font-medium">{templateTitle}</strong></span>
                      </div>
                      <h3 className="text-lg font-heading font-medium text-heading mb-1">{page.title || "Untitled Card"}</h3>
                      {hasSlug ? (
                        <div className="flex flex-col gap-1 mb-3">
                          <span className="text-sm text-muted">
                            URL: <code className="bg-background px-1.5 py-0.5 rounded text-body text-xs">{page.requested_slug}</code>
                          </span>
                          {isPublished && (
                            <a href={`/p/${page.slug}`} target="_blank" rel="noreferrer" className="text-sm text-primary font-medium w-fit">Open Live Site &rarr;</a>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted italic block mb-3">No URL path claimed yet.</span>
                      )}
                      <div className="flex gap-3 flex-wrap">
                        {page.template_slug !== "birthday-template-1" && (
                          <Link href={`/editor?template=${page.template_slug}`} className="inline-flex items-center px-4 py-2 rounded-md border border-border text-heading text-sm font-medium no-underline hover:bg-background transition-all duration-200">
                            {isPublished ? "View Config" : "Resume Editor"}
                          </Link>
                        )}
                        {!isPublished && (
                          <Button variant="danger" size="sm" onClick={() => setDeleteTarget(page.id)}>Delete Draft</Button>
                        )}
                      </div>
                    </div>
                    {hasSlug && (
                      <div className="flex flex-col items-center gap-2 shrink-0">
                        <PageQrCode pageId={page.id} />
                        <span className="text-xs text-muted font-medium">Scan QR</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <ConfirmModal
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) handleDelete(deleteTarget);
          setDeleteTarget(null);
        }}
        title="Delete Draft"
        message="Are you sure you want to delete this draft? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
      />
    </main>
  );
}
