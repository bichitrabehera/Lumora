"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Template } from "@/lib/site-data";

const IMG_PLACEHOLDER =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 360 140'>" +
      "<rect width='100%' height='100%' fill='%23f3f3f3'/>" +
      "<text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='16'>Photo</text>" +
      "</svg>",
  );

function handleImgError(e: React.SyntheticEvent<HTMLImageElement, Event>) {
  const el = e.currentTarget;
  if (el.src && !el.dataset.fallback) {
    el.dataset.fallback = "1";
    el.src = IMG_PLACEHOLDER;
  }
}

type FieldValues = Record<string, any>;

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

function SectionShell({
  template,
  values,
  accent,
}: {
  template: Template;
  values: FieldValues;
  accent: string;
}) {
  const [revealed, setRevealed] = useState(template.slug !== "soft-apology");
  const title = values.title || template.title;
  const subtitle = values.subtitle || template.summary;
  const message = values.message || template.description;
  const photos = splitPhotos(values.photos);
  const audioUrl = values.audio_url;
  const ctaLabel = values.cta_label || "Open message";
  const ctaUrl = values.cta_url || "#";

  return (
    <article
      style={{
        maxWidth: 720,
        margin: "0 auto",
        borderRadius: 32,
        padding: 20,
        background:
          "linear-gradient(180deg, rgba(255,255,255,0.95), rgba(246,242,235,0.96))",
        boxShadow: "0 24px 80px rgba(0,0,0,0.12)",
        border: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          alignItems: "flex-start",
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
              color: "#666",
            }}
          >
            {template.category}
          </p>
          <h1
            style={{
              margin: "12px 0 8px",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              lineHeight: 0.96,
            }}
          >
            {title}
          </h1>
          <p style={{ margin: 0, maxWidth: 520, fontSize: 18, color: "#444" }}>
            {subtitle}
          </p>
        </div>
        <div
          style={{
            minWidth: 64,
            height: 64,
            borderRadius: 20,
            background: accent,
            opacity: 0.9,
          }}
        />
      </div>

      <div style={{ marginTop: 22, display: "grid", gap: 16 }}>
        <button
          type="button"
          onClick={() => setRevealed((value) => !value)}
          style={{
            borderRadius: 999,
            border: "none",
            padding: "14px 18px",
            background: "#111",
            color: "white",
            fontWeight: 700,
            width: "fit-content",
          }}
        >
          {revealed ? "Hide note" : "Tap to reveal"}
        </button>

        {revealed && (
          <div style={{ display: "grid", gap: 16 }}>
            <p
              style={{
                margin: 0,
                fontSize: 16,
                lineHeight: 1.7,
                color: "#202020",
              }}
            >
              {message}
            </p>

            {audioUrl && (
              <audio controls style={{ width: "100%" }}>
                <source src={audioUrl} />
              </audio>
            )}

            {photos.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridAutoFlow: "column",
                  gap: 12,
                  overflowX: "auto",
                  paddingBottom: 6,
                }}
              >
                {photos.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt="Memory"
                    loading="lazy"
                    onError={handleImgError}
                    style={{
                      display: "block",
                      width: 180,
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 22,
                      flexShrink: 0,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <a
          href={ctaUrl}
          style={{
            justifySelf: "start",
            display: "inline-flex",
            alignItems: "center",
            padding: "14px 18px",
            borderRadius: 999,
            background: accent,
            color: "#0f172a",
            fontWeight: 800,
            textDecoration: "none",
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

function BirthdayTemplateFrame({
  template,
  values,
}: {
  template: Template;
  values: FieldValues;
}) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  const bundle =
    (template as any).assets?.bundle ??
    "/assets/birthday-template-1/index.html";

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame?.contentWindow) return;
    frame.contentWindow.postMessage(
      {
        type: "lovey:preview:update",
        values,
      },
      window.location.origin,
    );
  }, [values]);

  return (
    <div
      style={{
        width: "100%",
        height: "760px",
        minHeight: "760px",
        background: "white",
        overflow: "hidden",
      }}
    >
      <iframe
        ref={frameRef}
        src={bundle}
        title={template.title}
        onLoad={() => {
          frameRef.current?.contentWindow?.postMessage(
            {
              type: "lovey:preview:update",
              values,
            },
            window.location.origin,
          );
        }}
        style={{
          width: "100%",
          height: "760px",
          minHeight: "760px",
          border: "none",
          display: "block",
        }}
        sandbox="allow-scripts allow-same-origin allow-modals"
      />
    </div>
  );
}

function MoonlitBirthdayTemplate({
  template,
  values,
}: {
  template: Template;
  values: FieldValues;
}) {
  const [open, setOpen] = useState(false);
  const title = values.title || template.title;
  const subtitle = values.subtitle || template.summary;
  const message = values.message || template.description;
  const photos = splitPhotos(values.photos);
  const audioUrl = values.audio_url;
  const ctaLabel = values.cta_label || "Open the surprise";
  const ctaUrl = values.cta_url || "#";

  return (
    <article
      style={{
        minHeight: 760,
        padding: 24,
        color: "#f6fbff",
        background:
          "radial-gradient(circle at top, rgba(145,242,255,0.18), transparent 28%), linear-gradient(180deg, #08101f, #0f1a2d 60%, #13253f)",
      }}
    >
      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          borderRadius: 28,
          padding: 24,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(145,242,255,0.18)",
          boxShadow: "0 30px 90px rgba(0,0,0,0.28)",
          backdropFilter: "blur(18px)",
        }}
      >
        <div
          style={{ display: "flex", justifyContent: "space-between", gap: 16 }}
        >
          <div>
            <div
              style={{
                letterSpacing: 2,
                textTransform: "uppercase",
                fontSize: 12,
                color: "rgba(246,251,255,0.72)",
              }}
            >
              {template.category}
            </div>
            <h1
              style={{
                margin: "12px 0 10px",
                fontSize: "clamp(2.2rem, 6vw, 4.8rem)",
                lineHeight: 0.92,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 520,
                fontSize: 18,
                lineHeight: 1.6,
                color: "rgba(246,251,255,0.82)",
              }}
            >
              {subtitle}
            </p>
          </div>
          <div
            style={{
              minWidth: 78,
              height: 78,
              borderRadius: 999,
              background:
                "radial-gradient(circle at 30% 30%, #fff, #91f2ff 42%, rgba(145,242,255,0.15) 70%)",
              boxShadow: "0 0 40px rgba(145,242,255,0.45)",
            }}
          />
        </div>

        <div
          style={{ marginTop: 18, display: "flex", flexWrap: "wrap", gap: 10 }}
        >
          {template.sections.map((section) => (
            <span
              key={section}
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(145,242,255,0.12)",
                border: "1px solid rgba(145,242,255,0.18)",
                fontSize: 12,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              {section}
            </span>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          style={{
            marginTop: 20,
            border: "none",
            borderRadius: 999,
            padding: "14px 18px",
            fontWeight: 800,
            color: "#08101f",
            background: "linear-gradient(135deg, #91f2ff, #d3fbff)",
          }}
        >
          {open ? "Close the note" : "Open the moonlit note"}
        </button>

        {open && (
          <div style={{ marginTop: 22, display: "grid", gap: 16 }}>
            <p
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.8,
                color: "rgba(246,251,255,0.9)",
              }}
            >
              {message}
            </p>

            {audioUrl && (
              <audio controls style={{ width: "100%" }}>
                <source src={audioUrl} />
              </audio>
            )}

            {photos.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                  gap: 12,
                }}
              >
                {photos.slice(0, 4).map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt="Memory"
                    loading="lazy"
                    onError={handleImgError}
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 18,
                      border: "1px solid rgba(145,242,255,0.16)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <a
          href={ctaUrl}
          style={{
            marginTop: 22,
            display: "inline-flex",
            alignItems: "center",
            padding: "14px 18px",
            borderRadius: 999,
            background: "#91f2ff",
            color: "#08101f",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

function AfterglowAnniversaryTemplate({
  template,
  values,
}: {
  template: Template;
  values: FieldValues;
}) {
  const [timelineOpen, setTimelineOpen] = useState(true);
  const title = values.title || template.title;
  const subtitle = values.subtitle || template.summary;
  const message = values.message || template.description;
  const photos = splitPhotos(values.photos);
  const audioUrl = values.audio_url;
  const ctaLabel = values.cta_label || "Read the promise";
  const ctaUrl = values.cta_url || "#";

  const moments = [
    "First hello",
    "A shared laugh",
    "The long walk home",
    "Every day after",
  ];

  return (
    <article
      style={{
        minHeight: 760,
        padding: 24,
        background: "linear-gradient(180deg, #fff7ef, #fff1e3 48%, #fffdf8)",
        color: "#4a2f23",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          display: "grid",
          gap: 18,
          gridTemplateColumns: "1.1fr 0.9fr",
        }}
      >
        <div
          style={{
            padding: 24,
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(255,207,159,0.36), rgba(255,255,255,0.92))",
            border: "1px solid rgba(164,108,56,0.12)",
            boxShadow: "0 24px 60px rgba(124,83,41,0.12)",
          }}
        >
          <div
            style={{
              letterSpacing: 2,
              textTransform: "uppercase",
              fontSize: 12,
              color: "#a46c38",
            }}
          >
            {template.category}
          </div>
          <h1
            style={{
              margin: "12px 0 10px",
              fontSize: "clamp(2.2rem, 6vw, 4.8rem)",
              lineHeight: 0.95,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 480,
              fontSize: 18,
              lineHeight: 1.65,
              color: "#6d4837",
            }}
          >
            {subtitle}
          </p>

          <button
            type="button"
            onClick={() => setTimelineOpen((value) => !value)}
            style={{
              marginTop: 18,
              border: "none",
              borderRadius: 999,
              padding: "14px 18px",
              background: "#a46c38",
              color: "white",
              fontWeight: 800,
            }}
          >
            {timelineOpen ? "Hide timeline" : "Show timeline"}
          </button>

          {timelineOpen && (
            <div style={{ marginTop: 18, display: "grid", gap: 10 }}>
              {moments.map((moment, index) => (
                <div
                  key={moment}
                  style={{
                    display: "flex",
                    gap: 12,
                    alignItems: "center",
                    padding: 12,
                    borderRadius: 16,
                    background:
                      index % 2 === 0
                        ? "rgba(255,255,255,0.8)"
                        : "rgba(255,250,245,0.95)",
                    border: "1px solid rgba(164,108,56,0.08)",
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      display: "grid",
                      placeItems: "center",
                      background: "#ffcf9f",
                      color: "#6d4837",
                      fontWeight: 800,
                    }}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <strong>{moment}</strong>
                    <div style={{ color: "#81665a", fontSize: 14 }}>
                      A warm note from the story you share together.
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "grid", gap: 18 }}>
          <div
            style={{
              padding: 22,
              borderRadius: 26,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92), rgba(255,249,240,0.98))",
              border: "1px solid rgba(164,108,56,0.1)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
              }}
            >
              <strong>Song dedication</strong>
              <span
                style={{
                  fontSize: 12,
                  letterSpacing: 1.4,
                  textTransform: "uppercase",
                  color: "#a46c38",
                }}
              >
                Polished
              </span>
            </div>
            <p
              style={{
                margin: "10px 0 14px",
                color: "#6d4837",
                lineHeight: 1.6,
              }}
            >
              {message}
            </p>
            {audioUrl && (
              <audio controls style={{ width: "100%" }}>
                <source src={audioUrl} />
              </audio>
            )}
          </div>

          {photos.length > 0 && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                gap: 12,
              }}
            >
              {photos.slice(0, 4).map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="Memory"
                  loading="lazy"
                  onError={handleImgError}
                  style={{
                    width: "100%",
                    height: 160,
                    objectFit: "cover",
                    borderRadius: 20,
                    boxShadow: "0 12px 30px rgba(124,83,41,0.12)",
                  }}
                />
              ))}
            </div>
          )}

          <a
            href={ctaUrl}
            style={{
              display: "inline-flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "14px 18px",
              borderRadius: 999,
              background: "#a46c38",
              color: "white",
              fontWeight: 900,
              textDecoration: "none",
              width: "fit-content",
            }}
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </article>
  );
}

function SoftApologyTemplate({
  template,
  values,
}: {
  template: Template;
  values: FieldValues;
}) {
  const [listening, setListening] = useState(false);
  const title = values.title || template.title;
  const subtitle = values.subtitle || template.summary;
  const message = values.message || template.description;
  const photos = splitPhotos(values.photos);
  const audioUrl = values.audio_url;
  const ctaLabel = values.cta_label || "I understand";
  const ctaUrl = values.cta_url || "#";

  return (
    <article
      style={{
        minHeight: 760,
        padding: 24,
        background: "linear-gradient(180deg, #f7fcfb, #eef7f6 55%, #ffffff)",
        color: "#22423d",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          borderRadius: 30,
          padding: 24,
          background: "rgba(255,255,255,0.88)",
          border: "1px solid rgba(90,140,132,0.12)",
          boxShadow: "0 24px 70px rgba(64,107,101,0.12)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            alignItems: "flex-start",
          }}
        >
          <div>
            <div
              style={{
                letterSpacing: 2,
                textTransform: "uppercase",
                fontSize: 12,
                color: "#5a8c84",
              }}
            >
              {template.category}
            </div>
            <h1
              style={{
                margin: "12px 0 10px",
                fontSize: "clamp(2.2rem, 6vw, 4.6rem)",
                lineHeight: 0.95,
              }}
            >
              {title}
            </h1>
            <p
              style={{
                margin: 0,
                maxWidth: 500,
                fontSize: 18,
                lineHeight: 1.65,
                color: "#4d6763",
              }}
            >
              {subtitle}
            </p>
          </div>
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 22,
              background:
                "radial-gradient(circle at 30% 30%, #d7fff8, #9bd8cc 55%, #5a8c84)",
              boxShadow: "0 0 32px rgba(155,216,204,0.5)",
            }}
          />
        </div>

        <button
          type="button"
          onClick={() => setListening((value) => !value)}
          style={{
            marginTop: 20,
            border: "1px solid rgba(90,140,132,0.2)",
            borderRadius: 999,
            padding: "14px 18px",
            background: listening ? "#9bd8cc" : "#ffffff",
            color: "#22423d",
            fontWeight: 800,
          }}
        >
          {listening ? "Close note" : "Read the apology"}
        </button>

        {listening && (
          <div style={{ marginTop: 18, display: "grid", gap: 14 }}>
            <p
              style={{
                margin: 0,
                fontSize: 17,
                lineHeight: 1.8,
                color: "#35524d",
              }}
            >
              {message}
            </p>
            {audioUrl && (
              <audio controls style={{ width: "100%" }}>
                <source src={audioUrl} />
              </audio>
            )}
            {photos.length > 0 && (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                  gap: 12,
                }}
              >
                {photos.slice(0, 4).map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt="Memory"
                    loading="lazy"
                    onError={handleImgError}
                    style={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      borderRadius: 18,
                      opacity: 0.95,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <a
          href={ctaUrl}
          style={{
            marginTop: 20,
            display: "inline-flex",
            alignItems: "center",
            padding: "14px 18px",
            borderRadius: 999,
            background: "#5a8c84",
            color: "white",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

function WeddingInviteTemplate({
  template,
  values,
}: {
  template: Template;
  values: FieldValues;
}) {
  const [detailsOpen, setDetailsOpen] = useState(true);
  const title = values.title || template.title;
  const subtitle = values.subtitle || template.summary;
  const message = values.message || template.description;
  const photos = splitPhotos(values.photos);
  const audioUrl = values.audio_url;
  const ctaLabel = values.cta_label || "RSVP";
  const ctaUrl = values.cta_url || "#";

  return (
    <article
      style={{
        minHeight: 760,
        padding: 24,
        background: "linear-gradient(180deg, #faf8f2, #efe7da)",
        color: "#2d241f",
      }}
    >
      <div
        style={{
          maxWidth: 760,
          margin: "0 auto",
          borderRadius: 30,
          overflow: "hidden",
          boxShadow: "0 26px 90px rgba(72,53,41,0.16)",
          border: "1px solid rgba(124,98,69,0.08)",
        }}
      >
        <div
          style={{
            padding: 28,
            background: "linear-gradient(135deg, #f7f1e7, #ffffff)",
          }}
        >
          <div
            style={{
              letterSpacing: 2,
              textTransform: "uppercase",
              fontSize: 12,
              color: "#8c7251",
            }}
          >
            {template.category}
          </div>
          <h1
            style={{
              margin: "12px 0 10px",
              fontSize: "clamp(2.2rem, 6vw, 4.8rem)",
              lineHeight: 0.94,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 520,
              fontSize: 18,
              lineHeight: 1.65,
              color: "#5f5144",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div style={{ padding: 24, background: "#ffffff" }}>
          <button
            type="button"
            onClick={() => setDetailsOpen((value) => !value)}
            style={{
              border: "none",
              borderRadius: 999,
              padding: "12px 16px",
              background: "#8c7251",
              color: "white",
              fontWeight: 800,
            }}
          >
            {detailsOpen ? "Hide ceremony details" : "Show ceremony details"}
          </button>

          {detailsOpen && (
            <div
              style={{
                marginTop: 18,
                display: "grid",
                gap: 16,
                gridTemplateColumns: "1fr 1fr",
              }}
            >
              <div
                style={{
                  padding: 18,
                  borderRadius: 20,
                  background: "#faf6ef",
                  border: "1px solid rgba(124,98,69,0.08)",
                }}
              >
                <strong>Ceremony</strong>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#6a5b4f",
                    lineHeight: 1.6,
                  }}
                >
                  {message}
                </p>
              </div>
              <div
                style={{
                  padding: 18,
                  borderRadius: 20,
                  background: "#faf6ef",
                  border: "1px solid rgba(124,98,69,0.08)",
                }}
              >
                <strong>RSVP</strong>
                <p
                  style={{
                    margin: "8px 0 0",
                    color: "#6a5b4f",
                    lineHeight: 1.6,
                  }}
                >
                  Use the button below to open the RSVP or invite link.
                </p>
              </div>
            </div>
          )}

          {audioUrl && (
            <div style={{ marginTop: 18 }}>
              <audio controls style={{ width: "100%" }}>
                <source src={audioUrl} />
              </audio>
            </div>
          )}

          {photos.length > 0 && (
            <div
              style={{
                marginTop: 18,
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr",
                gap: 12,
              }}
            >
              {photos.slice(0, 3).map((src) => (
                <img
                  key={src}
                  src={src}
                  alt="Invitation memory"
                  loading="lazy"
                  onError={handleImgError}
                  style={{
                    width: "100%",
                    height: 190,
                    objectFit: "cover",
                    borderRadius: 18,
                  }}
                />
              ))}
            </div>
          )}

          <a
            href={ctaUrl}
            style={{
              marginTop: 18,
              display: "inline-flex",
              alignItems: "center",
              padding: "14px 18px",
              borderRadius: 999,
              background: "#2d241f",
              color: "white",
              fontWeight: 900,
              textDecoration: "none",
            }}
          >
            {ctaLabel}
          </a>
        </div>
      </div>
    </article>
  );
}

function LoveNoteTemplate({
  template,
  values,
}: {
  template: Template;
  values: FieldValues;
}) {
  const [open, setOpen] = useState(true);
  const title = values.title || template.title;
  const subtitle = values.subtitle || template.summary;
  const message = values.message || template.description;
  const photos = splitPhotos(values.photos);
  const audioUrl = values.audio_url;
  const ctaLabel = values.cta_label || "Send note";
  const ctaUrl = values.cta_url || "#";

  return (
    <article
      style={{
        minHeight: 760,
        padding: 24,
        background: "linear-gradient(180deg, #fffdf8, #f6efe4)",
        color: "#403529",
      }}
    >
      <div
        style={{ maxWidth: 680, margin: "0 auto", display: "grid", gap: 16 }}
      >
        <div
          style={{
            padding: 24,
            borderRadius: 28,
            background: "#fffefb",
            border: "1px solid rgba(80,64,46,0.08)",
            boxShadow: "0 20px 60px rgba(64,53,41,0.12)",
          }}
        >
          <div
            style={{
              letterSpacing: 2,
              textTransform: "uppercase",
              fontSize: 12,
              color: "#8c7a63",
            }}
          >
            {template.category}
          </div>
          <h1
            style={{
              margin: "12px 0 10px",
              fontSize: "clamp(2.2rem, 6vw, 4.5rem)",
              lineHeight: 0.94,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 520,
              fontSize: 18,
              lineHeight: 1.65,
              color: "#6d5f50",
            }}
          >
            {subtitle}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          style={{
            width: "fit-content",
            border: "1px solid rgba(80,64,46,0.12)",
            borderRadius: 999,
            padding: "12px 16px",
            background: open ? "#e9dfcc" : "#fff",
            color: "#403529",
            fontWeight: 800,
          }}
        >
          {open ? "Fold the note" : "Open the note"}
        </button>

        {open && (
          <div
            style={{
              padding: 22,
              borderRadius: 24,
              background: "linear-gradient(180deg, #fffaf2, #fffefb)",
              border: "1px solid rgba(80,64,46,0.08)",
            }}
          >
            <p style={{ margin: 0, fontSize: 17, lineHeight: 1.8 }}>
              {message}
            </p>
            {audioUrl && (
              <div style={{ marginTop: 14 }}>
                <audio controls style={{ width: "100%" }}>
                  <source src={audioUrl} />
                </audio>
              </div>
            )}
            {photos.length > 0 && (
              <div
                style={{
                  marginTop: 16,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: 12,
                }}
              >
                {photos.map((src) => (
                  <img
                    key={src}
                    src={src}
                    alt="Photo strip"
                    loading="lazy"
                    onError={handleImgError}
                    style={{
                      width: "100%",
                      height: 160,
                      objectFit: "cover",
                      borderRadius: 18,
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        <a
          href={ctaUrl}
          style={{
            display: "inline-flex",
            alignItems: "center",
            width: "fit-content",
            padding: "14px 18px",
            borderRadius: 999,
            background: "#403529",
            color: "white",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

function MilestoneStoryTemplate({
  template,
  values,
}: {
  template: Template;
  values: FieldValues;
}) {
  const [focus, setFocus] = useState(0);
  const title = values.title || template.title;
  const subtitle = values.subtitle || template.summary;
  const message = values.message || template.description;
  const photos = splitPhotos(values.photos);
  const audioUrl = values.audio_url;
  const ctaLabel = values.cta_label || "Celebrate it";
  const ctaUrl = values.cta_url || "#";

  const cards = [
    { title: "A beginning", text: subtitle },
    { title: "The middle", text: message },
    { title: "The highlight", text: "A bold moment for the memory." },
  ];

  return (
    <article
      style={{
        minHeight: 760,
        padding: 24,
        background: "linear-gradient(180deg, #fff8ed, #ffefe1)",
        color: "#4b351d",
      }}
    >
      <div
        style={{ maxWidth: 780, margin: "0 auto", display: "grid", gap: 18 }}
      >
        <div
          style={{
            padding: 24,
            borderRadius: 28,
            background:
              "linear-gradient(135deg, rgba(245,195,106,0.26), rgba(255,255,255,0.96))",
            border: "1px solid rgba(173,126,53,0.12)",
            boxShadow: "0 24px 70px rgba(173,126,53,0.12)",
          }}
        >
          <div
            style={{
              letterSpacing: 2,
              textTransform: "uppercase",
              fontSize: 12,
              color: "#9b6e25",
            }}
          >
            {template.category}
          </div>
          <h1
            style={{
              margin: "12px 0 10px",
              fontSize: "clamp(2.2rem, 6vw, 4.8rem)",
              lineHeight: 0.94,
            }}
          >
            {title}
          </h1>
          <p
            style={{
              margin: 0,
              maxWidth: 520,
              fontSize: 18,
              lineHeight: 1.65,
              color: "#71562d",
            }}
          >
            {subtitle}
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 14,
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          }}
        >
          {cards.map((card, index) => (
            <button
              key={card.title}
              type="button"
              onClick={() => setFocus(index)}
              style={{
                textAlign: "left",
                border:
                  index === focus
                    ? "2px solid #f5c36a"
                    : "1px solid rgba(173,126,53,0.12)",
                borderRadius: 18,
                padding: 16,
                background: index === focus ? "#fff8e7" : "#fffdf9",
                boxShadow:
                  index === focus
                    ? "0 12px 30px rgba(173,126,53,0.12)"
                    : "none",
              }}
            >
              <strong>{card.title}</strong>
              <div
                style={{
                  marginTop: 8,
                  color: "#725f3e",
                  lineHeight: 1.6,
                  fontSize: 14,
                }}
              >
                {card.text}
              </div>
            </button>
          ))}
        </div>

        {photos.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr",
              gap: 12,
            }}
          >
            {photos.slice(0, 3).map((src, index) => (
              <img
                key={src}
                src={src}
                alt="Milestone memory"
                loading="lazy"
                onError={handleImgError}
                style={{
                  width: "100%",
                  height: index === 0 ? 260 : 180,
                  objectFit: "cover",
                  borderRadius: 20,
                  border: "1px solid rgba(173,126,53,0.1)",
                }}
              />
            ))}
          </div>
        )}

        {audioUrl && (
          <audio controls style={{ width: "100%" }}>
            <source src={audioUrl} />
          </audio>
        )}

        <a
          href={ctaUrl}
          style={{
            display: "inline-flex",
            alignItems: "center",
            width: "fit-content",
            padding: "14px 18px",
            borderRadius: 999,
            background: "#9b6e25",
            color: "white",
            fontWeight: 900,
            textDecoration: "none",
          }}
        >
          {ctaLabel}
        </a>
      </div>
    </article>
  );
}

export function renderMicrositeTemplate(
  template: Template,
  values: FieldValues,
) {
  if (template.slug === "birthday-template-1") {
    return <BirthdayTemplateFrame template={template} values={values} />;
  }
  if (template.slug === "moonlit-birthday") {
    return <MoonlitBirthdayTemplate template={template} values={values} />;
  }
  if (template.slug === "afterglow-anniversary") {
    return <AfterglowAnniversaryTemplate template={template} values={values} />;
  }
  if (template.slug === "soft-apology") {
    return <SoftApologyTemplate template={template} values={values} />;
  }
  if (template.slug === "wedding-invite") {
    return <WeddingInviteTemplate template={template} values={values} />;
  }
  if (template.slug === "love-note") {
    return <LoveNoteTemplate template={template} values={values} />;
  }
  if (template.slug === "milestone-story") {
    return <MilestoneStoryTemplate template={template} values={values} />;
  }

  const accent = "#f5c36a";

  return <SectionShell template={template} values={values} accent={accent} />;
}

export function TemplatePreview({
  template,
  values,
}: {
  template: Template;
  values: FieldValues;
}) {
  return (
    <div
      style={{
        borderRadius: 28,
        padding: 12,
        background:
          "linear-gradient(180deg, rgba(17,17,17,0.08), rgba(17,17,17,0.02))",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", padding: 8 }}>
        <div
          style={{
            width: "100%",
            maxWidth: 560,
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 18px 50px rgba(0,0,0,0.22)",
            background: "white",
            pointerEvents: "auto",
          }}
        >
          {renderMicrositeTemplate(template, values)}
        </div>
      </div>
    </div>
  );
}

export function MicrositeRenderer({
  template,
  values,
}: {
  template: Template;
  values: FieldValues;
}) {
  return renderMicrositeTemplate(template, values);
}
