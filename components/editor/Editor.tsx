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
import { useToast } from "@/components/ui/Toast";

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
  const { addToast } = useToast();
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
    } catch {
      // ignore
    }
    isMounted.current = true;
  }, []);

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
      addToast("Draft saved successfully!", "success");
    } catch (err: any) {
      addToast(err?.message ?? "Save failed", "error");
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
      addToast(err?.message ?? "Publish failed", "error");
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

      const priceRaw = templateMeta?.price ?? "";
      const digits = String(priceRaw).replace(/[^0-9]/g, "");
      const amount = parseInt(digits || "0", 10);
      if (!amount || amount <= 0) {
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
            const pub = await publishPage(effectivePageId, token ?? undefined);
            const fullUrl = `${window.location.origin}/p/${pub.page.slug}`;
            const qr = await getPageQR(pub.page.id);
            setPublishInfo({
              fullUrl,
              qr: qr?.data ?? null,
              slug: pub.page.slug,
            });
          } catch (err: any) {
            addToast(err?.message ?? "Payment confirmation failed", "error");
          }
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (err: any) {
      addToast(err?.message ?? "Payment failed", "error");
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

  const fieldInputBase = "w-full px-4 py-3 rounded-md border border-border outline-none box-border text-base transition-all duration-200";
  const fieldInputActive = "bg-white text-foreground cursor-text";
  const fieldInputDisabled = "bg-gray-100 text-gray-400 cursor-not-allowed";
  function fieldStyle(locked: boolean) {
    return `${fieldInputBase} ${locked ? fieldInputDisabled : fieldInputActive}`;
  }

  if (!templateSlug) {
    return (
      <div className="max-w-7xl mx-auto my-10 px-4 md:px-6 lg:px-8">
        <div className="text-center mb-12 bg-background p-12 px-8 rounded-md border border-border">
          <span className="uppercase tracking-wider text-xs font-medium text-muted inline-block mb-3">
            Creative Studio
          </span>
          <h2 className="text-4xl md:text-5xl font-heading font-medium text-heading m-0 mb-4">
            Choose a Template to Customize
          </h2>
          <p className="text-muted max-w-xl mx-auto text-base leading-relaxed">
            Select one of our premium, config-driven mobile-first templates to build your personalized microsite.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {siteData.templates.map((template) => (
            <div
              key={template.slug}
              className="flex flex-col justify-between p-6 rounded-md border border-border bg-white cursor-pointer transition-all duration-200"
              onClick={() => {
                setTemplateSlug(template.slug);
                window.history.pushState({}, "", `/editor?template=${template.slug}`);
              }}
            >
              <div>
                <span className="px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                  {template.category}
                </span>
                <h3 className="mt-5 mb-2 text-xl font-heading font-medium text-heading">{template.title}</h3>
                <p className="text-muted text-sm leading-relaxed">{template.summary}</p>
              </div>
              <div className="flex justify-between items-center mt-8 pt-5 border-t border-border">
                <span className="font-medium text-heading text-base">{template.price}</span>
                <button className="px-5 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-[#A64850] transition-all duration-200">
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
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-12">
      <div className="flex justify-between items-center gap-5 flex-wrap mb-8 p-6 rounded-md border border-border bg-white">
        <div>
          <p className="m-0 uppercase tracking-wider text-xs text-muted font-medium">
            Page Editor
          </p>
          <h2 className="m-1 mb-1 text-2xl font-heading font-medium text-heading">
            Editing {templateMeta?.title}
          </h2>
          <p className="m-0 text-muted text-sm">
            {templateMeta?.summary}
          </p>
        </div>
        <div className="flex gap-3 items-center">
          <span className="text-sm text-muted font-medium">Switch Template:</span>
          <select
            value={templateSlug || ""}
            onChange={(e) => {
              const s = e.target.value;
              setTemplateSlug(s);
              window.history.pushState({}, "", `/editor?template=${s}`);
            }}
            className="px-4 h-11 rounded-md border border-border bg-white text-body font-medium text-sm cursor-pointer outline-none"
          >
            {siteData.templates.map(t => (
              <option key={t.slug} value={t.slug}>{t.title}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="editor-container flex justify-between gap-8">
        <div className="editor-sidebar flex flex-col gap-6 w-full ">
          {isBirthday1Locked && (
            <div className="bg-error-bg border border-error-text/20 p-5 rounded-md flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className="text-lg">🔒</span>
                <strong className="text-error-text text-sm">Template Locked</strong>
              </div>
              <p className="m-0 text-muted text-sm leading-relaxed">
                Birthday Template 1 has already been claimed and locked. To prevent accidental edits, modifications to its fields are disabled. You can view the claimed URL and QR code below.
              </p>
            </div>
          )}

          <h3 className="m-0 text-heading text-xl font-heading font-medium">
            Template Fields
          </h3>

          <div className="flex flex-col gap-5">
            {(templateDef?.fields ?? []).map((f: any) => (
              <div key={f.key} className="flex flex-col gap-2">
                <span className="text-sm font-medium text-heading">
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
                    className={`${fieldStyle(isBirthday1Locked)} resize-y min-h-[100px]`}
                  />
                ) : f.type === "audio" ? (
                  <div className="grid gap-2.5">
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
                          addToast(
                            error instanceof Error
                              ? error.message
                              : "Audio upload failed",
                            "error",
                          );
                        } finally {
                          setUploadingField(null);
                        }
                      }}
                    className="text-sm"
                  />
                  <input
                    value={fields[f.key] ?? ""}
                    placeholder="Or paste an audio URL"
                    disabled={isBirthday1Locked}
                    onChange={(e) =>
                      setFields((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                    className={fieldStyle(isBirthday1Locked)}
                  />
                  {uploadingField === f.key && (
                    <span className="text-sm text-primary">Uploading audio file...</span>
                  )}
                    {fields[f.key] && (
                      <audio controls className="w-full mt-1">
                        <source src={fields[f.key]} />
                      </audio>
                    )}
                  </div>
                ) : f.type === "gallery" ? (
                  <div className="grid gap-2.5">
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
                          addToast(
                            error instanceof Error
                              ? error.message
                              : "Gallery upload failed",
                            "error",
                          );
                        } finally {
                          setUploadingField(null);
                        }
                      }}
                    className="text-sm"
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
                    className={fieldStyle(isBirthday1Locked)}
                  />
                  {uploadingField === f.key && (
                    <span className="text-sm text-primary">Uploading images...</span>
                  )}
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(64px,1fr))] gap-2 mt-1">
                    {splitPhotos(fields[f.key]).map((src: string, idx: number) => (
                      <img
                        key={`${src}-${idx}`}
                        src={src}
                        alt="gallery item"
                        className="w-full aspect-square object-cover rounded-md border border-border"
                      />
                    ))}
                  </div>
                  </div>
                ) : f.type === "image" ? (
                  <div className="grid gap-2.5">
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
                          addToast(
                            error instanceof Error
                              ? error.message
                              : "Image upload failed",
                            "error",
                          );
                        } finally {
                          setUploadingField(null);
                        }
                      }}
                    className="text-sm"
                  />
                  <input
                    value={fields[f.key] ?? ""}
                    placeholder="Or paste an image URL"
                    disabled={isBirthday1Locked}
                    onChange={(e) =>
                      setFields((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                    className={fieldStyle(isBirthday1Locked)}
                  />
                  {uploadingField === f.key && (
                    <span className="text-sm text-primary">Uploading image...</span>
                  )}
                  {fields[f.key] && (
                    <img
                      src={fields[f.key]}
                      alt="preview"
                      className="max-w-full max-h-[180px] rounded-md object-cover mt-1 border border-border"
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
                    className={fieldStyle(isBirthday1Locked)}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 pt-6 border-t border-border flex flex-col gap-2">
            <span className="text-base font-medium text-heading">
              Desired page URL {isUrlLocked ? <span className="text-muted text-xs font-medium">(Locked after claiming)</span> : <span className="text-primary">*</span>}
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
              className={`${fieldInputBase} ${(isUrlLocked || isBirthday1Locked) ? "bg-gray-100 text-gray-400 cursor-not-allowed" : "bg-white text-body cursor-text"} font-medium`}
            />
            <p className="m-0 text-muted text-xs leading-relaxed">
              Your final published link will be built from your account name, this URL path, and the template slug.
            </p>
          </div>

          {pageId && fields.requested_slug && (
            <div className="mt-4 p-5 rounded-md border border-border bg-white grid gap-3">
              <div>
                <strong className="block text-heading text-base mb-1">
                  Claimed QR Code:
                </strong>
                <p className="m-0 mb-3 text-muted text-sm leading-relaxed">
                  Scan this QR to view your interactive card on any mobile device (works both for drafts and published pages).
                </p>
                <PageQrCode pageId={pageId} />
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-4">
            <button
              className="flex-1 px-5 py-3.5 rounded-md bg-white border border-border text-heading text-sm font-medium hover:bg-background transition-all duration-200"
              onClick={handleSave}
              disabled={saving || isBirthday1Locked}
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>
            <button
              className="flex-[1.2] px-5 py-3.5 rounded-md bg-primary text-white text-sm font-medium hover:bg-[#A64850] transition-all duration-200"
              onClick={handlePayAndPublish}
              disabled={isBirthday1Locked}
            >
              {isFreeTemplate ? "Claim for free" : "Pay & Publish"}
            </button>
          </div>

          {publishInfo && (
            <div className="mt-4 p-5 rounded-md border border-border bg-white grid gap-3">
              <div>
                <strong className="block mb-1 text-heading">Published page link:</strong>
                <a
                  href={publishInfo.fullUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary font-medium underline break-all"
                >
                  {publishInfo.fullUrl}
                </a>
              </div>
              {publishInfo.qr && (
                <div className="grid gap-2 justify-items-start">
                  <strong className="text-heading">QR code:</strong>
                  <img
                    src={publishInfo.qr}
                    alt="QR code for published page"
                    className="w-40 h-40 p-2.5 rounded-md bg-white border border-border"
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="editor-preview-panel w-full ">
          <div className="flex items-center justify-between gap-3 flex-wrap mb-5">
            <h3 className="m-0 text-heading text-xl font-heading font-medium">Live Preview</h3>
            <button
              className="px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-[#A64850] transition-all duration-200"
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
      <div className="text-sm text-muted py-3">
        Loading QR Code...
      </div>
    );
  }

  return (
    <img
      src={qr}
      alt="QR Code"
      className="w-[140px] h-[140px] rounded-md p-2 bg-white border border-border block"
    />
  );
}
