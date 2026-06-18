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
  if (!data) return <main className="p-6">Page not found</main>;

  const template = data.template_slug
    ? getTemplateBySlug(data.template_slug)
    : undefined;

  let qr: any = null;
  try {
    if (data?.id) {
      const q = await getPageQR(data.id);
      qr = q?.data ?? null;
    }
  } catch {
    qr = null;
  }

  const fieldValues = data.field_values ?? {
    title: data.title,
    message: data.body,
    photos: data.image_url ? [data.image_url] : [],
  };

  return (
    <main className={`${template ? "p-0 h-screen overflow-hidden" : "p-4"} min-h-screen ${template ? "bg-white" : "bg-background"} overflow-x-hidden`}>
      {template ? (
        <MicrositeRenderer template={template} values={fieldValues} />
      ) : (
        <article className="max-w-[720px] mx-auto w-full p-6 rounded-md border border-border bg-white">
          <h1 className="text-3xl font-heading font-medium text-heading tracking-tight mb-4">{data.title}</h1>
          {data.image_url && <img src={data.image_url} alt={data.title} className="max-w-full rounded-md mb-4" />}
          <div className="text-sm text-muted leading-relaxed" dangerouslySetInnerHTML={{ __html: data.body }} />
        </article>
      )}
      {!template && qr && (
        <div className="mt-6 flex justify-center">
          <h4 className="text-sm font-medium tracking-wider uppercase text-muted mr-3">QR</h4>
          <img src={qr} alt="QR code" className="max-w-[160px]" />
        </div>
      )}
    </main>
  );
}
