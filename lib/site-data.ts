import siteDataJson from "@/content/site-data.json";

export type SiteData = typeof siteDataJson;
export type Template = SiteData["templates"][number];
export type TemplateField = {
  key: string;
  type: "text" | "textarea" | "image" | "audio" | "gallery";
  label: string;
};

export type TemplateSchema = {
  fields: TemplateField[];
};

export type LeadSubmission = {
  name: string;
  email: string;
  occasion: string;
  templateSlug: string;
  message: string;
};

export const siteData = siteDataJson as SiteData;

export function getTemplateBySlug(slug: string): Template | undefined {
  return siteData.templates.find((template) => template.slug === slug);
}

export function getTemplateSchema(template: Template): TemplateSchema | null {
  return (template as Template & { schema?: TemplateSchema }).schema ?? null;
}
