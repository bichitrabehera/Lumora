"use client";

import { useState, type FormEvent } from "react";

import { submitLead } from "@/lib/api";
import type { Template } from "@/lib/site-data";

type LeadFormProps = {
  templates: Template[];
  initialTemplateSlug: string;
};

const defaultMessage =
  "I want a page for a special moment. Please make it feel elegant, personal, and easy to share.";

export default function LeadForm({
  templates,
  initialTemplateSlug,
}: LeadFormProps) {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string>("");
  const [selectedTemplate, setSelectedTemplate] = useState(
    initialTemplateSlug || templates[0]?.slug || "",
  );

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
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong while sending the request.",
      );
    }
  }

  return (
    <article className="template-card" id="lead-form">
      <div className="template-top">
        <span>Request form</span>
        <span>{status === "success" ? "Submitted" : "Ready"}</span>
      </div>
      <h3>Send a launch request</h3>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label className="field">
          <span>Your name</span>
          <input name="name" type="text" placeholder="Aarohi" required />
        </label>
        <label className="field">
          <span>Email address</span>
          <input
            name="email"
            type="email"
            placeholder="you@example.com"
            required
          />
        </label>
        <label className="field">
          <span>Occasion</span>
          <input
            name="occasion"
            type="text"
            placeholder="Birthday surprise"
            required
          />
        </label>
        <label className="field">
          <span>Template</span>
          <select
            name="templateSlug"
            value={selectedTemplate}
            onChange={(event) => setSelectedTemplate(event.target.value)}
            required
          >
            {templates.map((template) => (
              <option key={template.slug} value={template.slug}>
                {template.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field field-full">
          <span>Message</span>
          <textarea
            name="message"
            rows={6}
            defaultValue={defaultMessage}
            placeholder="Describe the mood, copy, photos, and anything else that should be included."
            required
          />
        </label>

        <div className="form-actions field-full">
          <button
            className="primary-btn"
            type="submit"
            disabled={status === "sending"}
          >
            {status === "sending" ? "Sending..." : "Submit request"}
          </button>
          <p className="form-note">
            We will store the lead in FastAPI first, then you can connect the
            response to email or CRM.
          </p>
        </div>

        {status === "success" ? (
          <p className="status-banner success field-full">
            Request submitted successfully.
          </p>
        ) : null}
        {status === "error" ? (
          <p className="status-banner error field-full">{error}</p>
        ) : null}
      </form>
    </article>
  );
}
