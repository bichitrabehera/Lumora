import { STEPS } from "@/constants/steps";

export function HowItWorks() {
  return (
    <section className="px-4 md:px-6 lg:px-8 py-16 md:py-20">
      <div className="max-w-7xl mx-auto w-full">
        <div className="mb-12 text-center">
         
          <h2 className="text-4xl md:text-5xl leading-tight font-heading font-medium text-heading tracking-tight">
            From idea to unforgettable, in four steps.
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {STEPS.map((s) => (
            <div key={s.number} className="text-center">
              <div className="w-12 h-12 rounded-full bg-white border border-border flex items-center justify-center mx-auto mb-4 text-base font-medium text-primary">
                {s.number}
              </div>
              <h3 className="text-lg font-heading font-medium text-heading mb-2">
                {s.title}
              </h3>
              <p className="text-sm text-muted leading-relaxed max-w-[240px] mx-auto">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
