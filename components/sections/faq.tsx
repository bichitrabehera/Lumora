import { FAQS } from "@/constants/faq";

export function FAQ() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-4xl md:text-5xl leading-tight font-heading font-medium text-heading tracking-tight text-center mb-12">
          Questions you might have.
        </h2>

        <div className="max-w-3xl mx-auto flex flex-col gap-3">
          {FAQS.map((faq) => (
            <details key={faq.question} className="rounded-md p-6 border border-border bg-white cursor-pointer transition-all duration-200">
              <summary className="text-base font-medium text-heading list-none flex justify-between items-center gap-4">
                {faq.question}
                <span className="text-lg text-muted shrink-0">+</span>
              </summary>
              <p className="text-sm text-muted leading-relaxed mt-4">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
