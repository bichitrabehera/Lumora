"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  getUploadSignature,
  loadTemplate,
  saveDraft,
  publishPage,
  createOrderForPage,
  confirmRazorpayPayment,
  getPageQR,
  listMyPages,
} from "@/lib/api";
import { TemplatePreview } from "@/components/microsite-templates";
import { siteData } from "@/lib/site-data";

function readToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

const TEMPLATE_DEFAULTS: Record<string, Record<string, any>> = {
  "birthday-template-1": {
    page_title: "A Grand Birthday Surprise!",
    welcome_title: "You've got a surprise!",
    welcome_message: "Click below to start your birthday journey...",
    start_button_label: "Start the Celebration!",
    letter_greeting: "Dearest [Name],",
    letter_message: "This message carries wishes straight from the heart.",
    letter_prompt: "Click the button to reveal your special birthday surprise!",
    unfold_button_label: "Unfold My Surprise!",
    recipient_name: "Sapthesh!",
    final_greeting: "Happy Birthday,",
    final_wish: "May your special day be filled with joy.",
    signature: "With love and best wishes",
    music_url: "/assets/birthday-template-1/birthday_song.mp3",
  },
  "birthday-template-2": {
    page_title: "Birthday Wish",
    envelope_text: "A special note for you",
    music_greeting: "Happy Birthday!",
    recipient_name: "Sapthesh",
    polaroid_caption_1: "Memory 1",
    polaroid_caption_2: "Memory 2",
    polaroid_caption_3: "Memory 3",
    flower_wish_1: "Joy",
    flower_wish_2: "Peace",
    flower_wish_3: "Love",
    letter_message: "Wishing you the happiest of birthdays! May this year bring you closer to your dreams, surround you with love, and give you countless reasons to smile.",
    signature: "- Yours",
  },
  "apology-template-1": {
    page_title: "Cute Apology",
    recipient_name: "Sapthesh",
    apology_question: "Will you forgive me?",
    polaroid_caption_1: "Memory 1",
    polaroid_caption_2: "Memory 2",
    polaroid_caption_3: "Memory 3",
    letter_message: "I wanted to make this to show you how much I care. I promise to do better and make you smile more often. You mean the world to me.",
    signature: "- Yours always",
  },
  "apology-template-2": {
    page_title: "My Apology",
    recipient_name: "Recipient",
    envelope_text: "Please open this letter... I have something important to say.",
    flip_prompt_1: "Why I'm writing this",
    flip_message_1: "I want to explain what happened and apologize sincerely.",
    flip_prompt_2: "What I promise",
    flip_message_2: "I promise to listen more, communicate better, and be more patient.",
    flip_prompt_3: "Our relationship",
    flip_message_3: "You are the most important person to me and I value us so much.",
    final_letter_message: "I am truly sorry for my actions. I hope you can find it in your heart to forgive me.",
  },
  "apology-template-3": {
    page_title: "Sorry Petals",
    recipient_name: "Recipient",
    puzzle_message: "I'm sorry. Please pluck the petals below.",
    petal_prompt_1: "First Petal",
    petal_message_1: "I am sorry for my words.",
    petal_prompt_2: "Second Petal",
    petal_message_2: "I am sorry for my actions.",
    petal_prompt_3: "Third Petal",
    petal_message_3: "I want to make it up to you.",
    final_letter_message: "You mean the world to me and I hope we can move past this together.",
  },
  "love-template-1": {
    page_title: "A Little Bouquet",
    recipient_name: "My Love",
    hero_title: "A little bouquet for you",
    button_text: "Open Bouquet",
    final_letter_message: "Here's a small reminder of how much you mean to me. Every single day, I am grateful for you.",
  },
};

function buildTemplateDefaults(template: any | null, slug: string | null) {
  const defaults: Record<string, any> = {};
  const fields = template?.schema?.fields ?? [];
  const templateSlug = slug || template?.slug;

  defaults.requested_slug = "";

  const presets = templateSlug ? TEMPLATE_DEFAULTS[templateSlug] : null;

  for (const field of fields) {
    if (presets && presets[field.key] !== undefined) {
      defaults[field.key] = presets[field.key];
    } else {
      if (field.key === "title")
        defaults[field.key] = template?.title ?? "My Page";
      else if (field.key === "subtitle")
        defaults[field.key] = template?.summary ?? "";
      else if (field.key === "message")
        defaults[field.key] = template?.description ?? "";
      else if (field.key === "photos")
        defaults[field.key] = [];
      else if (field.key === "audio_url")
        defaults[field.key] = template?.assets?.sample_audio ?? "";
      else if (field.type === "image")
        defaults[field.key] = "";
      else
        defaults[field.key] = "";
    }
  }

  if (!fields.length) {
    defaults.title = template?.title ?? "My Page";
    defaults.body = template?.description ?? "Write something lovely...";
    defaults.image_url = "";
  }

  return defaults;
}

export default function Editor() {
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  const [templateMeta, setTemplateMeta] = useState<any | null>(null);
  const [templateDef, setTemplateDef] = useState<any | null>(null);
  const [fields, setFields] = useState<Record<string, any>>({});
  const [pageId, setPageId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [publishInfo, setPublishInfo] = useState<{
    fullUrl: string;
    qr: string | null;
    slug: string;
  } | null>(null);

  const autosaveRef = useRef<number | null>(null);
  const isMounted = useRef(false);

  const isFreeTemplate = String(templateMeta?.price ?? "")
    .toLowerCase()
    .includes("free");

  const isUrlLocked = !!pageId && !!fields.requested_slug;
  const isBirthday1Locked = templateSlug === "birthday-template-1" && !!pageId;

  // Load slug from URL on mount & verify auth token
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const t = params.get("template");
      if (t) setTemplateSlug(t);
      const token = readToken();
      if (!token) {
        const next = encodeURIComponent(
          window.location.pathname + window.location.search,
        );
        window.location.href = `/auth/login?next=${next}`;
        return;
      }
    } catch (err) {
      // ignore
    }
    isMounted.current = true;
  }, []);

  // Fetch template data when slug changes
  useEffect(() => {
    if (!templateSlug) return;
    (async () => {
      const token = readToken();
      const t = await loadTemplate(templateSlug);
      setTemplateMeta(t ?? null);
      const schema = t?.schema ?? {
        fields: [
          { key: "title", type: "text", label: "Title" },
          { key: "body", type: "textarea", label: "Body" },
          { key: "image_url", type: "image", label: "Hero image" },
        ],
      };
      setTemplateDef(schema);

      let existingDraft: any = null;
      if (token) {
        try {
          const myPagesRes = await listMyPages(token);
          if (myPagesRes && Array.isArray(myPagesRes.items)) {
            const drafts = myPagesRes.items.filter(
              (p: any) => p.template_slug === templateSlug && p.is_draft
            );
            if (drafts.length > 0) {
              // Sort by ID descending to get the most recent one
              drafts.sort((a: any, b: any) => b.id - a.id);
              existingDraft = drafts[0];
            }
          }
        } catch (e) {
          console.error("Error loading existing user drafts:", e);
        }
      }

      if (existingDraft) {
        setPageId(existingDraft.id);
        setFields({
          ...buildTemplateDefaults(t, templateSlug),
          ...(existingDraft.field_values || {}),
          requested_slug: existingDraft.requested_slug ?? "",
        });
      } else {
        setFields(buildTemplateDefaults(t, templateSlug));
        setPageId(null);
      }
      setPublishInfo(null);
    })();
  }, [templateSlug]);

  // Trigger autosave on field changes
  useEffect(() => {
    if (!isMounted.current || !templateSlug || Object.keys(fields).length === 0) return;
    if (autosaveRef.current) window.clearTimeout(autosaveRef.current);
    autosaveRef.current = window.setTimeout(() => {
      handleAutoSave();
    }, 1500) as unknown as number;
    return () => {
      if (autosaveRef.current) window.clearTimeout(autosaveRef.current);
    };
  }, [fields, templateSlug]);

  async function uploadFile(file: File) {
    const sig = await getUploadSignature();
    if (!sig) {
      throw new Error("Upload not configured on backend");
    }

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.api_key);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);

    const cloudUrl = `https://api.cloudinary.com/v1_1/${sig.cloud_name}/auto/upload`;
    const res = await fetch(cloudUrl, { method: "POST", body: form });
    const data = await res.json();
    if (!data.secure_url) {
      throw new Error("Upload failed");
    }
    return data.secure_url as string;
  }

  async function handleAutoSave(throwOnError = false) {
    try {
      setSaving(true);
      const token = readToken();

      // Derive SQLModel Page fields dynamically for listing metadata
      const pageTitle = fields.page_title || fields.title || templateMeta?.title || "My Page";
      
      let pageBody = fields.letter_message || fields.final_letter_message || fields.welcome_message || fields.body || templateMeta?.description || "Personalized microsite.";
      if (typeof pageBody !== "string") {
        pageBody = JSON.stringify(pageBody);
      }

      const imageUrl = fields.image_url || (fields.photos && fields.photos[0]) || "";

      const payload: any = {
        title: pageTitle,
        body: pageBody,
        image_url: imageUrl || undefined,
        template_slug: templateSlug ?? undefined,
        requested_slug: String(fields.requested_slug ?? "").trim() || undefined,
        field_values: fields,
        is_draft: true,
      };
      const res = await saveDraft(pageId, payload, token ?? undefined);
      if (res?.page?.id) setPageId(res.page.id);
      return res;
    } catch (err) {
      console.error("Autosave error:", err);
      if (throwOnError) throw err;
    } finally {
      setSaving(false);
    }
    return null;
  }

  async function handleSave() {
    try {
      await handleAutoSave(true);
      alert("Saved draft successfully!");
    } catch (err: any) {
      alert(err?.message ?? "Save failed");
    }
  }

  async function handlePublish() {
    try {
      const token = readToken();
      const draft = await handleAutoSave(true);
      const effectivePageId = draft?.page?.id ?? pageId;
      if (!effectivePageId) throw new Error("No draft to publish");
      const res = await publishPage(effectivePageId, token ?? undefined);
      const fullUrl = `${window.location.origin}/p/${res.page.slug}`;
      const qr = await getPageQR(res.page.id);
      setPublishInfo({
        fullUrl,
        qr: qr?.data ?? null,
        slug: res.page.slug,
      });
    } catch (err: any) {
      alert(err?.message ?? "Publish failed");
    }
  }

  function loadScript(src: string) {
    return new Promise<void>((resolve, reject) => {
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return resolve();
      const s = document.createElement("script");
      s.src = src;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load script"));
      document.body.appendChild(s);
    });
  }

  async function handlePayAndPublish() {
    try {
      const token = readToken();
      const draft = await handleAutoSave(true);
      const effectivePageId = draft?.page?.id ?? pageId;
      if (!effectivePageId) throw new Error("No draft to publish");
      const requestedSlug = String(fields.requested_slug ?? "").trim();
      if (!requestedSlug) {
        throw new Error(
          "Please enter the URL you want before claiming or buying.",
        );
      }

      // derive amount from templateMeta.price (digits)
      const priceRaw = templateMeta?.price ?? "";
      const digits = String(priceRaw).replace(/[^0-9]/g, "");
      const amount = parseInt(digits || "0", 10);
      if (!amount || amount <= 0) {
        // free template
        await handlePublish();
        return;
      }

      const orderRes = await createOrderForPage(
        amount,
        effectivePageId ?? undefined,
      );
      const { order, key } = orderRes;
      await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      const options: any = {
        key: key,
        order_id: order.id,
        name: templateMeta?.title ?? "lovey page",
        handler: async function (resp: any) {
          try {
            await confirmRazorpayPayment({
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            // now publish
            const pub = await publishPage(effectivePageId, token ?? undefined);
            const fullUrl = `${window.location.origin}/p/${pub.page.slug}`;
            const qr = await getPageQR(pub.page.id);
            setPublishInfo({
              fullUrl,
              qr: qr?.data ?? null,
              slug: pub.page.slug,
            });
          } catch (err: any) {
            alert(err?.message ?? "Payment confirmation failed");
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      alert(err?.message ?? "Payment failed");
    }
  }

  function handleOpenLivePreview() {
    if (!templateSlug) return;
    const payload = encodeURIComponent(JSON.stringify(fields));
    window.open(
      `/templates/${templateSlug}?preview=${payload}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  // Render a beautiful template selection screen if no template is selected
  if (!templateSlug) {
    return (
      <div style={{ maxWidth: 960, margin: "40px auto", padding: "0 24px" }}>
        <div style={{
          textAlign: "center",
          marginBottom: 48,
          background: "linear-gradient(135deg, rgba(255,199,154,0.18), rgba(255,255,255,0.96))",
          padding: "48px 32px",
          borderRadius: 32,
          border: "1px solid rgba(188,83,91,0.12)",
          boxShadow: "0 20px 45px rgba(205, 90, 107, 0.05)"
        }}>
          <span style={{
            textTransform: "uppercase",
            letterSpacing: 2,
            fontSize: 12,
            fontWeight: 700,
            color: "var(--accent)",
            display: "inline-block",
            marginBottom: 12
          }}>
            Creative Studio
          </span>
          <h2 style={{ fontSize: "2.4rem", color: "var(--text)", margin: "0 0 16px", fontWeight: 700 }}>
            Choose a Template to Customize
          </h2>
          <p style={{ color: "var(--muted)", maxWidth: 640, margin: "0 auto", fontSize: "1.1rem", lineHeight: 1.6 }}>
            Select one of our premium, config-driven mobile-first templates to build your personalized microsite.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 32 }}>
          {siteData.templates.map((template) => (
            <div
              key={template.slug}
              className="template-card"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                padding: 32,
                borderRadius: 28,
                border: "1px solid var(--line)",
                background: "var(--surface)",
                cursor: "pointer",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                boxShadow: "0 10px 30px rgba(0,0,0,0.03)"
              }}
              onClick={() => {
                setTemplateSlug(template.slug);
                window.history.pushState({}, "", `/editor?template=${template.slug}`);
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 20px 40px rgba(188,83,91,0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.03)";
              }}
            >
              <div>
                <span style={{
                  padding: "6px 12px",
                  borderRadius: 999,
                  background: "rgba(188,83,91,0.08)",
                  color: "var(--accent)",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}>
                  {template.category}
                </span>
                <h3 style={{ marginTop: 20, marginBottom: 8, fontSize: "1.42rem", color: "var(--text)", fontWeight: 700 }}>{template.title}</h3>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.55 }}>{template.summary}</p>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginTop: 32,
                paddingTop: 20,
                borderTop: "1px solid var(--line)"
              }}>
                <span style={{ fontWeight: 600, color: "var(--text)", fontSize: "1.05rem" }}>{template.price}</span>
                <button className="primary-btn" style={{ padding: "8px 20px", fontSize: "0.9rem" }}>
                  Customize
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="editor" style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px 48px" }}>
      {/* Premium Header with Switcher */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
        marginBottom: 32,
        padding: "24px 32px",
        borderRadius: 28,
        background: "linear-gradient(135deg, rgba(255,199,154,0.18), rgba(255,255,255,0.94))",
        border: "1px solid rgba(188,83,91,0.08)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.02)"
      }}>
        <div>
          <p style={{ margin: 0, textTransform: "uppercase", letterSpacing: 2, fontSize: 11, color: "var(--accent)", fontWeight: 700 }}>
            Page Editor
          </p>
          <h2 style={{ margin: "4px 0 4px", fontSize: "1.85rem", fontWeight: 700, color: "var(--text)" }}>
            Editing {templateMeta?.title}
          </h2>
          <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.95rem" }}>
            {templateMeta?.summary}
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span style={{ fontSize: "0.92rem", color: "var(--muted)", fontWeight: 500 }}>Switch Template:</span>
          <select
            value={templateSlug || ""}
            onChange={(e) => {
              const s = e.target.value;
              setTemplateSlug(s);
              window.history.pushState({}, "", `/editor?template=${s}`);
            }}
            style={{
              padding: "10px 18px",
              borderRadius: 14,
              border: "1px solid var(--line)",
              background: "white",
              color: "var(--text)",
              fontWeight: 600,
              fontSize: "0.92rem",
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
              outline: "none"
            }}
          >
            {siteData.templates.map(t => (
              <option key={t.slug} value={t.slug}>{t.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="editor-container">
        {/* Editor Sidebar */}
        <div className="editor-sidebar" style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          {isBirthday1Locked && (
            <div style={{
              background: "linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(220, 38, 38, 0.03))",
              border: "1px solid rgba(220, 38, 38, 0.2)",
              padding: "16px 20px",
              borderRadius: 20,
              display: "flex",
              flexDirection: "column",
              gap: 8,
              boxShadow: "0 10px 25px rgba(220, 38, 38, 0.03)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "1.2rem" }}>🔒</span>
                <strong style={{ color: "var(--accent)", fontSize: "0.95rem" }}>Template Locked</strong>
              </div>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.5 }}>
                Birthday Template 1 has already been claimed and locked. To prevent accidental edits, modifications to its fields are disabled. You can view the claimed URL and QR code below.
              </p>
            </div>
          )}

          <h3 style={{ margin: 0, color: "var(--accent)", fontSize: "1.35rem", fontWeight: 700 }}>
            Template Fields
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {(templateDef?.fields ?? []).map((f: any) => (
              <div key={f.key} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <span style={{ fontSize: "0.92rem", fontWeight: 600, color: "var(--text)" }}>
                  {f.label || f.key}
                </span>

                {f.type === "textarea" ? (
                  <textarea
                    value={fields[f.key] ?? ""}
                    disabled={isBirthday1Locked}
                    onChange={(e) =>
                      setFields((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                    rows={5}
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 14,
                      border: "1px solid var(--line)",
                      background: isBirthday1Locked ? "#f7f7f7" : "white",
                      cursor: isBirthday1Locked ? "not-allowed" : "text",
                      fontSize: "0.95rem",
                      lineHeight: 1.5,
                      color: isBirthday1Locked ? "#888" : "var(--text)",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                ) : f.type === "audio" ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    <input
                      type="file"
                      accept="audio/*"
                      disabled={isBirthday1Locked}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setUploadingField(f.key);
                          const url = await uploadFile(file);
                          setFields((s) => ({ ...s, [f.key]: url }));
                        } catch (error) {
                          alert(
                            error instanceof Error
                              ? error.message
                              : "Audio upload failed",
                          );
                        } finally {
                          setUploadingField(null);
                        }
                      }}
                      style={{ fontSize: "0.85rem", cursor: isBirthday1Locked ? "not-allowed" : "pointer" }}
                    />
                    <input
                      value={fields[f.key] ?? ""}
                      placeholder="Or paste an audio URL"
                      disabled={isBirthday1Locked}
                      onChange={(e) =>
                        setFields((s) => ({ ...s, [f.key]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1px solid var(--line)",
                        background: isBirthday1Locked ? "#f7f7f7" : "white",
                        cursor: isBirthday1Locked ? "not-allowed" : "text",
                        fontSize: "0.92rem",
                        color: isBirthday1Locked ? "#888" : "var(--text)",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    {uploadingField === f.key && (
                      <span style={{ fontSize: "0.85rem", color: "var(--accent)" }}>Uploading audio file...</span>
                    )}
                    {fields[f.key] && (
                      <audio controls style={{ width: "100%", marginTop: 4 }}>
                        <source src={fields[f.key]} />
                      </audio>
                    )}
                  </div>
                ) : f.type === "gallery" ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      disabled={isBirthday1Locked}
                      onChange={async (e) => {
                        const files = Array.from(e.target.files ?? []);
                        if (files.length === 0) return;
                        try {
                          setUploadingField(f.key);
                          const uploaded = await Promise.all(
                            files.map((file) => uploadFile(file)),
                          );
                          setFields((s) => ({
                            ...s,
                            [f.key]: [...splitPhotos(s[f.key]), ...uploaded],
                          }));
                        } catch (error) {
                          alert(
                            error instanceof Error
                              ? error.message
                              : "Gallery upload failed",
                          );
                        } finally {
                          setUploadingField(null);
                        }
                      }}
                      style={{ fontSize: "0.85rem", cursor: isBirthday1Locked ? "not-allowed" : "pointer" }}
                    />
                    <textarea
                      value={splitPhotos(fields[f.key]).join("\n")}
                      placeholder="One image URL per line"
                      rows={4}
                      disabled={isBirthday1Locked}
                      onChange={(e) =>
                        setFields((s) => ({
                          ...s,
                          [f.key]: e.target.value
                            .split("\n")
                            .map((item) => item.trim())
                            .filter(Boolean),
                        }))
                      }
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1px solid var(--line)",
                        background: isBirthday1Locked ? "#f7f7f7" : "white",
                        cursor: isBirthday1Locked ? "not-allowed" : "text",
                        fontSize: "0.92rem",
                        color: isBirthday1Locked ? "#888" : "var(--text)",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    {uploadingField === f.key && (
                      <span style={{ fontSize: "0.85rem", color: "var(--accent)" }}>Uploading images...</span>
                    )}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(64px, 1fr))",
                        gap: 8,
                        marginTop: 4
                      }}
                    >
                      {splitPhotos(fields[f.key]).map((src: string, idx: number) => (
                        <img
                          key={`${src}-${idx}`}
                          src={src}
                          alt="gallery item"
                          style={{
                            width: "100%",
                            aspectRatio: "1 / 1",
                            objectFit: "cover",
                            borderRadius: 10,
                            border: "1px solid var(--line)"
                          }}
                        />
                      ))}
                    </div>
                  </div>
                ) : f.type === "image" ? (
                  <div style={{ display: "grid", gap: 10 }}>
                    <input
                      type="file"
                      accept="image/*"
                      disabled={isBirthday1Locked}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          setUploadingField(f.key);
                          const url = await uploadFile(file);
                          setFields((s) => ({ ...s, [f.key]: url }));
                        } catch (error) {
                          alert(
                            error instanceof Error
                              ? error.message
                              : "Image upload failed",
                          );
                        } finally {
                          setUploadingField(null);
                        }
                      }}
                      style={{ fontSize: "0.85rem", cursor: isBirthday1Locked ? "not-allowed" : "pointer" }}
                    />
                    <input
                      value={fields[f.key] ?? ""}
                      placeholder="Or paste an image URL"
                      disabled={isBirthday1Locked}
                      onChange={(e) =>
                        setFields((s) => ({ ...s, [f.key]: e.target.value }))
                      }
                      style={{
                        width: "100%",
                        padding: "10px 14px",
                        borderRadius: 12,
                        border: "1px solid var(--line)",
                        background: isBirthday1Locked ? "#f7f7f7" : "white",
                        cursor: isBirthday1Locked ? "not-allowed" : "text",
                        fontSize: "0.92rem",
                        color: isBirthday1Locked ? "#888" : "var(--text)",
                        outline: "none",
                        boxSizing: "border-box"
                      }}
                    />
                    {uploadingField === f.key && (
                      <span style={{ fontSize: "0.85rem", color: "var(--accent)" }}>Uploading image...</span>
                    )}
                    {fields[f.key] && (
                      <img
                        src={fields[f.key]}
                        alt="preview"
                        style={{
                          maxWidth: "100%",
                          maxHeight: 180,
                          borderRadius: 12,
                          objectFit: "cover",
                          marginTop: 4,
                          border: "1px solid var(--line)"
                        }}
                      />
                    )}
                  </div>
                ) : (
                  <input
                    value={fields[f.key] ?? ""}
                    disabled={isBirthday1Locked}
                    onChange={(e) =>
                      setFields((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                    style={{
                      width: "100%",
                      padding: "12px 16px",
                      borderRadius: 14,
                      border: "1px solid var(--line)",
                      background: isBirthday1Locked ? "#f7f7f7" : "white",
                      cursor: isBirthday1Locked ? "not-allowed" : "text",
                      fontSize: "0.95rem",
                      color: isBirthday1Locked ? "#888" : "var(--text)",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Fixed common URL selection field */}
          <div
            style={{
              marginTop: 16,
              paddingTop: 24,
              borderTop: "1px solid var(--line)",
              display: "flex",
              flexDirection: "column",
              gap: 8
            }}
          >
            <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--text)" }}>
              Desired page URL {isUrlLocked ? <span style={{ color: "var(--muted)", fontSize: "0.8rem", fontWeight: 500 }}>(Locked after claiming)</span> : <span style={{ color: "var(--accent)" }}>*</span>}
            </span>
            <input
              value={fields.requested_slug ?? ""}
              placeholder="e.g. my-special-page"
              disabled={isUrlLocked || isBirthday1Locked}
              onChange={(e) =>
                setFields((s) => ({
                  ...s,
                  requested_slug: e.target.value,
                }))
              }
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 14,
                border: "1px solid var(--line)",
                background: (isUrlLocked || isBirthday1Locked) ? "#f7f7f7" : "white",
                cursor: (isUrlLocked || isBirthday1Locked) ? "not-allowed" : "text",
                fontSize: "0.95rem",
                fontWeight: 600,
                color: (isUrlLocked || isBirthday1Locked) ? "#888" : "var(--text)",
                outline: "none",
                boxSizing: "border-box"
              }}
            />
            <p style={{ margin: 0, color: "var(--muted)", fontSize: 11.5, lineHeight: 1.4 }}>
              Your final published link will be built from your account name, this URL path, and the template slug.
            </p>
          </div>

          {pageId && fields.requested_slug && (
            <div
              style={{
                marginTop: 16,
                padding: 20,
                borderRadius: 20,
                border: "1px solid rgba(188,83,91,0.12)",
                background: "rgba(255,255,255,0.7)",
                display: "grid",
                gap: 12
              }}
            >
              <div>
                <strong style={{ display: "block", color: "var(--text)", fontSize: "0.95rem", marginBottom: 4 }}>
                  Claimed QR Code:
                </strong>
                <p style={{ margin: "0 0 12px", color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.4 }}>
                  Scan this QR to view your interactive card on any mobile device (works both for drafts and published pages).
                </p>
                <PageQrCode pageId={pageId} />
              </div>
            </div>
          )}

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button
              className="secondary-btn"
              onClick={handleSave}
              disabled={saving || isBirthday1Locked}
              style={{
                flex: 1,
                padding: "14px 20px",
                borderRadius: 16,
                fontSize: "0.95rem",
                cursor: (saving || isBirthday1Locked) ? "not-allowed" : "pointer",
                opacity: isBirthday1Locked ? 0.6 : 1
              }}
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              className="primary-btn"
              onClick={handlePayAndPublish}
              disabled={isBirthday1Locked}
              style={{
                flex: 1.2,
                padding: "14px 20px",
                borderRadius: 16,
                fontSize: "0.95rem",
                cursor: isBirthday1Locked ? "not-allowed" : "pointer",
                opacity: isBirthday1Locked ? 0.6 : 1
              }}
            >
              {isFreeTemplate ? "Claim for free" : "Pay & Publish"}
            </button>
          </div>

          {publishInfo && (
            <div
              style={{
                marginTop: 16,
                padding: 20,
                borderRadius: 24,
                border: "1px solid rgba(188,83,91,0.15)",
                background: "rgba(255,239,240,0.85)",
                display: "grid",
                gap: 12,
              }}
            >
              <div>
                <strong style={{ display: "block", marginBottom: 4, color: "var(--text)" }}>Published page link:</strong>
                <a
                  href={publishInfo.fullUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    color: "var(--accent)",
                    fontWeight: 600,
                    textDecoration: "underline",
                    wordBreak: "break-all"
                  }}
                >
                  {publishInfo.fullUrl}
                </a>
              </div>
              {publishInfo.qr && (
                <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
                  <strong style={{ color: "var(--text)" }}>QR code:</strong>
                  <img
                    src={publishInfo.qr}
                    alt="QR code for published page"
                    style={{
                      width: 160,
                      height: 160,
                      padding: 10,
                      borderRadius: 18,
                      background: "white",
                      boxShadow: "0 8px 24px rgba(188,83,91,0.08)",
                      border: "1px solid var(--line)"
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Live Preview Panel */}
        <div className="editor-preview-panel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 20,
            }}
          >
            <h3 style={{ margin: 0, color: "var(--accent)", fontSize: "1.35rem", fontWeight: 700 }}>Live Preview</h3>
            <button
              className="primary-btn"
              style={{ padding: "8px 18px", fontSize: "0.85rem", borderRadius: 12 }}
              onClick={handleOpenLivePreview}
              disabled={!templateSlug}
            >
              Open full preview
            </button>
          </div>
          {templateMeta && (
            <TemplatePreview template={templateMeta} values={fields} />
          )}
        </div>
      </div>
    </div>
  );
}

function splitPhotos(value: any): string[] {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string" && value.trim()) {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

export function PageQrCode({ pageId }: { pageId: number }) {
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getPageQR(pageId);
        if (res?.data) {
          setQr(res.data);
        }
      } catch (err) {
        console.error("Error fetching QR code:", err);
      }
    })();
  }, [pageId]);

  if (!qr) {
    return (
      <div style={{ fontSize: "0.85rem", color: "var(--muted)", padding: "12px 0" }}>
        Loading QR Code...
      </div>
    );
  }

  return (
    <img
      src={qr}
      alt="QR Code"
      style={{
        width: 140,
        height: 140,
        borderRadius: 16,
        padding: 8,
        background: "white",
        border: "1px solid var(--line)",
        boxShadow: "0 8px 24px rgba(188,83,91,0.08)",
        display: "block"
      }}
    />
  );
}
