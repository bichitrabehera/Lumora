"use client";

import React, { useEffect, useRef } from "react";
import type { Template } from "@/lib/site-data";

function TemplateFrame({
  template,
  values,
  fullSize = false,
}: {
  template: Template;
  values: Record<string, any>;
  fullSize?: boolean;
}) {
  const frameRef = useRef<HTMLIFrameElement | null>(null);
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
    <div className={`w-full ${fullSize ? "h-screen min-h-screen" : ""} bg-white overflow-hidden`}
      style={fullSize ? undefined : { height: "760px", minHeight: "760px" }}>
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
        className="w-full border-none block"
        style={{ height: fullSize ? "100vh" : "760px", minHeight: fullSize ? "100vh" : "760px" }}
        sandbox="allow-scripts allow-same-origin allow-modals allow-downloads"
      />
    </div>
  );
}

export function renderMicrositeTemplate(
  template: Template,
  values: Record<string, any>,
  fullSize = false,
) {
  return <TemplateFrame template={template} values={values} fullSize={fullSize} />;
}

export function TemplatePreview({
  template,
  values,
}: {
  template: Template;
  values: Record<string, any>;
}) {
  return (
    <div className="rounded-md p-3 bg-background border border-border">
      <div className="flex justify-center p-2">
        <div className="w-full max-w-[560px] rounded-md overflow-hidden border border-border bg-white pointer-events-auto">
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
  return renderMicrositeTemplate(template, values, true);
}
