import { TESTIMONIALS } from "@/constants/testimonials";

export function Testimonials() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-20 md:py-24">
      <div className="max-w-7xl mx-auto w-full">
        <p className="text-sm font-medium tracking-wider uppercase text-muted mb-3 text-center">
          Testimonials
        </p>
        <h2 className="text-4xl md:text-5xl leading-tight font-heading font-medium text-heading tracking-tight mb-12 text-center">
          What people have created.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((item, i) => (
            <blockquote key={i} className="p-6 rounded-md border border-border bg-white m-0 transition-all duration-200">
              <p className="text-base leading-relaxed text-body mb-4 italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="flex justify-between items-center">
                <strong className="text-sm font-medium text-heading">{item.name}</strong>
                <span className="text-sm text-muted">{item.tag}</span>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
