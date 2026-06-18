import React from "react";
import { siteData } from "@/lib/site-data";

type EditorToolbarProps = {
  templateSlug: string;
  templateTitle?: string;
  templateSummary?: string;
  onChangeTemplate: (slug: string) => void;
};

export function EditorToolbar({
  templateSlug,
  templateTitle,
  templateSummary,
  onChangeTemplate,
}: EditorToolbarProps) {
  return (
    <div className="flex justify-between items-center gap-5 flex-wrap mb-8 p-6 rounded-md border border-border bg-white">
      <div>
        <p className="m-0 uppercase tracking-wider text-xs text-muted font-medium">
          Page Editor
        </p>
        <h2 className="m-1 text-2xl font-heading font-medium text-heading">
          Editing {templateTitle}
        </h2>
        <p className="m-0 text-muted text-sm">
          {templateSummary}
        </p>
      </div>
      <div className="flex gap-3 items-center">
        <span className="text-sm text-muted font-medium">
          Switch Template:
        </span>
        <select
          value={templateSlug}
          onChange={(e) => onChangeTemplate(e.target.value)}
          className="px-4 h-11 rounded-md border border-border bg-white text-body font-medium text-sm cursor-pointer outline-none"
        >
          {siteData.templates.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.title}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
