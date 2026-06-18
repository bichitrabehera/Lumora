import React from "react";
import { siteData } from "@/lib/site-data";

type TemplateSelectorProps = {
  onSelect: (slug: string) => void;
};

export function TemplateSelector({ onSelect }: TemplateSelectorProps) {
  return (
    <div className="max-w-7xl mx-auto my-10 px-4 md:px-6 lg:px-8">
      <div className="text-center mb-12 bg-background py-12 px-8 rounded-md border border-border">
        <span className="uppercase tracking-wider text-xs font-medium text-muted inline-block mb-3">
          Creative Studio
        </span>
        <h2 className="text-4xl md:text-5xl font-heading font-medium text-heading m-0 mb-4">
          Choose a Template to Customize
        </h2>
        <p className="text-muted max-w-xl mx-auto text-base leading-relaxed">
          Select one of our premium, config-driven mobile-first templates to build
          your personalized microsite.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {siteData.templates.map((template) => (
          <div
            key={template.slug}
            className="flex flex-col justify-between p-6 rounded-md border border-border bg-white cursor-pointer transition-all duration-200"
            onClick={() => onSelect(template.slug)}
          >
            <div>
              <span className="inline-block px-3 py-1.5 rounded-md bg-primary/10 text-primary text-xs font-medium uppercase tracking-wider">
                {template.category}
              </span>
              <h3 className="mt-5 mb-2 text-xl font-heading font-medium text-heading">
                {template.title}
              </h3>
              <p className="text-muted text-sm leading-relaxed">
                {template.summary}
              </p>
            </div>
            <div className="flex justify-between items-center mt-8 pt-5 border-t border-border">
              <span className="font-medium text-heading text-base">
                {template.price}
              </span>
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
