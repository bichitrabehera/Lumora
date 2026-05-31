import Editor from "./editor";
import React from "react";
import { getTemplateBySlug } from "@/lib/site-data";

export const metadata = {
  title: "Editor",
};

export default async function EditorPage({
  searchParams,
}: {
  searchParams?: Promise<{ template?: string }>;
}) {
  const params = (await searchParams) ?? {};
  const template = params.template ? getTemplateBySlug(params.template) : null;

  return (
    <main style={{ padding: 24, maxWidth: 1200, margin: "0 auto" }}>
      <div
        style={{
          marginBottom: 20,
          padding: 24,
          borderRadius: 28,
          background:
            "linear-gradient(135deg, rgba(255,199,154,0.2), rgba(255,255,255,0.92))",
          border: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <p
          style={{
            margin: 0,
            textTransform: "uppercase",
            letterSpacing: 2,
            fontSize: 12,
          }}
        >
          Page Editor
        </p>
        <h2 style={{ margin: "8px 0 8px" }}>
          {template
            ? `Editing ${template.title}`
            : "Build a page from a template"}
        </h2>
        <p style={{ margin: 0, maxWidth: 720, color: "#555" }}>
          {template
            ? template.summary
            : "Choose a template, edit the text and media, then preview the final page before publishing."}
        </p>
        {template && (
          <div
            style={{
              marginTop: 16,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
            }}
          >
            <span
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.06)",
              }}
            >
              {template.category}
            </span>
            <span
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.06)",
              }}
            >
              {template.bestFor}
            </span>
            <span
              style={{
                padding: "8px 12px",
                borderRadius: 999,
                background: "rgba(0,0,0,0.06)",
              }}
            >
              {template.price}
            </span>
          </div>
        )}
      </div>
      <Editor />
    </main>
  );
}
