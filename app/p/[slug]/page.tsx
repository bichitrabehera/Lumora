import { getPageBySlug, getPageQR } from "@/lib/api";
import { getTemplateBySlug } from "@/lib/site-data";
import { MicrositeRenderer } from "@/components/microsite-templates";

export async function generateStaticParams() {
  return [];
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getPageBySlug(slug);
  if (!data) return <main style={{ padding: 24 }}>Page not found</main>;
  const template = data.template_slug
    ? getTemplateBySlug(data.template_slug)
    : undefined;
  let qr: any = null;
  try {
    if (data?.id) {
      const q = await getPageQR(data.id);
      qr = q?.data ?? null;
    }
  } catch (err) {
    qr = null;
  }

  const fieldValues = data.field_values ?? {
    title: data.title,
    message: data.body,
    photos: data.image_url ? [data.image_url] : [],
  };

  return (
    <main
      style={{
        padding: template ? 0 : 16,
        minHeight: "100vh",
        background: "linear-gradient(180deg, #f6efe2, #fbfaf7)",
        overflowX: "hidden",
      }}
    >
      {template ? (
        <MicrositeRenderer template={template} values={fieldValues} />
      ) : (
        <article
          style={{
            maxWidth: 720,
            margin: "0 auto",
            padding: 24,
            background: "white",
            borderRadius: 24,
          }}
        >
          <h1>{data.title}</h1>
          {data.image_url && (
            <img
              src={data.image_url}
              alt={data.title}
              style={{ maxWidth: "100%", borderRadius: 20 }}
            />
          )}
          <div dangerouslySetInnerHTML={{ __html: data.body }} />
        </article>
      )}
      {!template && qr && (
        <div
          style={{ marginTop: 24, display: "flex", justifyContent: "center" }}
        >
          <h4>QR</h4>
          <img src={qr} alt="QR code" style={{ maxWidth: 160 }} />
        </div>
      )}
    </main>
  );
}
