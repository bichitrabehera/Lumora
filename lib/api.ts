import {
  siteData,
  type LeadSubmission,
  type SiteData,
  type Template,
} from "@/lib/site-data";

const DEFAULT_BACKEND_URL = "https://loveypage.onrender.com";

export function getBackendBaseUrl() {
  return DEFAULT_BACKEND_URL;
}

const backendBaseUrl = DEFAULT_BACKEND_URL;

const configuredBackendBaseUrl = DEFAULT_BACKEND_URL;

async function fetchJson<T>(path: string): Promise<T | null> {
  if (!backendBaseUrl) {
    return null;
  }

  try {
    const response = await fetch(`${backendBaseUrl}${path}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    return (await response.json()) as T;
  } catch {
    return null;
  }
}

export async function loadSiteData(): Promise<SiteData> {
  return siteData;
}

export async function loadTemplates(): Promise<Template[]> {
  return siteData.templates;
}

export async function loadTemplate(slug: string): Promise<Template | null> {
  return siteData.templates.find((template) => template.slug === slug) ?? null;
}

export async function submitLead(payload: LeadSubmission) {
  if (!configuredBackendBaseUrl && !backendBaseUrl) {
    throw new Error(
      "Set NEXT_PUBLIC_BACKEND_URL or BACKEND_URL to submit leads.",
    );
  }

  const response = await fetch(`${backendBaseUrl}/api/leads`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to submit lead request.");
  }

  return response.json();
}

export async function getUploadSignature() {
  if (!backendBaseUrl) return null;

  const res = await fetch(`${backendBaseUrl}/api/uploads/sign`);
  if (!res.ok) return null;
  return res.json();
}

export async function createRazorpayOrder(amount: number) {
  if (!backendBaseUrl) throw new Error("BACKEND_URL not set");
  const res = await fetch(`${backendBaseUrl}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  if (!res.ok) throw new Error("Unable to create order");
  return res.json();
}

export async function createOrderForPage(amount: number, pageId?: number) {
  if (!backendBaseUrl) throw new Error("BACKEND_URL not set");
  const res = await fetch(`${backendBaseUrl}/api/payments/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount, page_id: pageId ?? null }),
  });
  if (!res.ok) throw new Error("Unable to create order");
  return res.json();
}

export async function getPageQR(pageId: number) {
  if (!backendBaseUrl) throw new Error("BACKEND_URL not set");
  const res = await fetch(`${backendBaseUrl}/api/qr/page/${pageId}`);
  if (!res.ok) return null;
  return res.json();
}

export async function startTemplate(payload: any, token?: string) {
  const base = (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    ""
  ).replace(/\/$/, "");
  const res = await fetch(`${base}/api/pages/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({
      title: `${payload.template_slug} draft`,
      body: payload.body ?? "",
      image_url: payload.image_url ?? null,
      template_slug: payload.template_slug,
      requested_slug: payload.requested_slug ?? null,
      field_values: payload.field_values ?? {},
      is_draft: true,
    }),
  });
  if (!res.ok) throw new Error("Unable to create template draft");
  return res.json();
}

export async function updatePage(pageId: number, payload: any, token?: string) {
  const base = (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    ""
  ).replace(/\/$/, "");
  const res = await fetch(`${base}/api/pages/${pageId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Unable to update page");
  return res.json();
}

export async function saveDraft(
  pageId: number | null,
  payload: any,
  token?: string,
) {
  if (!pageId) {
    return startTemplate(payload, token);
  }
  return updatePage(pageId, payload, token);
}

export async function confirmRazorpayPayment(payload: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) {
  if (!backendBaseUrl) throw new Error("BACKEND_URL not set");
  const res = await fetch(`${backendBaseUrl}/api/payments/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Unable to confirm payment");
  return res.json();
}

export async function savePage(payload: any, token?: string) {
  if (!configuredBackendBaseUrl && !backendBaseUrl)
    throw new Error("BACKEND_URL not set");
  const base = (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    ""
  ).replace(/\/$/, "");
  const res = await fetch(`${base}/api/pages/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Unable to save page");
  return res.json();
}

export async function publishPage(pageId: number, token?: string) {
  const base = (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    ""
  ).replace(/\/$/, "");
  const res = await fetch(`${base}/api/pages/${pageId}/publish`, {
    method: "POST",
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  if (!res.ok) throw new Error("Unable to publish page");
  return res.json();
}

export async function getPageBySlug(slug: string) {
  const base = (
    process.env.NEXT_PUBLIC_BACKEND_URL ??
    process.env.BACKEND_URL ??
    ""
  ).replace(/\/$/, "");
  const res = await fetch(`${base}/api/pages/${slug}`);
  if (!res.ok) return null;
  return res.json();
}
