"use client";
import { useState, type FormEvent } from "react";
import { submitLead } from "@/lib/api";
import type { Template } from "@/lib/site-data";

type LeadFormProps = { templates: Template[]; initialTemplateSlug: string };

const defaultMessage = "I want a page for a special moment. Please make it feel elegant, personal, and easy to share.";

export default function LeadForm({ templates, initialTemplateSlug }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState(initialTemplateSlug || templates[0]?.slug || "");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      occasion: String(formData.get("occasion") ?? "").trim(),
      templateSlug: String(formData.get("templateSlug") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };
    try {
      await submitLead(payload);
      setStatus("success");
      event.currentTarget.reset();
      setSelectedTemplate(templates[0]?.slug || "");
    } catch (submissionError) {
      setStatus("error");
      setError(submissionError instanceof Error ? submissionError.message : "Something went wrong while sending the request.");
    }
  }

  const inputBase = "w-full px-4 h-11 rounded-md border border-border bg-white text-body text-base font-normal outline-none transition-all duration-200 focus:border-primary focus:ring-2 focus:ring-primary/10";

  return (
    <div className="p-6 rounded-md border border-border bg-white">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-base font-medium text-heading">Request form</h3>
        <span className={`text-sm ${status === "success" ? "text-green-700" : "text-muted"}`}>{status === "success" ? "Submitted" : "Ready"}</span>
      </div>
      <p className="text-sm text-muted mb-6 leading-relaxed">Fill this out and we&apos;ll get back to you.</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="text-sm font-medium tracking-wider uppercase text-muted flex flex-col gap-2">
          Your name
          <input name="name" type="text" placeholder="Aarohi" required className={inputBase} />
        </label>
        <label className="text-sm font-medium tracking-wider uppercase text-muted flex flex-col gap-2">
          Email address
          <input name="email" type="email" placeholder="you@example.com" required className={inputBase} />
        </label>
        <label className="text-sm font-medium tracking-wider uppercase text-muted flex flex-col gap-2">
          Occasion
          <input name="occasion" type="text" placeholder="Birthday surprise" required className={inputBase} />
        </label>
        <label className="text-sm font-medium tracking-wider uppercase text-muted flex flex-col gap-2">
          Template
          <select name="templateSlug" value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} required className={inputBase}>
            {templates.map((template) => (
              <option key={template.slug} value={template.slug}>{template.title}</option>
            ))}
          </select>
        </label>
        <label className="text-sm font-medium tracking-wider uppercase text-muted flex flex-col gap-2">
          Message
          <textarea name="message" rows={5} defaultValue={defaultMessage} required className={`${inputBase} resize-y min-h-[100px] h-auto`} />
        </label>

        <div className="flex flex-col gap-3 mt-2">
          <button type="submit" disabled={status === "sending"} className="inline-flex items-center justify-center px-8 py-3 rounded-md bg-primary text-white text-base font-medium border-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed hover:bg-[#A64850] transition-all duration-200">
            {status === "sending" ? "Sending..." : "Submit request"}
          </button>
          <p className="text-sm text-muted leading-relaxed">We&apos;ll review your request and reach out within 24 hours.</p>
        </div>

        {status === "success" && (
          <p className="px-4 py-3 rounded-md bg-success-bg text-success-text text-sm border border-[rgba(79,195,132,0.2)]">Request submitted successfully.</p>
        )}
        {status === "error" && (
          <p className="px-4 py-3 rounded-md bg-error-bg text-error-text text-sm border border-[rgba(188,83,91,0.2)]">{error}</p>
        )}
      </form>
    </div>
  );
}
