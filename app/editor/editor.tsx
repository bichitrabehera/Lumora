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
} from "@/lib/api";
import { TemplatePreview } from "@/components/microsite-templates";

function readToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

function buildTemplateDefaults(template: any | null, slug: string | null) {
  const defaults: Record<string, any> = {};
  const fields = template?.schema?.fields ?? [];
  const isBirthdayTemplate = template?.slug === "birthday-template-1";

  defaults.requested_slug = "";

  for (const field of fields) {
    if (isBirthdayTemplate) {
      if (field.key === "page_title")
        defaults[field.key] = template?.title ?? "A Grand Birthday Surprise!";
      else if (field.key === "welcome_title")
        defaults[field.key] = template?.summary ?? "You've got a surprise!";
      else if (field.key === "welcome_message")
        defaults[field.key] =
          template?.description ??
          "Click below to start your birthday journey...";
      else if (field.key === "start_button_label")
        defaults[field.key] = "Start the Celebration!";
      else if (field.key === "letter_greeting")
        defaults[field.key] = "Dearest [Name],";
      else if (field.key === "letter_message")
        defaults[field.key] =
          template?.summary ??
          template?.description ??
          "This message carries wishes straight from the heart.";
      else if (field.key === "letter_prompt")
        defaults[field.key] =
          "Click the button to reveal your special birthday surprise!";
      else if (field.key === "unfold_button_label")
        defaults[field.key] = "Unfold My Surprise!";
      else if (field.key === "recipient_name")
        defaults[field.key] = "Sapthesh!";
      else if (field.key === "final_greeting")
        defaults[field.key] = "Happy Birthday,";
      else if (field.key === "final_wish")
        defaults[field.key] =
          template?.description ?? "May your special day be filled with joy.";
      else if (field.key === "signature")
        defaults[field.key] = "With love and best wishes";
      else if (field.key === "music_url")
        defaults[field.key] = template?.assets?.sample_audio ?? "";
      else defaults[field.key] = "";
    } else if (template?.slug === "moonlit-birthday") {
      if (field.key === "title")
        defaults[field.key] = template?.title ?? "My Page";
      else if (field.key === "subtitle")
        defaults[field.key] =
          template?.summary ?? "A moonlit surprise awaits...";
      else if (field.key === "message")
        defaults[field.key] =
          template?.description ??
          "A playful birthday landing page with a reveal moment, photo wall, and handwritten closing note.";
      else if (field.key === "photos") defaults[field.key] = [];
      else if (field.key === "audio_url")
        defaults[field.key] = template?.assets?.sample_audio ?? "";
      else if (field.key === "hero_button_label")
        defaults[field.key] = "Join The Gala";
      else if (field.key === "celebration_heading")
        defaults[field.key] = "The Art of Celebration";
      else if (field.key === "celebration_message")
        defaults[field.key] =
          "Every moment of the past three decades has been a brushstroke on a celestial canvas. We gather to honor the light you bring to our world.";
      else if (field.key === "featured_story_title")
        defaults[field.key] = "Midnight Musings";
      else if (field.key === "featured_story_message")
        defaults[field.key] =
          "Reflecting on the quiet nights that shaped a loud and beautiful spirit.";
      else if (field.key === "secondary_story_title")
        defaults[field.key] = "Celestial Soul";
      else if (field.key === "secondary_story_message")
        defaults[field.key] =
          "A spirit that orbits the hearts of everyone she meets, bringing a unique luminescence.";
      else if (field.key === "milestones_heading")
        defaults[field.key] = "Lunar Milestones";
      else if (field.key === "milestones_intro")
        defaults[field.key] =
          "The phases of growth, mapped across three decades of discovery.";
      else if (field.key === "milestones")
        defaults[field.key] = [
          {
            year: "1994",
            title: "New Moon",
            description: "The beginning of a celestial journey.",
            image: "",
          },
        ];
      else if (field.key === "messages_heading")
        defaults[field.key] = "Starlit Messages";
      else defaults[field.key] = "";
    } else {
      if (field.key === "title")
        defaults[field.key] = template?.title ?? "My Page";
      else if (field.key === "subtitle")
        defaults[field.key] = template?.summary ?? "";
      else if (field.key === "message")
        defaults[field.key] = template?.description ?? "";
      else if (field.key === "photos") defaults[field.key] = [];
      else if (field.key === "audio_url")
        defaults[field.key] = template?.assets?.sample_audio ?? "";
      else if (field.type === "image") defaults[field.key] = "";
      else defaults[field.key] = "";
    }
  }

  if (!fields.length) {
    defaults.title = template?.title ?? "My Page";
    defaults.body = template?.description ?? "Write something lovely...";
    defaults.image_url = "";
  }

  return defaults;
}

export default function Editor({ initial }: { initial?: any }) {
  const [title, setTitle] = useState(initial?.title ?? "My Page");
  const [body, setBody] = useState(
    initial?.body ?? "Write something lovely...",
  );
  const [imageUrl, setImageUrl] = useState<string | null>(
    initial?.imageUrl ?? null,
  );
  const [uploading, setUploading] = useState(false);
  const [templateSlug, setTemplateSlug] = useState<string | null>(null);
  const [pageId, setPageId] = useState<number | null>(initial?.id ?? null);
  const [saving, setSaving] = useState(false);
  const [templateDef, setTemplateDef] = useState<any | null>(null);
  const [templateMeta, setTemplateMeta] = useState<any | null>(null);
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

  useEffect(() => {
    if (!templateSlug) return;
    (async () => {
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
      setFields(buildTemplateDefaults(t, templateSlug));
      setTitle(t?.title ?? "My Page");
      setBody(t?.description ?? "Write something lovely...");
      setImageUrl(null);
    })();
  }, [templateSlug]);

  // field values map
  const [fields, setFields] = useState<Record<string, any>>({
    title,
    body,
    image_url: imageUrl,
    requested_slug: "",
  });

  const previewValues = {
    ...fields,
    title: fields.title ?? title,
    body: fields.body ?? body,
    image_url: fields.image_url ?? imageUrl,
    subtitle: fields.subtitle ?? templateMeta?.summary ?? "",
    message: fields.message ?? fields.body ?? body,
    photos: fields.photos ?? [],
    audio_url: fields.audio_url ?? "",
  };

  useEffect(() => {
    setFields((f) => {
      const next = { ...f };
      if (
        (templateDef?.fields ?? []).some((field: any) => field.key === "title")
      ) {
        next.title = title;
      }
      if (
        (templateDef?.fields ?? []).some((field: any) => field.key === "body")
      ) {
        next.body = body;
      }
      if (
        (templateDef?.fields ?? []).some(
          (field: any) => field.key === "image_url",
        )
      ) {
        next.image_url = imageUrl;
      }
      return next;
    });
  }, [title, body, imageUrl, templateDef?.fields]);

  useEffect(() => {
    if (!templateMeta) return;
    setFields((current) => {
      const next = { ...current };
      for (const field of templateDef?.fields ?? []) {
        if (
          next[field.key] !== undefined &&
          next[field.key] !== null &&
          next[field.key] !== ""
        ) {
          continue;
        }
        if (field.key === "title")
          next[field.key] = templateMeta.title ?? title;
        else if (field.key === "subtitle")
          next[field.key] = templateMeta.summary ?? "";
        else if (field.key === "message")
          next[field.key] = templateMeta.description ?? body;
        else if (field.key === "photos") next[field.key] = [];
        else if (field.key === "audio_url")
          next[field.key] = templateMeta.assets?.sample_audio ?? "";
        else if (field.key === "hero_button_label")
          next[field.key] = "Join The Gala";
        else if (field.key === "celebration_heading")
          next[field.key] = "The Art of Celebration";
        else if (field.key === "celebration_message")
          next[field.key] =
            "Every moment of the past three decades has been a brushstroke on a celestial canvas. We gather to honor the light you bring to our world.";
        else if (field.key === "featured_story_title")
          next[field.key] = "Midnight Musings";
        else if (field.key === "featured_story_message")
          next[field.key] =
            "Reflecting on the quiet nights that shaped a loud and beautiful spirit.";
        else if (field.key === "secondary_story_title")
          next[field.key] = "Celestial Soul";
        else if (field.key === "secondary_story_message")
          next[field.key] =
            "A spirit that orbits the hearts of everyone she meets, bringing a unique luminescence.";
        else if (field.key === "milestones_heading")
          next[field.key] = "Lunar Milestones";
        else if (field.key === "milestones_intro")
          next[field.key] =
            "The phases of growth, mapped across three decades of discovery.";
        else if (field.key === "milestones")
          next[field.key] = [
            {
              year: "1994",
              title: "New Moon",
              description: "The beginning of a celestial journey.",
              image: "",
            },
          ];
        else if (field.key === "messages_heading")
          next[field.key] = "Starlit Messages";
        else next[field.key] = "";
      }
      return next;
    });
  }, [body, templateDef?.fields, templateMeta, templateSlug, title]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (autosaveRef.current) window.clearTimeout(autosaveRef.current);
    autosaveRef.current = window.setTimeout(() => {
      handleAutoSave();
    }, 1500) as unknown as number;
    return () => {
      if (autosaveRef.current) window.clearTimeout(autosaveRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields, templateSlug]);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const sig = await getUploadSignature();
    if (!sig) {
      alert("Upload not configured on backend");
      setUploading(false);
      return;
    }

    const form = new FormData();
    form.append("file", file);
    form.append("api_key", sig.api_key);
    form.append("timestamp", String(sig.timestamp));
    form.append("signature", sig.signature);

    const cloudUrl = `https://api.cloudinary.com/v1_1/${sig.cloud_name}/auto/upload`;
    try {
      const res = await fetch(cloudUrl, { method: "POST", body: form });
      const data = await res.json();
      if (data.secure_url) {
        setImageUrl(data.secure_url);
        setFields((s) => ({ ...s, image_url: data.secure_url }));
      } else alert("Upload failed");
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  }

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

  async function handleAutoSave() {
    try {
      setSaving(true);
      const token = readToken();
      const payload: any = {
        title: fields.title ?? title,
        body: fields.body ?? body,
        image_url: fields.image_url ?? imageUrl ?? undefined,
        template_slug: templateSlug ?? undefined,
        requested_slug: String(fields.requested_slug ?? "").trim() || undefined,
        field_values: fields,
        is_draft: true,
      };
      const res = await saveDraft(pageId, payload, token ?? undefined);
      if (res?.page?.id) setPageId(res.page.id);
      return res;
    } catch (err) {
      // ignore autosave errors for now
    } finally {
      setSaving(false);
    }
    return null;
  }

  async function handleSave() {
    try {
      await handleAutoSave();
      alert("Saved");
    } catch (err: any) {
      alert(err?.message ?? "Save failed");
    }
  }

  async function handlePublish() {
    try {
      const token = readToken();
      const draft = await handleAutoSave();
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
      const draft = await handleAutoSave();
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
    const payload = encodeURIComponent(JSON.stringify(previewValues));
    window.open(
      `/templates/${templateSlug}?preview=${payload}`,
      "_blank",
      "noopener,noreferrer",
    );
  }

  return (
    <div className="editor">
      <div className="editor-container">
        <div className="editor-sidebar">
          <h3 style={{ margin: "0 0 20px 0", color: "var(--accent)" }}>Fields</h3>
          {(
            templateDef?.fields ?? [
              { key: "title", type: "text", label: "Title" },
              { key: "body", type: "textarea", label: "Body" },
              { key: "image_url", type: "image", label: "Hero image" },
            ]
          ).map((f: any) => (
            <div key={f.key} className="field" style={{ marginBottom: 18 }}>
              <span>{f.label || f.key}</span>
              {f.type === "textarea" ? (
                <textarea
                  value={fields[f.key] ?? ""}
                  onChange={(e) =>
                    setFields((s) => ({ ...s, [f.key]: e.target.value }))
                  }
                  rows={6}
                />
              ) : f.type === "audio" ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      try {
                        const url = await uploadFile(file);
                        setFields((s) => ({ ...s, [f.key]: url }));
                      } catch (error) {
                        alert(
                          error instanceof Error
                            ? error.message
                            : "Audio upload failed",
                        );
                      }
                    }}
                  />
                  <input
                    value={fields[f.key] ?? ""}
                    placeholder="Or paste an audio URL"
                    onChange={(e) =>
                      setFields((s) => ({ ...s, [f.key]: e.target.value }))
                    }
                  />
                  {fields[f.key] && (
                    <audio controls style={{ width: "100%" }}>
                      <source src={fields[f.key]} />
                    </audio>
                  )}
                </div>
              ) : f.type === "gallery" ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={async (e) => {
                      const files = Array.from(e.target.files ?? []);
                      if (files.length === 0) return;
                      try {
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
                      }
                    }}
                  />
                  <textarea
                    value={splitPhotos(fields[f.key]).join("\n")}
                    placeholder="One image URL per line"
                    rows={4}
                    onChange={(e) =>
                      setFields((s) => ({
                        ...s,
                        [f.key]: e.target.value
                          .split("\n")
                          .map((item) => item.trim())
                          .filter(Boolean),
                      }))
                    }
                  />
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(72px, 1fr))",
                      gap: 8,
                    }}
                  >
                    {splitPhotos(fields[f.key]).map((src: string) => (
                      <img
                        key={src}
                        src={src}
                        alt="gallery preview"
                        style={{
                          width: "100%",
                          aspectRatio: "1 / 1",
                          objectFit: "cover",
                          borderRadius: 12,
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : f.type === "list" ? (
                <div style={{ display: "grid", gap: 8 }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--muted)" }}>{f.label || f.key}</span>
                    <button
                      className="secondary-btn"
                      style={{ padding: "6px 14px", fontSize: "0.85rem" }}
                      onClick={() =>
                        setFields((s) => ({
                          ...s,
                          [f.key]: [
                            ...(Array.isArray(s[f.key]) ? s[f.key] : []),
                            { year: "", title: "", description: "", image: "" },
                          ],
                        }))
                      }
                    >
                      Add milestone
                    </button>
                  </div>
                  {(Array.isArray(fields[f.key]) ? fields[f.key] : []).map(
                    (item: any, idx: number) => (
                      <div
                        key={idx}
                        style={{
                          border: "1px solid #eee",
                          padding: 8,
                          borderRadius: 8,
                        }}
                      >
                        {(f.itemFields ?? []).map((ifield: any) => (
                          <div key={ifield.key} style={{ marginBottom: 8 }}>
                            <label>{ifield.label || ifield.key}</label>
                            {ifield.type === "textarea" ? (
                              <textarea
                                value={item[ifield.key] ?? ""}
                                rows={3}
                                onChange={(e) =>
                                  setFields((s) => {
                                    const arr = Array.isArray(s[f.key])
                                      ? [...s[f.key]]
                                      : [];
                                    arr[idx] = {
                                      ...(arr[idx] ?? {}),
                                      [ifield.key]: e.target.value,
                                    };
                                    return { ...s, [f.key]: arr };
                                  })
                                }
                              />
                            ) : ifield.type === "image" ? (
                              <div style={{ display: "grid", gap: 8 }}>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    try {
                                      const url = await uploadFile(file);
                                      setFields((s) => {
                                        const arr = Array.isArray(s[f.key])
                                          ? [...s[f.key]]
                                          : [];
                                        arr[idx] = {
                                          ...(arr[idx] ?? {}),
                                          [ifield.key]: url,
                                        };
                                        return { ...s, [f.key]: arr };
                                      });
                                    } catch (err) {
                                      alert("Image upload failed");
                                    }
                                  }}
                                />
                                {item[ifield.key] && (
                                  <img
                                    src={item[ifield.key]}
                                    alt="milestone"
                                    style={{ width: 120, borderRadius: 8 }}
                                  />
                                )}
                              </div>
                            ) : (
                              <input
                                value={item[ifield.key] ?? ""}
                                onChange={(e) =>
                                  setFields((s) => {
                                    const arr = Array.isArray(s[f.key])
                                      ? [...s[f.key]]
                                      : [];
                                    arr[idx] = {
                                      ...(arr[idx] ?? {}),
                                      [ifield.key]: e.target.value,
                                    };
                                    return { ...s, [f.key]: arr };
                                  })
                                }
                              />
                            )}
                          </div>
                        ))}
                        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                          <button
                            className="ghost-btn"
                            style={{ padding: "6px 12px", fontSize: "0.8rem", color: "var(--accent)", borderColor: "var(--line)" }}
                            onClick={() =>
                              setFields((s) => {
                                const arr = Array.isArray(s[f.key])
                                  ? [...s[f.key]]
                                  : [];
                                arr.splice(idx, 1);
                                return { ...s, [f.key]: arr };
                              })
                            }
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              ) : f.type === "image" ? (
                <>
                  <input type="file" accept="image/*" onChange={handleFile} />
                  {uploading && <div>Uploading...</div>}
                  {fields.image_url && (
                    <div>
                      <img
                        src={fields.image_url}
                        alt="uploaded"
                        style={{ maxWidth: "100%" }}
                      />
                    </div>
                  )}
                </>
              ) : (
                <input
                  value={fields[f.key] ?? ""}
                  onChange={(e) =>
                    setFields((s) => ({ ...s, [f.key]: e.target.value }))
                  }
                />
              )}
            </div>
          ))}

          <div className="field" style={{ marginBottom: 18 }}>
            <span>Desired page URL</span>
            <input
              value={fields.requested_slug ?? ""}
              placeholder="my-special-page"
              onChange={(e) =>
                setFields((s) => ({
                  ...s,
                  requested_slug: e.target.value,
                }))
              }
            />
            <p style={{ margin: "8px 0 0", color: "#666", fontSize: 12 }}>
              Your final URL will be built from your account name, this URL, and
              the template slug.
            </p>
          </div>

          <div style={{ marginTop: 18, display: "flex", gap: 12 }}>
            <button className="secondary-btn" onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="primary-btn" onClick={handlePayAndPublish}>
              {isFreeTemplate ? "Claim for free" : "Pay & Publish"}
            </button>
          </div>

          {publishInfo && (
            <div
              style={{
                marginTop: 16,
                padding: 16,
                borderRadius: 20,
                border: "1px solid rgba(188,83,91,0.18)",
                background: "rgba(255,239,240,0.9)",
                display: "grid",
                gap: 12,
              }}
            >
              <div>
                <strong>Published page</strong>
                <div style={{ marginTop: 6, wordBreak: "break-all" }}>
                  {publishInfo.fullUrl}
                </div>
              </div>
              {publishInfo.qr && (
                <div style={{ display: "grid", gap: 8, justifyItems: "start" }}>
                  <strong>QR code</strong>
                  <img
                    src={publishInfo.qr}
                    alt="QR code for published page"
                    style={{
                      width: 180,
                      height: 180,
                      padding: 12,
                      borderRadius: 20,
                      background: "white",
                      boxShadow: "0 12px 30px rgba(188,83,91,0.12)",
                    }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="editor-preview-panel">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 16,
            }}
          >
            <h3 style={{ margin: 0, color: "var(--accent)" }}>Live Preview</h3>
            <button className="primary-btn" style={{ padding: "8px 16px", fontSize: "0.85rem" }} onClick={handleOpenLivePreview} disabled={!templateSlug}>
              Open live preview in new tab
            </button>
          </div>
          {templateMeta && (
            <TemplatePreview template={templateMeta} values={previewValues} />
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
