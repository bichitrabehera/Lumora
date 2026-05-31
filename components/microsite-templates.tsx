"use client";

import React, { useEffect, useRef, useState } from "react";
import type { Template } from "@/lib/site-data";

function TemplateFrame({
  template,
  values,
}: {
  template: Template;
  values: Record<string, any>;
}) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
  // use the bundle from template.assets if available, otherwise default fallback
  const bundle = (template as any).assets?.bundle ?? "/assets/birthday-template-1/index.html";

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
        sandbox="allow-scripts allow-same-origin allow-modals allow-downloads"
      />
    </div>
  );
}

export function renderMicrositeTemplate(
  template: Template,
  values: Record<string, any>,
) {
  return <TemplateFrame template={template} values={values} />;
}

export function TemplatePreview({
  template,
  values,
}: {
  template: Template;
  values: Record<string, any>;
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
  values: Record<string, any>;
}) {
  return renderMicrositeTemplate(template, values);
}
